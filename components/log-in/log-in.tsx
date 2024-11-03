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
import { useLoginUser } from "../context/appContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { loginUser, error, loading } = useLoginUser();

  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          <form
            className="grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const loginUserResponse = await loginUser({
                email: formData.get("email") as string,
                password: formData.get("password") as string,
              });
              if (loginUserResponse.data.user.id) {
                return router.push("/team");
              }
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
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>
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
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-500 underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
