"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { signupSchema, type SignupInput } from "@/schemas/auth";
import { useSignupMutation } from "@/store/api/authApi";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

export default function SignupPage() {
  const [signup] = useSignupMutation();
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: SignupInput) {
    setAuthError(null);
    setSubmitting(true);
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      // Registration succeeded — create the next-auth session
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Could not create account. Please try again.";
      setAuthError(message);
      setSubmitting(false);
    }
  }

  return (
    <Card variant="elevated" padding="lg">
      <div className="mb-6 text-center">
        <Typography variant="h2">Create your account</Typography>
        <Typography variant="muted" className="mt-1">
          Get started with EAP in seconds
        </Typography>
      </div>

      {authError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <AlertCircle className="h-4 w-4" />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="name"
          label="Full name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>

      <Typography variant="muted" className="mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary-600 hover:underline">
          Sign in
        </Link>
      </Typography>
    </Card>
  );
}
