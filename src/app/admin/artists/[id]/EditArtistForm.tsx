import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { deleteArtist, updateArtist } from "lib/actions/artists";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";

function ClientImageUploader({ targetInputId }: { targetInputId: string }) {
  "use client";
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
        id="artist-profile-upload-file"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById("artist-profile-upload-file")?.click()}
      >
        Upload Image
      </Button>
    </div>
  );
}

export default async function EditArtistForm({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/artists/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    redirect("/admin/artists");
  }

  const artist = await res.json();

  async function handleUpdate(formData: FormData) {
    const result = await updateArtist(id, formData);
    if (result.success) {
      revalidatePath("/admin/artists");
      revalidatePath(`/admin/artists/${id}`);
      redirect("/admin/artists");
    }
    throw new Error(result.error || "Failed to update artist");
  }

  async function handleDelete() {
    const result = await deleteArtist(id);
    if (result.success) {
      revalidatePath("/admin/artists");
      redirect("/admin/artists");
    }
    throw new Error(result.error || "Failed to delete artist");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Artist</h1>
        <p className="text-muted-foreground">Update the artist information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Artist Information</CardTitle>
          <CardDescription>Modify the details for this artist</CardDescription>
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
                defaultValue={artist.name ?? ""}
                placeholder="Artist's full name"
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
                defaultValue={artist.bio ?? ""}
                placeholder="Brief biography of the artist..."
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
                defaultValue={artist.profileImage ?? ""}
                placeholder="https://example.com/image.jpg"
              />
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">or</span>
                <ClientImageUploader targetInputId="image" />
              </div>
              {artist.profileImage && (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border mt-2">
                  <Image
                    src={artist.profileImage}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Upload or provide URL for artist's profile image
              </p>
            </div>

            <div className="flex justify-between">
              <form action={async () => handleDelete()} method="post">
                <Button type="submit" variant="destructive">
                  Delete Artist
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
