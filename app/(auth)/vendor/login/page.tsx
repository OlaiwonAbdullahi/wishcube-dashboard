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
import { useState, FormEvent } from "react";
import { vendorLogin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await vendorLogin(email, password);
      if (response.success) {
        toast.success("Logged in successfully!");
        router.push("/mystore");
      } else {
        toast.error(response.message || "Login failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 font-space animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <Card className="w-full border-2 pt-0 border-[#191A23] rounded-sm bg-white shadow-[4px_4px_0px_0px_rgba(25,26,35,1)]">
            <CardHeader className="space-y-2 border-b-2 border-[#191A23] bg-[#F3F3F3] p-6">
              <div className="flex justify-center mb-2">
                <img
                  src="/logo.png"
                  alt="WishCube Logo"
                  className="w-12 h-12 rounded-md border-2 border-[#191A23] shadow-[3px_3px_0px_0px_rgba(25,26,35,1)]"
                />
              </div>
              <CardTitle className="text-3xl text-[#191A23] font-black uppercase tracking-tight text-center">
                Vendor Login
              </CardTitle>
              <CardDescription className="text-[#191A23] font-bold uppercase text-[10px] tracking-widest text-center opacity-60">
                Access your store dashboard
              </CardDescription>
            </CardHeader>
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-black uppercase tracking-wider text-[#191A23]">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-[10px] font-black uppercase text-neutral-500 hover:text-[#191A23] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Logging in..." : "Log in"}
              </Button>
              <div className="text-center">
                <Link
                  href="/join-as-vendor"
                  className="text-[10px] font-black uppercase text-neutral-500 hover:text-[#191A23] transition-colors"
                >
                  Don&apos;t have an account? Join as a Vendor
                </Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
