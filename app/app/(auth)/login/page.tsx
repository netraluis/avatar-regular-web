"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLoginUser } from "@/components/context/useAppContext/user";
import { useAppContext } from "@/components/context/appContext";
import ConfirmationScreen from "@/components/user-process/redirect";
import { useUserManagmentLanguage } from "@/components/context/userManagmentContext";

export default function Login() {
  const { t } = useUserManagmentLanguage();
  const login = t("app.(AUTH).LOGIN");

  const { loginUser, error, loading } = useLoginUser();

  const {
    state: { user },
  } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    if (user?.user?.id) {
      router.push("/");
    }
  }, [user?.user?.id]);
  return (
    <ConfirmationScreen
      title={login.title}
      description={login.description}
      loading={false}
    >
      <form
        className="grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          await loginUser({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          });
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="email">{login.email}</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            name="email"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{login.password}</Label>
          </div>
          <Input id="password" type="password" name="password" required />
        </div>
        <p className="text-sm text-muted-foreground">
          {login.forgotPassword}
          <Link href="/forgot-password" className="text-blue-500 underline">
            {login.forgotPasswordLinkText}
          </Link>
        </p>
        {error && (
          <p className="text-red-500">
            {login.error[error as keyof typeof login.error] ||
              login.error.unknown_error}
          </p>
        )}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading && (
            <ArrowPathIcon
              className="ml-0.5 h-5 w-5 animate-spin mr-1"
              aria-hidden="true"
            />
          )}
          {login.login}
        </Button>
      </form>
    </ConfirmationScreen>
  );
}
