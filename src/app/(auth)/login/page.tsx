"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

export default function LoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginInput) {
    setAuthError(null);
    setSubmitting(true);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setSubmitting(false);

    if (result?.error) {
      setAuthError("Invalid email or password.");
    } else {
      router.push("/");
      router.refresh(); // force Server Components to re-read the new session
    }
  }

  function fillDemo() {
    setValue("email", "admin@demo.com");
    setValue("password", "Admin1234!");
  }

  return (
    <Card variant="elevated" padding="lg">
      <div className="mb-6 text-center">
        <Typography variant="h2">Welcome back</Typography>
        <Typography variant="muted" className="mt-1">
          Sign in to your account to continue
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

        <Button type="submit" className="w-full" loading={submitting}>
          Sign in
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={fillDemo}
        >
          Use demo credentials
        </Button>
      </form>

      <Typography variant="muted" className="mt-6 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary-600 hover:underline">
          Sign up
        </Link>
      </Typography>
    </Card>
  );
}
