"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "components/ui/card";

export default function NewUserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/register");
      return;
    }

    if (session?.user) {
      // Redirect new users to onboarding or home
      router.push("/");
    }
  }, [session, status, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
        <CardTitle>Setting Up Your Account</CardTitle>
        <CardDescription>Please wait while we set up your account...</CardDescription>
      </CardHeader>
    </Card>
  );
}
