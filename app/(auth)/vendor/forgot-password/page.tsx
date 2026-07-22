"use client";
import { useState, FormEvent } from "react";
import { vendorForgotPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

export default function VendorForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await vendorForgotPassword(email);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 font-space animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <Card className="w-full border-2 pt-0 border-[#191A23] rounded-sm bg-white shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
            <CardHeader className="space-y-2 border-b-2 border-[#191A23] bg-[#F3F3F3] p-6">
              <CardTitle className="text-2xl text-[#191A23] font-black uppercase tracking-tight text-center">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-[#191A23] font-bold uppercase text-[10px] tracking-widest text-center opacity-60">
                {success
                  ? "Check your email for the reset link"
                  : "Enter your vendor account email"}
              </CardDescription>
            </CardHeader>
            {!success && (
              <CardContent className="grid gap-6 p-8">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-wider text-[#191A23]">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vendor@example.com"
                    className="h-12 border-2 border-[#191A23] rounded-sm bg-white font-bold placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </CardContent>
            )}
            <CardFooter className="flex flex-col gap-4 p-8 pt-0">
              {!success ? (
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full h-12 border-2 border-[#191A23] rounded-sm bg-[#B4F8C8] text-[#191A23] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full h-12 border-2 border-[#191A23] rounded-sm bg-[#B4F8C8] text-[#191A23] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  <Link href="/vendor/login">Back to Vendor Login</Link>
                </Button>
              )}
              <Link
                href="/vendor/login"
                className="text-[10px] font-black uppercase text-neutral-500 hover:text-[#191A23] transition-colors text-center"
              >
                Cancel and return to login
              </Link>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
