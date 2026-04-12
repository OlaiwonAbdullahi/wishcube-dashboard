/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ProductSnapshot {
  name: string;
  price: number;
  imageUrl?: string;
  storeName?: string;
}

export interface GiftInfo {
  _id: string;
  type: string;
  amountPaid: number;
  currency: string;
  giftMessage?: string | null;
  status: string;
  escrowStatus?: string;
  expiresAt?: string;
  redeemToken?: string;
  productSnapshot?: ProductSnapshot | null;
  productId?: any;
  orderId?: string;
  orderStatus?: string;
}

export interface WebsiteData {
  _id: string;
  recipientName: string;
  occasion: string;
  language?: string;
  message?: string;
  images?: { url: string; publicId: string; order: number }[];
  videoUrl?: string | null;
  voiceMessageUrl?: string | null;
  musicTrack?: string | null;
  musicUrl?: string | null;
  theme?: string;
  font?: string;
  primaryColor?: string;
  countdownDate?: string | null;
  isPasswordProtected?: boolean;
  password?: string | null;
  giftIds?: GiftInfo[];
  status: string;
  slug?: string;
  publicUrl?: string;
  views?: number;
  reaction?: { emoji?: string | null };
  recipientReply?: { message?: string | null; repliedAt?: string | null };
  expiresAt?: string;
  layout?: string;
}

export type BankDetails = {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
};

export type DeliveryAddress = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
};

export type RedeemPayload =
  | { bankDetails: BankDetails }
  | { deliveryAddress: DeliveryAddress };
