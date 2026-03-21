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
import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { register, getAuth, clearAuth } from "@/lib/auth";
import { applyVendor, uploadVendorLogo } from "@/lib/vendor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  ArrowRight01Icon,
  Tick01Icon,
  BankIcon,
  MapsCircle02Icon,
} from "@hugeicons/core-free-icons";

export default function JoinAsVendor() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1: Account
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Store Details
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cakes");
  const [deliveryZones, setDeliveryZones] = useState<string[]>([]);
  const [newZone, setNewZone] = useState("");

  // Step 3: Bank Details
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState(""); // ✅ was missing
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  // Step 4: Logo
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [banks, setBanks] = useState<any[]>([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(
          "https://api.paystack.co/bank?country=nigeria",
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
            },
          }
        );
        const resData = await response.json();
        if (resData.status && resData.data) {
          setBanks(resData.data);
        } else {
          throw new Error("Failed to fetch banks");
        }
      } catch (error) {
        console.error("Error fetching banks from Paystack:", error);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setCurrentUser(auth.user);
      if (step === 1) setStep(2);
    }
  }, [step]);

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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await register(name, email, password);
      if (response.success) {
        toast.success("Account created successfully!");
        setStep(2);
      } else {
        toast.error(response.message || "Signup failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ✅ No longer takes a FormEvent — called directly
  const handleApply = async () => {
    if (!logo) {
      toast.error("Please upload a logo to continue.");
      return;
    }
    setLoading(true);
    try {
      const logoResponse = await uploadVendorLogo(logo);
      if (!logoResponse.success || !logoResponse.data?.logo) {
        toast.error(logoResponse.message || "Failed to upload logo");
        setLoading(false);
        return;
      }

      // ✅ Removed duplicate — uses bankCode to look up bank name
      const selectedBank = banks.find((b) => b.code === bankCode);
      const application = {
        storeName,
        description,
        category,
        deliveryZones,
        logo: logoResponse.data.logo,
        bankDetails: {
          bankName: selectedBank?.name || "",
          accountName,
          accountNumber,
        },
      };

      const response = await applyVendor(application);
      if (response.success) {
        toast.success("Application submitted successfully!");
        router.push("/mystore");
      } else {
        toast.error(response.message || "Application failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during application");
    } finally {
      setLoading(false);
    }
  };

  const addZone = () => {
    if (newZone && !deliveryZones.includes(newZone)) {
      setDeliveryZones([...deliveryZones, newZone]);
      setNewZone("");
    }
  };

  const removeZone = (zone: string) => {
    setDeliveryZones(deliveryZones.filter((z) => z !== zone));
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
                Become a Vendor
              </CardTitle>
            </div>
            <CardDescription className="text-sm font-bold uppercase text-neutral-500 tracking-wider">
              {step === 1
                ? "Step 1: Create your account"
                : step === 2
                ? "Step 2: Tell us about your store"
                : step === 3
                ? "Step 3: Financial Details"
                : "Step 4: Upload Your Logo"}
            </CardDescription>

            <div className="flex gap-2 mt-6">
              {[1, 2, 3, 4].map((s) => (
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
              <div className="space-y-6">
                {currentUser ? (
                  <div className="bg-[#B4F8C8]/20 border-2 border-[#191A23] p-6 rounded-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white border-2 border-[#191A23] rounded-full flex items-center justify-center font-black text-xl">
                        {currentUser.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-neutral-500">
                          Logged in as
                        </p>
                        <p className="font-black text-[#191A23]">
                          {currentUser.name}
                        </p>
                        <p className="text-xs font-bold text-neutral-500">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setStep(2)}
                      className="w-full h-14 bg-[#191A23] text-white rounded-sm font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(180,248,200,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      Continue Application
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={18}
                        className="ml-2"
                      />
                    </Button>
                    <button
                      onClick={() => {
                        clearAuth();
                        setCurrentUser(null);
                        window.location.reload();
                      }}
                      className="w-full text-[10px] font-black uppercase text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      Not you? Logout and switch account
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-[#191A23]">
                          Full Name
                        </Label>
                        <Input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 bg-[#191A23] text-white rounded-sm font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(180,248,200,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      {loading ? "Creating Account..." : "Next Step"}
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={18}
                        className="ml-2"
                      />
                    </Button>
                  </form>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#191A23]">
                      Store Name
                    </Label>
                    <Input
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Sweet Delights Bakery"
                      className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
                    />
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
                      Description
                    </Label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us about your store and what makes it unique..."
                      className="w-full border-2 border-[#191A23] rounded-sm h-32 p-3 text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-[#191A23] flex items-center gap-1">
                      <HugeiconsIcon icon={MapsCircle02Icon} size={12} />
                      Delivery Zones (where can you deliver to?)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newZone}
                        onChange={(e) => setNewZone(e.target.value)}
                        onKeyDown={(e) => {
                          // ✅ replaced deprecated onKeyPress
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addZone();
                          }
                        }}
                        placeholder="e.g. Lagos"
                        className="border-2 border-[#191A23] rounded-sm h-10 text-xs font-bold flex-1"
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          addZone();
                        }}
                        className="bg-[#191A23] text-white rounded-sm px-4 h-10 text-[10px] font-black uppercase"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {deliveryZones.map((zone) => (
                        <div
                          key={zone}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#F3F3F3] border-2 border-[#191A23] rounded-sm"
                        >
                          <span className="text-[10px] font-black uppercase text-[#191A23]">
                            {zone}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeZone(zone)}
                            className="text-[#191A23]/50 hover:text-red-500 transition-colors"
                          >
                            <HugeiconsIcon
                              icon={Tick01Icon}
                              size={14}
                              className="rotate-45"
                            />
                          </button>
                        </div>
                      ))}
                      {deliveryZones.length === 0 && (
                        <p className="text-[10px] font-bold text-neutral-400 italic">
                          No zones added yet. Please add at least one zone.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 h-14 border-2 border-[#191A23] rounded-sm font-black uppercase text-sm hover:bg-neutral-50 transition-all"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={
                      !storeName || !description || deliveryZones.length === 0
                    }
                    className="flex-[2] h-14 bg-[#191A23] text-white rounded-sm font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(180,248,200,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                  >
                    Next: Bank Details
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={18}
                      className="ml-2"
                    />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-neutral-50 border-2 border-dashed border-[#191A23]/20 rounded-sm p-4 mb-6">
                  <div className="flex items-center gap-2 text-[#191A23] mb-1">
                    <HugeiconsIcon icon={BankIcon} size={16} />
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      Payout Information
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-neutral-500 uppercase leading-relaxed">
                    We need your bank details to process payments for your sales
                    on WishCube.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#191A23]">
                      Account Name
                    </Label>
                    <Input
                      required
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Sweet Delights Ltd"
                      className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#191A23]">
                      Account Number
                    </Label>
                    <Input
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="0011223344"
                      className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#191A23]">
                      Bank
                    </Label>
                    <Select value={bankCode} onValueChange={setBankCode}>
                      <SelectTrigger className="w-full py-6 border-2 border-[#191A23] rounded-sm px-3 text-sm font-bold bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all">
                        <SelectValue placeholder="Select your bank" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-[#191A23] rounded-sm font-bold max-h-[300px]">
                        {banks.map((bank: any) => (
                          <SelectItem
                            key={bank.code} // ✅ was bank.name — codes are unique, names can clash
                            value={bank.code}
                            className="focus:bg-[#B4F8C8] focus:text-[#191A23] cursor-pointer"
                          >
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 h-14 border-2 border-[#191A23] rounded-sm font-black uppercase text-sm hover:bg-neutral-50 transition-all"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      setStep(4);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={!accountName || !accountNumber || !bankCode}
                    className="flex-[2] h-14 bg-[#191A23] text-white rounded-sm font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(180,248,200,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                  >
                    Next: Upload Logo
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={18}
                      className="ml-2"
                    />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
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
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#191A23]">
                      Logo Preview
                    </Label>
                    <div className="w-full h-48 border-2 border-dashed border-[#191A23]/20 rounded-sm flex items-center justify-center bg-neutral-50 overflow-hidden">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-neutral-400 space-y-2">
                          <HugeiconsIcon icon={Store01Icon} size={32} />
                          <p className="text-xs font-bold uppercase">
                            Your logo will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#191A23]">
                      Upload Logo
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="border-2 border-[#191A23] rounded-sm h-12 text-sm font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(25,26,35,1)] transition-all file:bg-[#191A23] file:text-white file:h-full file:border-0 file:font-black file:uppercase file:text-xs file:px-6"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 h-14 border-2 border-[#191A23] rounded-sm font-black uppercase text-sm hover:bg-neutral-50 transition-all"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleApply} // ✅ called directly, no fake Event
                    disabled={!logo || loading}
                    className="flex-[2] h-14 bg-[#B4F8C8] text-[#191A23] border-2 border-[#191A23] rounded-sm font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(25,26,35,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
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
