import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { deleteAuthor, updateAuthor } from "lib/actions/authors";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";

// Small client-only uploader that posts to /api/upload and writes the resulting URL
// into the hidden input with id provided via `targetInputId`.
function ClientImageUploader({ targetInputId }: { targetInputId: string }) {
  "use client";
  import("sonner").then((m) => m); // ensure toast available at runtime if used elsewhere

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "avatar");

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const el = document.getElementById(targetInputId) as HTMLInputElement | null;
      if (el) el.value = data.url || "";
      // show a simple alert as a fallback notification
      try {
        const { toast } = await import("sonner");
        toast.success("Image uploaded");
      } catch {
        // ignore
      }
    } catch (err) {
      try {
        const { toast } = await import("sonner");
        toast.error((err as Error).message || "Upload failed");
      } catch {
        alert((err as Error).message || "Upload failed");
      }
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input
        id="profile-upload-file"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById("profile-upload-file")?.click()}
      >
        Upload Image
      </Button>
    </div>
  );
}

export default async function EditAuthorForm({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  // Fetch author data on the server to populate defaults
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/authors/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    // If author not found or API failed, redirect back to list
    redirect("/admin/authors");
  }

  const author = await res.json();

  async function handleUpdate(formData: FormData) {
    // Delegate to shared server action
    const result = await updateAuthor(id, formData);
    if (result.success) {
      revalidatePath("/admin/authors");
      revalidatePath(`/admin/authors/${id}`);
      redirect("/admin/authors");
    }
    throw new Error(result.error || "Failed to update author");
  }

  async function handleDelete() {
    const result = await deleteAuthor(id);
    if (result.success) {
      revalidatePath("/admin/authors");
      redirect("/admin/authors");
    }
    throw new Error(result.error || "Failed to delete author");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Author</h1>
        <p className="text-muted-foreground">Update the author information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Author Information</CardTitle>
          <CardDescription>Modify the details for this author</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleUpdate} className="space-y-6" method="post">
            <div className="space-y-2">
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <Input
                id="name"
                name="name"
                defaultValue={author.name ?? ""}
                placeholder="Author's full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="sr-only">
                Biography
              </label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={author.bio ?? ""}
                placeholder="Brief biography of the author..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="sr-only">
                Profile Image
              </label>
              <Input
                id="image"
                name="image"
                type="url"
                defaultValue={author.profileImage ?? ""}
                placeholder="https://example.com/image.jpg"
              />
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">or</span>
                <ClientImageUploader targetInputId="image" />
              </div>
              {author.profileImage && (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border mt-2">
                  <Image
                    src={author.profileImage}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Upload or provide URL for author's profile image
              </p>
            </div>

            <div className="flex justify-between">
              <form action={async () => handleDelete()} method="post">
                <Button type="submit" variant="destructive">
                  Delete Author
                </Button>
              </form>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => (window as any).history.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
