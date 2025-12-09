import { DataTable } from "components/admin/DataTable";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

async function getArtists() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/artists?limit=100`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch artists");
  }

  const data = await response.json();
  return data.artists || [];
}

export default async function ArtistsPage() {
  const artists = await getArtists();

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
          <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
          <p className="text-muted-foreground">Manage comic artists and illustrators</p>
        </div>
        <Button asChild>
          <Link href="/admin/artists/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Artist
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={artists} />
    </div>
  );
}
