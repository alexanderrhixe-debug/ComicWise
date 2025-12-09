import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

async function getTypes() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/types?limit=100`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch types");
  }

  const data = await response.json();
  return data.types || [];
}

export default async function TypesPage() {
  const types = await getTypes();

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
      accessorKey: "description",
      header: "Description",
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
          <h1 className="text-3xl font-bold tracking-tight">Types</h1>
          <p className="text-muted-foreground">Manage comic types (Manga, Manhwa, Manhua, etc.)</p>
        </div>
        <Button asChild>
          <Link href="/admin/types/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Type
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={types} />
    </div>
  );
}
