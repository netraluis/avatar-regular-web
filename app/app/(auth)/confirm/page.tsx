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
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import {
  useOtpExpired,
  useUserConfirmation,
} from "@/components/context/useAppContext/user";
import { useEffect, useRef, useState } from "react";

const login = {
  title: "Confirmar compte",
  description: "Procedint per confirmar el teu compte",
  error: {
    validation_failed:
      "La validació ha fallat, a lo millor el teu user ja ha estat confirmat o les dades no son correctes",
    otp_expired:
      "El teu token ha expirat , no es vàlid, el email no es correcte o el email ja ha estat confirmat",
    email_not_confirmed: "El teu email no ha estat confirmat",
    unknown_error: "Ho sentim hi ha hagut un error",
  },
  verify_account: "Verificant compte",
  success: "Compte verificat, anar al login",
  otp_expired: "Si el email ja esta verificat no rebres res",
  otp_send: "Enviat nou token",
  email: "Email",
  token: "Token",
  forgot_password: "Has oblidat la contrasenya?",
  login: "Inicia sessió",
  dont_have_account: "No tens un compte?",
  sign_up: "Registra't",
};

export default function Confirmation() {
  const { userConfirmation, error, data, loading } = useUserConfirmation();
  const useOtpExp = useOtpExpired();
  const router = useRouter();
  const hasCalled = useRef(false);

  const searchParams = useSearchParams();
  const email = decodeURIComponent(searchParams.get("email") || "").replace(
    /\s/g,
    "+",
  );
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log("confirm useEffect");
    if (!hasCalled.current && token && email) {
      userConfirmation({ email, otp: token });
      hasCalled.current = true;
    }
  }, [token, email]);

  useEffect(() => {
    if (data) {
      setSuccess(true);
    }
  }, [data]);

  if (!email || !token) {
    return notFound();
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{login.title}</CardTitle>
          <CardDescription>{login.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{login.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                name="email"
                required
                value={email || ""}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="otp">{login.token}</Label>
              </div>
              <Input
                id="otp"
                name="otp"
                required
                value={token || ""}
                readOnly
              />
            </div>
            {error && (
              <p className="text-red-500">
                {login.error[error as keyof typeof login.error] ||
                  login.error.unknown_error}{" "}
                {error}
              </p>
            )}
            {loading && (
              <Button className="w-full" type="submit" disabled={loading}>
                <ArrowPathIcon
                  className="ml-0.5 h-5 w-5 animate-spin mr-1"
                  aria-hidden="true"
                />
                {login.verify_account}
              </Button>
            )}
            {success && !loading && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/login");
                }}
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {login.success}
              </Button>
            )}
            {error === "otp_expired" && (
              <div className="mt-4 text-center">
                <p className="text-sm mb-2">{login.otp_expired}</p>
                <Button
                  onClick={() => useOtpExp.otpExpired({ email })}
                  className="w-full"
                  type="submit"
                  disabled={useOtpExp.loading}
                >
                  {useOtpExp.loading && (
                    <ArrowPathIcon
                      className="ml-0.5 h-5 w-5 animate-spin mr-1"
                      aria-hidden="true"
                    />
                  )}
                  {login.otp_send}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </div>
    </div>
  );
}
