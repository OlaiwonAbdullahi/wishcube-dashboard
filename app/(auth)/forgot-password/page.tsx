"use client";
import { useState, FormEvent } from "react";
import { forgotPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setSuccess(true);
        toast.success("Password reset email sent!");
      } else {
        toast.error(response.message || "Failed to send reset email");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center font-space justify-center px-4 py-16">
      <div className="relative w-full max-w-4xl flex gap-10 justify-center ">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <Card className="w-full border border-[#191A23] border-b-4 bg-[#F3F3F3]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl text-[#191A23] font-bold text-center">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-neutral-600 text-center">
                {success ? "Check your email for the reset link." : "Enter your email to receive a password reset link."}
              </CardDescription>
            </CardHeader>
            {!success && (
              <CardContent className="grid gap-4">
                <div className="space-y-2 text-left">
                  <Label className="text-xs text-neutral-500">Email address</Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-transparent border-[#191A23]/50 rounded-sm h-10 text-sm placeholder:text-neutral-500"
                  />
                </div>
              </CardContent>
            )}
            <CardFooter className="flex flex-col gap-3">
              {!success ? (
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full cursor-pointer rounded-sm h-10 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              ) : (
                <Button asChild className="w-full cursor-pointer rounded-sm h-10 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  <Link href="/">Back to Login</Link>
                </Button>
              )}
              <Button asChild variant="link" size="sm" className="text-xs cursor-pointer text-neutral-500 hover:text-neutral-500/90">
                <Link href="/">Cancel and return to login</Link>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
