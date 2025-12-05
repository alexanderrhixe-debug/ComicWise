import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import ComicForm from "../comic-form";

export const metadata: Metadata = {
  title: "Create Comic | Admin",
  description: "Add a new comic to the platform",
};

export default async function NewComicPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container max-w-4xl space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Comic</h1>
        <p className="text-muted-foreground">Add a new comic to the platform</p>
      </div>

      <ComicForm />
    </div>
  );
}
