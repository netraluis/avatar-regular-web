"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSignupUser } from "@/components/context/useAppContext/user";
import ConfirmationScreen from "@/components/user-process/redirect";
import { MailCheck } from "lucide-react";
import { useUserManagmentLanguage } from "@/components/context/userManagmentLanguageContext";

export default function Signup() {
  const { t } = useUserManagmentLanguage();
  const signUp = t("app.(AUTH).SIGN_UP");
  const { language } = useUserManagmentLanguage();

  const { signupUser, loading, data, error } = useSignupUser();
  const [message, setMesssage] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const handleSignup = async (formData: FormData) => {
    await signupUser({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      phone: formData.get("phone") as string,
      language: language,
    });
    setEmail(formData.get("email") as string);
  };

  const validatePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneRegex.test(event.target.value)) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
  };

  useEffect(() => {
    if (data) setMesssage(true);
  }, [data]);

  return (
    <>
      {!message || error ? (
        <ConfirmationScreen
          title={signUp.title}
          description={signUp.description}
          loading={false}
        >
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSignup(formData);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="email">{signUp.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={signUp.emailPlaceholder}
                name="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">{signUp.name}</Label>
              <Input
                id="name"
                type="text"
                placeholder={signUp.namePlaceholder}
                name="name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{signUp.surname}</Label>
              <Input
                id="surname"
                type="text"
                placeholder={signUp.surnamePlaceholder}
                name="surname"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{signUp.phone}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={signUp.phonePlaceholder}
                name="phone"
                required
                pattern="^\+?[1-9]\d{1,14}$"
                onChange={validatePhone}
              />
              {phoneError && (
                <p className="text-red-500">{signUp.phoneError}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{signUp.password}</Label>
              <Input id="password" type="password" name="password" required />
            </div>
            <p className="text-sm text-muted-foreground">
              {signUp.subDescription}
            </p>
            {error && (
              <p className="text-red-500">
                {signUp.error[error as keyof typeof signUp.error] ||
                  signUp.error.unknown_error}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading && (
                <ArrowPathIcon
                  className="ml-0.5 h-5 w-5 animate-spin mr-1"
                  aria-hidden="true"
                />
              )}
              {signUp.action}
            </Button>
          </form>
        </ConfirmationScreen>
      ) : (
        <ConfirmationScreen
          title={signUp.emailSent}
          description={
            <p>
              {signUp.emailSentDescription1}
              <span className="font-medium text-slate-950">{email}</span>
              {signUp.emailSentDescription2}
            </p>
          }
          logo={MailCheck}
          loading={false}
          linkText={
            <p className="mt-4 text-muted-foreground">
              {signUp.emailSentSubDescription}{" "}
              <Link href={signUp.link} className="underline hover:">
                {signUp.linkText}
              </Link>
            </p>
          }
        />
      )}
    </>
  );
}
