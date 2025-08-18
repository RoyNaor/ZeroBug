"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  Button,
  Card,
  CardBody,
  Input,
  Link,
  Spacer,
} from "@heroui/react";
import { AiFillBug } from "react-icons/ai";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.ok) router.push("/");
    else setError("Invalid email or password");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-gray-200 shadow-xl">
        <CardBody className="p-6 sm:p-8">
          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <AiFillBug className="text-indigo-600 text-3xl" />
            <span className="text-xl font-semibold tracking-tight text-gray-900">
              ZeroBug
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
            Sign in
          </h1>
          <p className="mt-1 text-center text-sm text-gray-500">
            Welcome back! Please enter your details.
          </p>

          <Spacer y={4} />

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                variant="bordered"
                size="lg"
                isRequired
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                variant="bordered"
                size="lg"
                isRequired
                className="w-full"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              size="lg"
              fullWidth
              className="font-semibold"
              isLoading={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-800">Don’t have an account? </span>
            <Link
              as={NextLink}
              href="/signup"
              color="primary"
              underline="hover"
              className="font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
