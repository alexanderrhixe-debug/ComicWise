"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createComic } from "@/lib/actions/comics";

export default function ComicForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    status: "Ongoing" as const,
    publicationDate: new Date().toISOString().split("T")[0],
    rating: "0",
    authorId: "",
    artistId: "",
    typeId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        // Prepare data for validation
        const dataToValidate = {
          ...formData,
          rating: formData.rating ? parseFloat(formData.rating) : undefined,
          authorId: formData.authorId ? parseInt(formData.authorId) : undefined,
          artistId: formData.artistId ? parseInt(formData.artistId) : undefined,
          typeId: formData.typeId ? parseInt(formData.typeId) : undefined,
        };

        const result = await createComic(dataToValidate as never);

        if (result.success) {
          toast.success(result.message || "Comic created successfully!");
          router.push("/admin/comics");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to create comic");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        console.error(error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comic Information</CardTitle>
        <CardDescription>Fill in the details to create a new comic</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter comic title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter comic description"
              rows={4}
              required
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL *</Label>
            <Input
              id="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://example.com/cover.jpg"
              required
            />
            <p className="text-sm text-muted-foreground">Provide a URL to the cover image</p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as typeof formData.status })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Hiatus">Hiatus</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Dropped">Dropped</SelectItem>
                <SelectItem value="Coming Soon">Coming Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Publication Date */}
          <div className="space-y-2">
            <Label htmlFor="publicationDate">Publication Date *</Label>
            <Input
              id="publicationDate"
              type="date"
              value={formData.publicationDate}
              onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
              required
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (0-10)</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Author ID */}
            <div className="space-y-2">
              <Label htmlFor="authorId">Author ID</Label>
              <Input
                id="authorId"
                type="number"
                value={formData.authorId}
                onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                placeholder="Enter author ID"
              />
            </div>

            {/* Artist ID */}
            <div className="space-y-2">
              <Label htmlFor="artistId">Artist ID</Label>
              <Input
                id="artistId"
                type="number"
                value={formData.artistId}
                onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
                placeholder="Enter artist ID"
              />
            </div>

            {/* Type ID */}
            <div className="space-y-2">
              <Label htmlFor="typeId">Type ID</Label>
              <Input
                id="typeId"
                type="number"
                value={formData.typeId}
                onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
                placeholder="Enter type ID"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Comic"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
