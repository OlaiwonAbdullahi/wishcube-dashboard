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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerVendor, uploadVendorLogo } from "@/lib/vendor";
import { PasswordStrength, isPasswordValid } from "@/components/password-strength";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  ArrowRight01Icon,
  ImageAdd01Icon,
  Cancel01Icon,
  Tick02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { useRef, useState } from "react";
import Link from "next/link";

export default function JoinAsVendor() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cakes");

  const categories = [
    "Cakes",
    "Flowers",
    "Fashion",
    "Gifts",
    "Food",
    "Accessories",
    "Art & Decor",
    "Beauty & Spa",
    "Events & Parties",
    "Personalized Gifts",
  ];

  const handleRegisterVendor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      toast.error("Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
      return;
    }

    setLoading(true);
    try {
      const response = await registerVendor({
        ownerName,
        email,
        password,
        storeName,
        category,
        description,
      });

      if (response.success) {
        // Don't log the vendor in yet - the account still needs admin
        // approval, so an active session here would be misleading.
        setSubmitted(true);
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen w-full flex items-center font-space justify-center px-4 py-16 bg-[#F3F3F3]">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="w-full border-4 border-[#191A23] rounded-sm shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] bg-white">
            <CardContent className="p-8 text-center space-y-5">
              <div className="size-14 mx-auto rounded-sm border-2 border-[#191A23] bg-[#B4F8C8] flex items-center justify-center">
                <HugeiconsIcon icon={Tick02Icon} size={26} color="#191A23" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-black text-[#191A23] uppercase tracking-tight">
                  Application submitted
                </CardTitle>
                <CardDescription className="text-sm font-medium text-neutral-600">
                  Thanks for applying, {storeName || "there"}! Our team
                  reviews every new store before it goes live.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 justify-center text-[11px] font-black uppercase tracking-widest text-neutral-500 border-2 border-dashed border-[#191A23]/20 rounded-sm py-3 px-4">
                <HugeiconsIcon icon={Clock01Icon} size={14} />
                Pending admin approval
              </div>
              <p className="text-xs text-neutral-400">
                We&apos;ll email <span className="font-bold">{email}</span>{" "}
                once your store is approved. You can log in after that.
              </p>
              <Link
                href="/vendor/login"
                className="inline-flex items-center gap-2 justify-center w-full h-12 bg-[#191A23] text-white rounded-sm font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(180,248,200,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Go to vendor login
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center font-space justify-center px-4 py-16 bg-[#F3F3F3]">
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="w-full border-4 border-[#191A23] rounded-sm shadow-[8px_8px_0px_0px_rgba(25,26,35,1)] bg-white">
          <CardHeader className="border-b-4 border-[#191A23] p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-pink-50 border-2 border-[#191A23] rounded-sm">
                <HugeiconsIcon
                  icon={Store01Icon}
                  size={24}
                  className="text-pink-500"
                />
              </div>
              <CardTitle className="text-3xl font-black text-[#191A23] uppercase tracking-tight">
                Vendor Onboarding
              </CardTitle>
            </div>
            <CardDescription className="text-sm font-bold uppercase text-neutral-500 tracking-wider">
              Register your store
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleRegisterVendor} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#191A23]">
                    Owner Full Name
                  </Label>
                  <Input
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="John Doe"
                    className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#191A23]">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vendor@example.com"
                    className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#191A23]">
                    Password
                  </Label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
                  />
                  <PasswordStrength password={password} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#191A23]">
                    Store Name
                  </Label>
                  <Input
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Sweet Delights"
                    className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-[#191A23]">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full py-6 border-2 border-[#191A23] rounded-sm h-12 px-3 text-sm font-bold bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-[#191A23] rounded-sm font-bold">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="focus:bg-[#B4F8C8] focus:text-[#191A23] cursor-pointer"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-[#191A23]">
                  Description (Optional)
                </Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your store..."
                  className="w-full border-2 border-[#191A23] rounded-sm h-24 p-3 text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#191A23] text-white rounded-sm font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(180,248,200,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                {loading ? "Registering..." : "Create Vendor Account"}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={18}
                  className="ml-2"
                />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="border-t-2 border-[#191A23]/10 bg-neutral-50 p-6 flex justify-center">
            <Link
              href="/login"
              className="text-[10px] font-black uppercase text-neutral-400 hover:text-[#191A23] transition-colors"
            >
              Already have an account? Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
