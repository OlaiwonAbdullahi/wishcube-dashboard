"use client";
import { useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { resetPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    if (!(minLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
      toast.error("Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token, password);
      if (response.success) {
        toast.success("Password reset successfully! You can now log in.");
        router.push("/");
      } else {
        toast.error(response.message || "Failed to reset password");
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
                Reset Password
              </CardTitle>
              <CardDescription className="text-neutral-600 text-center">
                Enter your new password below.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2 text-left">
                <Label className="text-xs text-neutral-500">New Password</Label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="bg-transparent border-[#191A23]/50 rounded-sm h-10 text-sm placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-xs text-neutral-500">Confirm New Password</Label>
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-transparent border-[#191A23]/50 rounded-sm h-10 text-sm placeholder:text-neutral-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                disabled={loading}
                type="submit"
                className="w-full cursor-pointer rounded-sm h-10 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
              <Button asChild variant="link" size="sm" className="text-xs cursor-pointer text-neutral-500 hover:text-neutral-500/90">
                <Link href="/">Back to Login</Link>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
