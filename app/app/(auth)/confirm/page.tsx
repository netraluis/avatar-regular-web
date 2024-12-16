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
import { useUserManagmentLanguage } from "@/components/context/userManagmentContext";

export default function Confirmation() {
  const { t } = useUserManagmentLanguage();

  const confirm = t("app.(AUTH).CONFIRM");

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
          title={confirm.verifyAccount}
          description={confirm.verifyAccountDescription}
          logo={LoaderCircleIcon}
          loading={false}
        />
      )}
      {success && !loading && (
        <ConfirmationScreen
          title={confirm.successEmail}
          description={confirm.successDescription}
          buttonText={confirm.successButtonText}
          logo={PartyPopper}
          onButtonClick={() => {
            router.push("/");
          }}
          loading={false}
        />
      )}

      {error && (
        <ConfirmationScreen
          title={confirm.otpError}
          description={confirm.otpErrorDescription}
          buttonText={confirm.otpErrorButtonText}
          logo={Link2Off}
          onButtonClick={() => useOtpExp.otpExpired({ email })}
          loading={false}
          logoLoading={ArrowPathIcon}
        />
      )}
    </>
  );
}
