import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { db } from "@/db/client";
import { chapter, comic } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ChaptersPage() {
  const chapters = await db
    .select({
      id: chapter.id,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      comicTitle: comic.title,
      releaseDate: chapter.releaseDate,
      views: chapter.views,
      createdAt: chapter.createdAt,
    })
    .from(chapter)
    .leftJoin(comic, eq(chapter.comicId, comic.id))
    .orderBy(chapter.createdAt);

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "comicTitle",
      header: "Comic",
    },
    {
      accessorKey: "chapterNumber",
      header: "Chapter #",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "views",
      header: "Views",
    },
    {
      accessorKey: "releaseDate",
      header: "Release Date",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chapters</h1>
          <p className="text-muted-foreground">Manage comic chapters and episodes</p>
        </div>
        <Button asChild>
          <Link href="/admin/chapters/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Chapter
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={chapters} />
    </div>
  );
}
