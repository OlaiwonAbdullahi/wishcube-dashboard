"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export type PaystackVerifyState =
  | "verifying"
  | "pending"
  | "success"
  | "error"
  | "invalid_ref";

interface VerifyResult<T> {
  success: boolean;
  pending?: boolean;
  message?: string;
  data?: T;
}

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 4000;

/**
 * Shared polling logic for Paystack callback/verify pages (wallet funding,
 * gift purchase, subscription, etc). Distinguishes a genuinely still-pending
 * Paystack transaction (retries a few times) from a hard failure, and is
 * safe to call repeatedly since the backend verify endpoints are idempotent.
 */
export function usePaystackVerify<T>(
  verifyFn: (reference: string) => Promise<VerifyResult<T>>,
) {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [state, setState] = useState<PaystackVerifyState>("verifying");
  const [data, setData] = useState<T | null>(null);
  const [message, setMessage] = useState("");
  const attemptsRef = useRef(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!reference || !reference.trim()) {
      setState("invalid_ref");
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const attempt = async () => {
      try {
        const res = await verifyFn(reference);
        if (cancelled) return;

        if (res.success && res.data) {
          setData(res.data);
          setState("success");
          return;
        }

        if (res.pending && attemptsRef.current < MAX_ATTEMPTS) {
          attemptsRef.current += 1;
          setState("pending");
          timeoutId = setTimeout(attempt, RETRY_DELAY_MS);
          return;
        }

        setState("error");
        setMessage(
          res.message ||
            "We could not verify this transaction. The reference may be invalid, expired, or already used.",
        );
      } catch {
        if (cancelled) return;
        setState("error");
        setMessage(
          "A network error occurred while verifying your payment. Please check your internet connection and try again.",
        );
      }
    };

    attempt();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  return { state, data, message, reference };
}
