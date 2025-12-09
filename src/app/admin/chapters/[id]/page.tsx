"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Textarea } from "components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const chapterSchema = z
  .object({
    comicId: z.number().min(1, "Comic is required"),
    chapterNumber: z.number().min(0, "Chapter number must be positive"),
    title: z.string().min(1, "Title is required").max(500),
    content: z.string().optional(),
    releaseDate: z.string().optional(),
  })
  .strict();

type ChapterFormValues = z.infer<typeof chapterSchema>;

interface Comic {
  id: number;
  title: string;
}

interface Chapter {
  id: number;
  comicId: number;
  chapterNumber: number;
  title: string;
  content: string | null;
  releaseDate: Date | null;
}

export default function EditChapterPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [comics, setComics] = useState<Comic[]>([]);

  const form = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [chapterRes, comicsRes] = await Promise.all([
          fetch(`/api/chapters/${params.id}`),
          fetch("/api/comics?limit=1000"),
        ]);

        if (!chapterRes.ok) throw new Error("Failed to fetch chapter");
        if (!comicsRes.ok) throw new Error("Failed to fetch comics");

        const chapter: Chapter = await chapterRes.json();
        const comicsData = await comicsRes.json();

        setComics(comicsData.comics || []);
        form.reset({
          comicId: chapter.comicId,
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          content: chapter.content || "",
          releaseDate: chapter.releaseDate
            ? new Date(chapter.releaseDate).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load chapter");
        router.push("/admin/chapters");
      } finally {
        setIsFetching(false);
      }
    }

    fetchData();
  }, [params.id, form, router]);

  async function onSubmit(data: ChapterFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/chapters/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update chapter");
      }

      toast.success("Chapter updated successfully");
      router.push("/admin/chapters");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update chapter");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this chapter? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/chapters/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete chapter");
      }

      toast.success("Chapter deleted successfully");
      router.push("/admin/chapters");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete chapter");
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading chapter...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Chapter</h1>
        <p className="text-muted-foreground">Update the chapter information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chapter Information</CardTitle>
          <CardDescription>Modify the details for this chapter</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="comicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comic *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a comic" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {comics.map((comic) => (
                          <SelectItem key={comic.id} value={comic.id.toString()}>
                            {comic.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="chapterNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chapter Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="releaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Chapter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content/Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Chapter summary or description..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Delete Chapter
                </Button>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
