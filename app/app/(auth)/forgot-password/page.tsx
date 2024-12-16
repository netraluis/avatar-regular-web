"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useUserForgotPassword } from "@/components/context/useAppContext/user";
import ConfirmationScreen from "@/components/user-process/redirect";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useUserManagmentLanguage } from "@/components/context/userManagmentContext";

export default function Signup() {
  const { t } = useUserManagmentLanguage();

  const forgotPassword = t("app.(AUTH).FORGOT_PASSWORD");

  const { userForgotPassword, loading, data, error } = useUserForgotPassword();
  const [message, setMesssage] = useState(false);
  const [email, setEmail] = useState("");

  const handleSendEmailForgotPassword = async (formData: FormData) => {
    await userForgotPassword({
      email: formData.get("email") as string,
    });
    setEmail(formData.get("email") as string);
  };

  useEffect(() => {
    if (data) setMesssage(true);
  }, [data]);

  return (
    <>
      {!message || error ? (
        <ConfirmationScreen
          title={forgotPassword.title}
          description={forgotPassword.description}
          loading={loading}
        >
          <form
            className="grid gap-4 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSendEmailForgotPassword(formData);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="email">{forgotPassword.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={forgotPassword.placeholder}
                name="email"
                required
              />
            </div>
            {error && (
              <p className="text-red-500">
                {forgotPassword.error[
                  error as keyof typeof forgotPassword.error
                ] || forgotPassword.error.unknown_error}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading && (
                <ArrowPathIcon
                  className="ml-0.5 h-5 w-5 animate-spin mr-1"
                  aria-hidden="true"
                />
              )}
              {forgotPassword.send}
            </Button>
          </form>
        </ConfirmationScreen>
      ) : (
        // <div className="mx-auto max-w-sm">Tu solicitud ha sido enviada</div>
        <ConfirmationScreen
          title={forgotPassword.emailSent}
          description={
            <p>
              {forgotPassword.emailSentDescription1}
              <span className="font-medium text-slate-950">{email}</span>
              {forgotPassword.emailSentDescription2}
            </p>
          }
          logo={MailCheck}
          loading={false}
          linkText={
            <p className="mt-4 text-muted-foreground">
              {forgotPassword.emailSentSubDescription}{" "}
              <Link href={forgotPassword.link} className="underline">
                {forgotPassword.linkText}
              </Link>
            </p>
          }
        />
      )}
    </>
  );
}
