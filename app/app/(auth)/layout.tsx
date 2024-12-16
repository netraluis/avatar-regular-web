import { UserManagmentLanguageProvider } from "@/components/context/userManagmentContext";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <UserManagmentLanguageProvider>
      {children}
    </UserManagmentLanguageProvider>
  );
}