import DashboardHeader from "@/components/layouts/dashboard-layout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardHeader>{children}</DashboardHeader>;
}
