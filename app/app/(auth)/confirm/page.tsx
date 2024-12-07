"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import {
  useOtpExpired,
  useUserConfirmation,
} from "@/components/context/useAppContext/user";
import { useEffect, useRef, useState } from "react";
import ConfirmationScreen from "@/components/user-process/redirect";
import { PartyPopper, Link2Off, LoaderCircleIcon } from "lucide-react";
import { useAppContext } from "@/components/context/appContext";
import { UserData } from "@/types/types";

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

  successEmail: "Enhorabona! La teva conta ha estat confirmada",
  successDescription:
    "Inicia la sessió per començar a crear el teu assistent personalitzat",
  successButtonText: "Iniciar sessió",

  otpError: "Oops! L’enllaç ha caducat",
  otpErrorDescription:
    "Sembla que l’enllaç de confirmació ha caducat. No passa res, et podem enviar un de nou.",
  otpErrorButtonText: "Reenviar un nou enllaç",

  verifyAccount: "Verificant el teu compte…",
  verifyAccountDescription: "Aquest procés pot tardar uns segons ",
};

export default function Confirmation() {
  const { userConfirmation, error, data, loading } = useUserConfirmation();
  const useOtpExp = useOtpExpired();
  const router = useRouter();
  const hasCalled = useRef(false);
  const { dispatch } = useAppContext();

  const searchParams = useSearchParams();
  const email = decodeURIComponent(searchParams.get("email") || "").replace(
    /\s/g,
    "+",
  );
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!hasCalled.current && token && email) {
      userConfirmation({ email, otp: token });
      hasCalled.current = true;
    }
  }, [token, email]);

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_USER", payload: data as UserData });
      setSuccess(true);
    }
  }, [data]);

  if (!email || !token) {
    return notFound();
  }

  return (
    <>
      {loading && (
        <ConfirmationScreen
          title={login.verifyAccount}
          description={login.verifyAccountDescription}
          logo={LoaderCircleIcon}
          loading={false}
        />
      )}
      {success && !loading && (
        <ConfirmationScreen
          title={login.successEmail}
          description={login.successDescription}
          buttonText={login.successButtonText}
          logo={PartyPopper}
          onButtonClick={() => {
            router.push("/");
          }}
          loading={false}
        />
      )}

      {error && (
        <ConfirmationScreen
          title={login.otpError}
          description={login.otpErrorDescription}
          buttonText={login.otpErrorButtonText}
          logo={Link2Off}
          onButtonClick={() => useOtpExp.otpExpired({ email })}
          loading={false}
          logoLoading={ArrowPathIcon}
        />
      )}
    </>
  );
}
