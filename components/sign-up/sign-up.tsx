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
import { useContext, useState } from "react";
import { GlobalContext } from "@/components/context/globalContext";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const signUp = {
  signup: "Sign Up",
  description: "Entri les dades per crear un compte",
  email: "Email",
  password: "Password",
  already_have_account: "Ja tens un compte?",
  login: "Inicia sessió",
  error: {
    'Password should be at least 6 characters.': 'La contrasenya ha de tenir almenys 6 caràcters.',
    unknown_error: "Ho sentim hi ha hagut un error",
  }
}

export default function Signup() {
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [message, setMesssage] = useState(false);

  const handleSignup = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const result = await response.json();
      console.log(result)

      if (!response.ok) {
        setError(result.error || "Signup failed.");
      } else {
        setUser(result);
        // Aquí podrías redirigir al usuario, por ejemplo, usando router.push("/login")
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
      setMesssage(true)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
     {!message || error ? <div className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{signUp.signup}</CardTitle>
          <CardDescription>
            {signUp.description}
          </CardDescription>
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
      </div>: <div className="mx-auto max-w-sm">Tu solicitud ha sido enviada</div>}
    </div>
  );
}
