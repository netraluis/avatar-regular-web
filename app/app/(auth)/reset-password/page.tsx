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
import { useUserManagmentLanguage } from "@/components/context/userManagmentContext";

export default function Confirmation() {
  const { t } = useUserManagmentLanguage()
  const resetPassword = t('app.(AUTH).RESET_PASSWORD')
  
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
    <>
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
                {resetPassword.passwordRepeat}
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
                {resetPassword.error.samePassword}
              </p>
            )}

            {localError === "weak_password" && (
              <p className="text-red-500">
                {resetPassword.error.weakPassword}
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
                {resetPassword.passwordUpdating}
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
                {resetPassword.genericErrorList.map((item: string, index: number) => (
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
    </>
  );
}
