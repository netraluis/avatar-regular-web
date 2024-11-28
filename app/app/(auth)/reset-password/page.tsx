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
import { useEffect, useState } from "react";
import {
  useUserForgotPassword,
  useUserResetPassword,
} from "@/components/context/useAppContext/user";

const resetPassword = {
  title: "Reseta la contrasenya",
  description: "Procedint per resetar la teva contrasenya",
  verify_account: "Verificant compte",
  success: "Contrasenya canviada, anar al login",
  password: "Constraseya",
  password_repeat: "Repeteix la contrasenya",
  password_updating: "Actualitzant contrasenya",
  send: "Enviar",

  error: {
    same_password: "La contrasenya ha de ser la mateixa",
    weak_password:
      "La contrasenya ha de tenir almenys 6 caràcters. Per fer un altre intent hauras d`enviar el token de nou",
    otp_expired:
      "El teu token ha expirat , no es vàlid, o ja has fet un intent",
    unknown_error: "Ho sentim hi ha hagut un error",
  },
  otp_expired: "",
  otp_send: "Enviat nou token",
  otp_sended: "Token enviat",
};

export default function Confirmation() {
  const router = useRouter();
  const { userResetPassword, error, data, loading } = useUserResetPassword();
  const useUserForgotPass = useUserForgotPassword();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (data) {
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
    userResetPassword({ password: newPassword, token, email });
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{resetPassword.title}</CardTitle>
          <CardDescription>{resetPassword.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
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

            {error && (
              <p className="text-red-500">
                {resetPassword.error[
                  error as keyof typeof resetPassword.error
                ] || resetPassword.error.unknown_error}{" "}
              </p>
            )}

            {localError && (
              <p className="text-red-500">
                {resetPassword.error.same_password}
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
            {success && !loading && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/login");
                  // router.push('/login')
                }}
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {resetPassword.success}
              </Button>
            )}
            {error === "otp_expired" && (
              <div className="mt-4 text-center">
                <p className="text-sm mb-2">{resetPassword.otp_expired}</p>
                <Button
                  onClick={() =>
                    useUserForgotPass.userForgotPassword({ email })
                  }
                  className="w-full"
                  type="submit"
                  disabled={useUserForgotPass.loading || useUserForgotPass.data}
                >
                  {useUserForgotPass.loading && (
                    <ArrowPathIcon
                      className="ml-0.5 h-5 w-5 animate-spin mr-1"
                      aria-hidden="true"
                    />
                  )}
                  {useUserForgotPass.data
                    ? resetPassword.otp_sended
                    : resetPassword.otp_send}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </div>
    </div>
  );
}
