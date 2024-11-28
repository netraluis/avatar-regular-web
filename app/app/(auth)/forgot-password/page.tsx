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
import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useUserForgotPassword } from "@/components/context/useAppContext/user";

const forgotPassword = {
  title: "Reseteja la contrasenya",
  description:
    "Entri les dades per enviar un correo per actualitzar la contrasenya",
  email: "Email",
  send: "Enviar",
  error: {
    unknown_error: "Ho sentim hi ha hagut un error",
  },
};

export default function Signup() {
  const { userForgotPassword, loading, data, error } = useUserForgotPassword();
  const [message, setMesssage] = useState(false);

  const handleSendEmailForgotPassword = async (formData: FormData) => {
    await userForgotPassword({
      email: formData.get("email") as string,
    });
  };

  useEffect(() => {
    if (data) setMesssage(true);
  }, [data]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {!message || error ? (
        <div className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{forgotPassword.title}</CardTitle>
            <CardDescription>{forgotPassword.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSendEmailForgotPassword(formData);
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
            {/* <div className="mt-4 text-center">
            <p className="text-sm">

              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 underline">
                Login
              </Link>
            </p>
          </div> */}
          </CardContent>
        </div>
      ) : (
        <div className="mx-auto max-w-sm">Tu solicitud ha sido enviada</div>
      )}
    </div>
  );
}
