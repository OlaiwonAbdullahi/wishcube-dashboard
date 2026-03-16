"use client";

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
import { useState, FormEvent, useEffect } from "react";
import { login, getAuth, googleAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    const auth = getAuth();
    if (auth) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        toast.success("Logged in successfully!");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((response as any)?.data?.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const response = await googleAuth(tokenResponse.access_token);
        if (response.success) {
          toast.success("Logged in with Google successfully!");
          router.push("/dashboard");
        } else {
          toast.error(response.message || "Google login failed");
        }
      } catch (error) {
        toast.error("An unexpected error occurred during Google login");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google authentication failed");
    },
  });

  return (
    <div>
      <div className="min-h-screen w-full flex items-center font-space justify-center px-4 py-16">
        <div className="relative w-full max-w-4xl flex gap-10 justify-center ">
          <form onSubmit={handleLogin} className="w-full max-w-md">
            <Card className="w-full border border-[#191A23] border-b-4 bg-[#F3F3F3] ">
              <CardHeader className="space-y-1">
                <CardTitle className="text-3xl text-[#191A23] font-bold text-center">
                  Login
                </CardTitle>
                <CardDescription className="text-neutral-600 text-center">
                  Enter your details to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex justify-center w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleGoogleLogin()}
                      disabled={loading}
                      className="w-full flex h-10 rounded-md  items-center justify-center gap-2 border-[#191A23] border-b-4 hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 transition-all bg-white"
                    >
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google Logo"
                        className="w-4 h-4"
                      />
                      <span className="font-bold text-[#191A23] text-base cursor-pointer">
                        {loading ? "Connecting..." : "Continue with Google"}
                      </span>
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-neutral-300"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#F3F3F3] px-2 text-neutral-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <Label className="text-xs text-neutral-500">
                    Email address
                  </Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-transparent border-[#191A23]/50 rounded-sm h-10 text-sm placeholder:text-neutral-500"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-neutral-500">Password</Label>
                    <Link
                      href="#"
                      className="text-xs text-neutral-500 hover:text-neutral-400 underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
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
                  {loading ? "Logging in..." : "Log in"}
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  asChild
                  className="text-xs cursor-pointer text-neutral-500 hover:text-neutral-500/90"
                >
                  <Link href="/signup">
                    Don&apos;t have an account? Sign up
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
