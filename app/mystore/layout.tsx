import { StoreLayout } from "./_components/store-layout";

export default function MyStoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StoreLayout>{children}</StoreLayout>;
}
