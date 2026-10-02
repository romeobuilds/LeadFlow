"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from "@/lib/validations/auth";
import { login, signup } from "@/app/(auth)/actions";

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    setFormError(null);
    startTransition(async () => {
      // On success the action redirects (never returns). A return means error.
      const result = await login(values);
      if (result?.error) setFormError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@agency.com"
          disabled={isPending}
          {...register("email")}
        />
        {errors.email?.message && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={isPending}
          {...register("password")}
        />
        {errors.password?.message && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {formError && (
        <p role="alert" className="text-xs text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2Icon className="animate-spin" />}
        Sign in
      </Button>
    </form>
  );
}

export function SignupForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  function onSubmit(values: SignupInput) {
    setFormError(null);
    startTransition(async () => {
      // On success the action redirects (never returns). A return means error.
      const result = await signup(values);
      if (result?.error) setFormError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          disabled={isPending}
          {...register("fullName")}
        />
        {errors.fullName?.message && (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@agency.com"
          disabled={isPending}
          {...register("email")}
        />
        {errors.email?.message && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          disabled={isPending}
          {...register("password")}
        />
        {errors.password?.message && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {formError && (
        <p role="alert" className="text-xs text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2Icon className="animate-spin" />}
        Create account
      </Button>
    </form>
  );
}
