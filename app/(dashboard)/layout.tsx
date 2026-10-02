import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name || user.user_metadata?.full_name || profile?.email || user.email || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-4 border-b bg-sidebar/80 px-4 backdrop-blur-sm md:px-6">
          <p className="truncate text-xs text-muted-foreground">
            Welcome back,{" "}
            <span className="font-medium text-foreground">{displayName}</span>
          </p>
          <div className="flex items-center gap-1">
            <Avatar className="size-6 rounded-full">
              <AvatarFallback className="text-[0.625rem] font-medium">
                {initial}
              </AvatarFallback>
            </Avatar>
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOutIcon className="size-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-4 py-5 md:px-6 md:py-6">{children}</main>
      </div>
    </div>
  );
}
