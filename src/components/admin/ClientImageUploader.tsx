"use client";

import { Button } from "components/ui/button";
import { useImageUpload } from "hooks/useImageUpload";

interface Props {
  targetInputId?: string;
  label?: string;
}

export default function ClientImageUploader({ targetInputId, label = "Upload Image" }: Props) {
  const { fileInputRef, isUploading, handleFileSelect } = useImageUpload({
    uploadType: "avatar",
    onChange: (url: string) => {
      if (targetInputId) {
        const el = document.getElementById(targetInputId) as HTMLInputElement | null;
        if (el) el.value = url || "";
      }
    },
    onUploadComplete: (_url: string) => {
      // Prefer to show toast in the parent, but try to show one if available
      import("sonner").then((m) => m.toast && m.toast.success("Image uploaded")).catch(() => {});
    },
  });

  return (
    <div className="flex items-center gap-4">
      <label htmlFor={targetInputId ?? "upload-file"} className="sr-only">
        Upload profile image
      </label>
      <input
        id={targetInputId ?? "upload-file"}
        type="file"
        accept="image/*"
        className="sr-only"
        ref={fileInputRef}
        onChange={handleFileSelect}
        aria-label="Upload profile image"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : label}
      </Button>
    </div>
  );
}
