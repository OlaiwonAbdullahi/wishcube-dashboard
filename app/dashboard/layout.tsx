import { DashboardLayout } from "./_components/dashboard-layout";

export default function RootDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
