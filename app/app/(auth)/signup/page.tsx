"use client";

import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSignupUser } from "@/components/context/useAppContext/user";
import ConfirmationScreen from "@/components/user-process/redirect";
import { MailCheck } from "lucide-react";

const signUp = {
  signup: "Sign Up",
  description: "Entri les dades per crear un compte",
  email: "Email",
  password: "Password",
  already_have_account: "Ja tens un compte?",
  login: "Inicia sessió",
  error: {
    weak_password: "La contrasenya ha de tenir almenys 6 caràcters.",
    unknown_error: "Ho sentim hi ha hagut un error",
  },
  emailSent: "Hem enviat un correu",
  emailSentDescription1:
    "Ja gairebé ho tens! Hem enviat un correu electrònic a ",
  emailSentDescription2:
    " perquè confirmis el teu compte. Revisa la carpeta de correu no desitjat o promocions.",
  emailSentSubDescription: "No has rebut el correu electrònic?",
  linkText: " Contacta’ns!",
  link: "https://wa.me/376644253?",
};

export default function Signup() {
  const { signupUser, loading, data, error } = useSignupUser();
  const [message, setMesssage] = useState(false);
  const [email, setEmail] = useState("");
  const handleSignup = async (formData: FormData) => {
    await signupUser({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    setEmail(formData.get("email") as string);
  };

  useEffect(() => {
    if (data) setMesssage(true);
  }, [data]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {!message || error ? (
        <div className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{signUp.signup}</CardTitle>
            <CardDescription>{signUp.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSignup(formData);
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
              </div>
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
                Sign Up
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 underline">
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </div>
      ) : (
        <div className="mx-auto max-w-sm">
          <ConfirmationScreen
            title={signUp.emailSent}
            description={
              <p>
                {signUp.emailSentDescription1}
                <span className="font-medium text-slate-950">{email}</span>
                {signUp.emailSentDescription2}
              </p>
            }
            // buttonText={login.successButtonText}
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
            // logoAction={PartyPopper}
            // logoLoading={PartyPopper}
          />
        </div>
      )}
    </div>
  );
}
