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

export default function SignUp() {
  return (
    <div>
      <div className="min-h-screen w-full flex items-center font-space justify-center px-4 py-16">
        <div className="relative w-full max-w-4xl flex gap-10 justify-center ">
          <Card className="w-full max-w-md border border-[#191A23] border-b-4 bg-[#F3F3F3] ">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl text-[#191A23] font-bold text-center">
                Signup
              </CardTitle>
              <CardDescription className="text-neutral-600 text-center">
                Create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2 text-left">
                <Label className="text-xs text-neutral-500">Name</Label>
                <Input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="bg-transparent border-[#191A23]/50 rounded-sm h-10 text-sm placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-xs text-neutral-500">
                  Email address
                </Label>
                <Input
                  type="email"
                  required
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
                  placeholder="Your password"
                  className="bg-transparent border-[#191A23]/50 rounded-sm h-10 text-sm placeholder:text-neutral-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full cursor-pointer rounded-sm h-10 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Signup
              </Button>
              <Button
                variant="link"
                size="sm"
                asChild
                className="text-xs cursor-pointer text-neutral-500 hover:text-neutral-500/90"
              >
                <Link href="/">Already have an account? Login</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
