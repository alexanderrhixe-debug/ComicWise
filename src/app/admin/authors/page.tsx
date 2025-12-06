import { Plus } from "lucide-react";
import Link from "next/link";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";

async function getAuthors() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/authors?limit=100`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch authors");
  }

  const data = await response.json();
  return data.authors || [];
}

export default async function AuthorsPage() {
  const authors = await getAuthors();

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "bio",
      header: "Bio",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Authors</h1>
          <p className="text-muted-foreground">Manage comic authors and writers</p>
        </div>
        <Button asChild>
          <Link href="/admin/authors/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Author
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={authors} />
    </div>
  );
}
