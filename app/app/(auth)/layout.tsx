'use client'
import { UserManagmentLanguageProvider, useUserManagmentLanguage } from "@/components/context/userManagmentContext";
import { useRouter, usePathname } from "next/navigation";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <UserManagmentLanguageProvider>
      <div className="h-screen w-full flex flex-col items-center overflow-hidden border">
        <Header />
        <div className="grow overflow-auto flex flex-col items-center"></div>
        {children}
      </div>
    </UserManagmentLanguageProvider>
  );
}

const Header = () => {
  const { t } = useUserManagmentLanguage();
  const userAuth = t('app.(AUTH).LAYOUT')

  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="justify-between flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 p-4 flex w-full">
      <Image
        src="/chatbotforLogo.svg"
        alt="Logo"
        width={170}
        height={170}
        className="cursor-pointer"
        onClick={() => router.push("/")}
      />
      <div>
        <Button asChild variant="link">
          <a
            href="https://wa.me/376644253?"
            target="_blank"
            rel="noopener noreferrer"
          >
            {userAuth.contact}
          </a>
        </Button>
        {pathname === "/login" && (
          <Button
            onClick={() => {
              router.push("/signup");
            }}
            variant="secondary"
          >
            {userAuth.signup}
          </Button>
        )}
        {pathname === "/signup" && (
          <Button
            onClick={() => {
              router.push("/login");
            }}
            variant="secondary"
          >
            {userAuth.login}
          </Button>
        )}
      </div>
    </header>
  )
}