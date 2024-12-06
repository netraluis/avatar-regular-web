"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  // useUserForgotPassword,
  useUserResetPassword,
} from "@/components/context/useAppContext/user";
import { useAppContext } from "@/components/context/appContext";
import { UserData } from "@/types/types";
import ConfirmationScreen from "@/components/user-process/redirect";
import { Link2Off, PartyPopper } from "lucide-react";

const resetPassword = {
  title: "Crea una nova contrasenya",
  description: "Introdueix una nova contrasenya per accedir al teu compte.",
  subDescription:
    "Fes servir almenys 6 caràcters i combina lletres, números i algun símbol",
  success: "Contrasenya restablerta!",
  successDescription:
    "La teva nova contrasenya s’ha actualitzat correctament. Ja pots accedir al teu compte.",
  successButtonText: "Accedeix al tauler",
  password: "Contrasenya nova",
  password_repeat: "Repeteix la nova contrasenya",
  password_updating: "Actualitzant contrasenya",
  send: "Enviar",

  error: {
    same_password: "La contrasenya ha de ser la mateixa",
    weak_password: "La contrasenya ha de tenir almenys 6 caràcters.",
    otp_expired:
      "El teu token ha expirat , no es vàlid, o ja has fet un intent",
    unknown_error: "Ho sentim hi ha hagut un error",
  },
  otp_expired: "",
  otp_send: "Enviat nou token",
  otp_sended: "Token enviat",

  genericError: "El teu enllaç no és vàlid o ha expirat.",
  genericErrorDescription: "Això pot passar per diverses raons:",
  genericErrorList: [
    "L’enllaç de verificació ha caducat",
    // "L’adreça de correu no és correcta",
    // "El teu compte ja ha estat confirmat",
  ],
};

export default function Confirmation() {
  const { dispatch } = useAppContext();
  const router = useRouter();
  const { userResetPassword, error, data, loading } = useUserResetPassword();
  // const useUserForgotPass = useUserForgotPassword();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_USER", payload: data as UserData });
      setSuccess(true);
    }
  }, [data]);

  if (!email || !token) {
    return notFound();
  }

  async function handleResetPassword(e: any) {
    e.preventDefault();
    if (!email || !token) return;
    if (newPassword !== repeatNewPassword)
      return setLocalError("same_password");
    if (newPassword.length < 6) return setLocalError("weak_password");
    userResetPassword({ password: newPassword, token, email });
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {!success && !error && (
        <ConfirmationScreen
          title={resetPassword.title}
          description={resetPassword.description}
          loading={loading}
        >
          <form className="w-full grid gap-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">{resetPassword.password}</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="name@example.com"
                name="newPassword"
                required
                value={newPassword || ""}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repeatPassword">
                {resetPassword.password_repeat}
              </Label>
              <Input
                id="repeatPassword"
                type="password"
                name="repeatPassword"
                required
                value={repeatNewPassword || ""}
                onChange={(e) => setRepeatNewPassword(e.target.value)}
              />
            </div>
            <p className=" text-muted-foreground">
              {resetPassword.subDescription}{" "}
            </p>
            {error && (
              <p className="text-red-500">
                {resetPassword.error[
                  error as keyof typeof resetPassword.error
                ] || resetPassword.error.unknown_error}{" "}
              </p>
            )}

            {localError === "same_password" && (
              <p className="text-red-500">
                {resetPassword.error.same_password}
              </p>
            )}

            {localError === "weak_password" && (
              <p className="text-red-500">
                {resetPassword.error.weak_password}
              </p>
            )}

            {error !== "otp_expired" && (
              <Button
                className="w-full"
                type="submit"
                disabled={loading}
                onClick={handleResetPassword}
              >
                {loading && (
                  <ArrowPathIcon
                    className="ml-0.5 h-5 w-5 animate-spin mr-1"
                    aria-hidden="true"
                  />
                )}
                {resetPassword.password_updating}
              </Button>
            )}
          </form>
        </ConfirmationScreen>
      )}
      {success && !loading && (
        <ConfirmationScreen
          title={resetPassword.success}
          description={resetPassword.successDescription}
          buttonText={resetPassword.successButtonText}
          logo={PartyPopper}
          onButtonClick={() => {
            router.push("/");
          }}
          loading={false}
        />
      )}
      {error && (
        <ConfirmationScreen
          title={resetPassword.genericError}
          linkText={
            <p className="mt-4 text-muted-foreground">
              {resetPassword.genericErrorDescription}{" "}
              <ul className="styled-list">
                {resetPassword.genericErrorList.map((item, index) => (
                  <li key={index}>
                    {"  - "}
                    {item}
                  </li>
                ))}
              </ul>
            </p>
          }
          logo={Link2Off}
          loading={false}
          buttonText={"Tornar a enviar"}
          onButtonClick={() => router.push("/forgot-password")}
        />
      )}
    </div>
  );
}
