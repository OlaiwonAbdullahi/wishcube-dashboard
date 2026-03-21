/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getAuth, setAuth } from "@/lib/auth";
import { registerVendor, uploadVendorLogo } from "@/lib/vendor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  ArrowRight01Icon,
  ImageAdd01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function JoinAsVendor() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1: Registration
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cakes");

  // Step 2: Logo
  const [logo, setLogo] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setCurrentUser(auth.user);
      // If they are already registered/logged in as a vendor, go to logo upload or dashboard
      // But for a new registration flow, we'll let them stay on step 2 if they just registered
    }
  }, []);

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const response = await uploadVendorLogo(file);
      if (response.success && response.data) {
        setLogo(response.data.logo);
        toast.success("Logo uploaded successfully");
      } else {
        toast.error(response.message || "Failed to upload logo");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during logo upload");
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRegisterVendor = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
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

      if (response.success && response.data) {
        toast.success("Vendor account created successfully!");

        // Transform vendor to user object for setAuth
        const authData = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: {
            id: response.data.vendor.id || response.data.vendor._id,
            name: response.data.vendor.ownerName,
            email: response.data.vendor.email,
            role: "vendor",
            authProvider: "local",
            avatar: response.data.vendor.logo,
          },
        };

        setAuth(authData);
        setCurrentUser(authData.user);
        setStep(2);
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

  const handleFinish = () => {
    if (!logo) {
      toast.error("Please upload a logo to continue.");
      return;
    }
    toast.success("Registration complete! Please wait for admin approval.");
    router.push("/mystore");
  };

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
              {step === 1
                ? "Step 1: Register your store"
                : "Step 2: Upload your logo"}
            </CardDescription>

            <div className="flex gap-2 mt-6">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 border-2 border-[#191A23] rounded-full transition-all ${
                    step >= s ? "bg-[#B4F8C8]" : "bg-neutral-100"
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {step === 1 && (
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
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-neutral-50 border-2 border-dashed border-[#191A23]/20 rounded-sm p-4 mb-6">
                  <div className="flex items-center gap-2 text-[#191A23] mb-1">
                    <HugeiconsIcon icon={Store01Icon} size={16} />
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      Store Logo
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-neutral-500 uppercase leading-relaxed">
                    Upload a logo to represent your brand on WishCube.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-[#191A23]">
                    Upload Logo
                  </Label>
                  <div className="grid grid-cols-1 gap-4">
                    {logo ? (
                      <div className="relative w-full aspect-video border-2 border-[#191A23] rounded-sm overflow-hidden group bg-neutral-50">
                        <img
                          src={logo}
                          alt="Store Logo"
                          className="w-full h-full object-contain p-4"
                        />
                        <button
                          type="button"
                          onClick={() => setLogo(null)}
                          className="absolute top-2 right-2 bg-white border-2 border-[#191A23] rounded-sm p-1.5 text-red-600 shadow-[2px_2px_0px_0px_rgba(25,26,35,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingLogo}
                        className="w-full aspect-video border-2 border-dashed border-[#191A23]/20 rounded-sm bg-neutral-50 flex flex-col items-center justify-center p-8 text-center hover:bg-neutral-100 transition-all disabled:opacity-50"
                      >
                        {isUploadingLogo ? (
                          <div className="w-8 h-8 border-4 border-[#191A23] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <div className="p-4 bg-white border-2 border-[#191A23] rounded-sm shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] mb-4">
                              <HugeiconsIcon
                                icon={ImageAdd01Icon}
                                size={32}
                                className="text-[#191A23]"
                              />
                            </div>
                            <p className="text-xs font-black uppercase text-[#191A23] mb-1">
                              Click to upload logo
                            </p>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase">
                              PNG, JPG or WEBP (Max 2MB)
                            </p>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <Button
                  onClick={handleFinish}
                  disabled={!logo || loading || isUploadingLogo}
                  className="w-full h-14 bg-[#B4F8C8] text-[#191A23] border-2 border-[#191A23] rounded-sm font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                >
                  Complete Registration
                </Button>
              </div>
            )}
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
