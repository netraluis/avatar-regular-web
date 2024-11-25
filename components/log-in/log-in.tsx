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
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useLoginUser } from "../context/useAppContext/user";

const login = {
  title: "Login",
  description: "Introdueix el teu email per accedir al teu compte",
  error: {
    invalid_credentials: "Les credencials introduïdes no són correctes",
    unknown_error: "Ho sentim hi ha hagut un error",
  },
  email: "Email",
  password: "Contrasenya",
  forgot_password: "Has oblidat la contrasenya?",
  login: "Inicia sessió",
  dont_have_account: "No tens un compte?",
  sign_up: "Registra't",
};

export default function Login() {
  const { loginUser, error, loading } = useLoginUser();

  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{login.title}</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              await loginUser({
                email: formData.get("email") as string,
                password: formData.get("password") as string,
              });
              router.push("team");
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
              <div className="flex items-center">
                <Label htmlFor="password">{login.password}</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  {login.forgot_password}
                </Link>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>
            {error && (
              <p className="text-red-500">
                {login.error[error as keyof typeof login.error] ||
                  login.error.unknown_error}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading && (
                <ArrowPathIcon
                  className="ml-0.5 h-5 w-5 animate-spin mr-1"
                  aria-hidden="true"
                />
              )}
              Login
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm">
              {login.dont_have_account}
              <Link href="/signup" className="text-blue-500 underline">
                {login.sign_up}
              </Link>
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
