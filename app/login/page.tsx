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
import { login } from "./actions";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../../components/context/globalContext";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(GlobalContext);

  const handleLogin = async (formData: FormData) => {
    const result: any = await login(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      console.log({ result });
      setUser(result);
      router.push("/");
    }
  };
  return (
    <div className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500">{error}</p>}
        <form className="grid gap-4" action={handleLogin}>
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
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" name="password" required />
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
      </CardContent>
    </div>
  );
}
