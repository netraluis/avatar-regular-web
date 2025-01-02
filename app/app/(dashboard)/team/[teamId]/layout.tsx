"use client";

// import { useAppContext } from "@/components/context/appContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const {state: { userLocal }} = useAppContext();

  return <>{children}</>;
}
