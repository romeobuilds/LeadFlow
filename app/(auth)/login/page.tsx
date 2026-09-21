import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleCheckIcon } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/server";

interface LoginPageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  const { message } = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to your LeadFlow workspace"
    >
      {message === "check-email" && (
        <p
          role="status"
          className="mb-4 flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800"
        >
          <CircleCheckIcon className="mt-0.5 size-4 shrink-0" />
          Account created! Check your inbox to confirm your email, then sign
          in below.
        </p>
      )}
      <LoginForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
