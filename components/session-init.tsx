"use client";

import { useEffect } from "react";
import { initFetchInterceptor } from "@/lib/fetch-interceptor";

/** Mounted once in the root layout to wire up the token-refresh fetch interceptor. */
export function SessionInit() {
  useEffect(() => {
    initFetchInterceptor();
  }, []);
  return null;
}
