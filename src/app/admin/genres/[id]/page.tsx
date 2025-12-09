"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const genreSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().optional(),
  })
  .strict();

type GenreFormValues = z.infer<typeof genreSchema>;

interface Genre {
  id: number;
  name: string;
  description: string | null;
}

export default function EditGenrePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    async function fetchGenre() {
      try {
        const response = await fetch(`/api/genres/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch genre");
        }

        const data: Genre = await response.json();
        form.reset({
          name: data.name,
          description: data.description || "",
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load genre");
        router.push("/admin/genres");
      } finally {
        setIsFetching(false);
      }
    }

    fetchGenre();
  }, [params.id, form, router]);

  async function onSubmit(data: GenreFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/genres/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update genre");
      }

      toast.success("Genre updated successfully");
      router.push("/admin/genres");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update genre");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this genre?")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/genres/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete genre");
      }

      toast.success("Genre deleted successfully");
      router.push("/admin/genres");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete genre");
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading genre...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Genre</h1>
        <p className="text-muted-foreground">Update the genre information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Genre Information</CardTitle>
          <CardDescription>Modify the details for this genre</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Action, Romance, Fantasy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this genre..."
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
                  Delete Genre
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
