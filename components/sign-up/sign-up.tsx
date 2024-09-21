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
import { signup } from "./actions"; // Asegúrate de tener una función de signup
import { useContext, useState } from "react";
import { GlobalContext } from "@/components/context/globalContext";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Signup() {
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (formData: FormData) => {
    setLoading(true);
    try {
      const result: any = await signup(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setUser(result);
        // router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
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
    </div>
  );
}
