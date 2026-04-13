"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const params = useParams();
  const token = params.token as string;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      const response = await verifyEmail(token);
      if (response.success) {
        setStatus("success");
        setMessage(response.message || "Email verified successfully! You can now log in.");
        toast.success("Email verified!");
      } else {
        setStatus("error");
        setMessage(response.message || "Invalid or expired verification token.");
        toast.error("Verification failed");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen w-full flex items-center font-space justify-center px-4 py-16">
      <Card className="w-full max-w-md border border-[#191A23] border-b-4 bg-[#F3F3F3]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl text-[#191A23] font-bold text-center">
            Email Verification
          </CardTitle>
          <CardDescription className="text-neutral-600 text-center">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center flex-col gap-4">
          {status === "success" && (
            <Button asChild className="w-full cursor-pointer rounded-sm h-10 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
              <Link href="/">Proceed to Login</Link>
            </Button>
          )}
          {status === "error" && (
             <Button asChild variant="outline" className="w-full cursor-pointer rounded-sm h-10 border-[#191A23] border-b-2 hover:translate-y-[2px] transition-all bg-white">
              <Link href="/">Back to Login</Link>
            </Button>
          )}
          {status === "loading" && (
            <div className="flex justify-center p-4">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#191A23]"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
