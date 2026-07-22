"use client";
import { useState, FormEvent, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { vendorResetPassword, validateVendorResetToken } from "@/lib/auth";
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
import { PasswordStrength, isPasswordValid } from "@/components/password-strength";
import Link from "next/link";
import { toast } from "sonner";

type TokenState = "checking" | "valid" | "invalid";

export default function VendorResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [tokenState, setTokenState] = useState<TokenState>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    validateVendorResetToken(token).then((res) => {
      if (cancelled) return;
      setTokenState(res.success ? "valid" : "invalid");
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!isPasswordValid(password)) {
      toast.error("Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
      return;
    }

    setLoading(true);
    try {
      const response = await vendorResetPassword(token, password);
      if (response.success) {
        toast.success("Password reset successfully! You can now log in.");
        router.push("/vendor/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (tokenState === "checking") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 font-space">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#191A23]" />
      </div>
    );
  }

  if (tokenState === "invalid") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 font-space animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full max-w-md">
          <Card className="w-full border-2 pt-0 border-[#191A23] rounded-sm bg-white shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
            <CardHeader className="space-y-2 border-b-2 border-[#191A23] bg-[#F3F3F3] p-6">
              <CardTitle className="text-2xl text-[#191A23] font-black uppercase tracking-tight text-center">
                Link Expired
              </CardTitle>
              <CardDescription className="text-[#191A23] font-bold uppercase text-[10px] tracking-widest text-center opacity-60">
                Request a new reset link to continue
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-4 p-8">
              <Button
                asChild
                className="w-full h-12 border-2 border-[#191A23] rounded-sm bg-[#B4F8C8] text-[#191A23] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                <Link href="/vendor/forgot-password">Request a new link</Link>
              </Button>
              <Link
                href="/vendor/login"
                className="text-[10px] font-black uppercase text-neutral-500 hover:text-[#191A23] transition-colors"
              >
                Back to login
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 font-space animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <Card className="w-full border-2 pt-0 border-[#191A23] rounded-sm bg-white shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
            <CardHeader className="space-y-2 border-b-2 border-[#191A23] bg-[#F3F3F3] p-6">
              <CardTitle className="text-2xl text-[#191A23] font-black uppercase tracking-tight text-center">
                Reset Password
              </CardTitle>
              <CardDescription className="text-[#191A23] font-bold uppercase text-[10px] tracking-widest text-center opacity-60">
                Enter your new password
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 p-8">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-wider text-[#191A23]">
                  New Password
                </Label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 border-2 border-[#191A23] rounded-sm bg-white font-bold placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <PasswordStrength password={password} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-wider text-[#191A23]">
                  Confirm New Password
                </Label>
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 border-2 border-[#191A23] rounded-sm bg-white font-bold placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-8 pt-0">
              <Button
                disabled={loading}
                type="submit"
                className="w-full h-12 border-2 border-[#191A23] rounded-sm bg-[#B4F8C8] text-[#191A23] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
              <Link
                href="/vendor/login"
                className="text-[10px] font-black uppercase text-neutral-500 hover:text-[#191A23] transition-colors"
              >
                Back to login
              </Link>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
