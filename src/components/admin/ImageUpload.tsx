// ═══════════════════════════════════════════════════
// IMAGE UPLOAD COMPONENT - Reusable Image Upload with Preview
// ═══════════════════════════════════════════════════

"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "ui/button";
import { cn } from "utils";

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  onRemove?: (url?: string) => void;
  onUploadComplete?: (url: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  type?: "comic" | "chapter" | "avatar" | "other";
  uploadType?: "comic" | "chapter" | "avatar" | "other";
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export function ImageUpload({
  value,
  onChange,
  onRemove,
  onUploadComplete,
  disabled = false,
  className,
  label = "Upload Image",
  accept = "image/jpeg,image/png,image/webp,image/gif",
  maxSize = 10,
  type = "other",
  uploadType,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed @/types: ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}`;
    }

    // Additional image dimension validation could be added here
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Reset states
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", uploadType || type);

      // Simulate progress for better UX (since fetch doesn't support upload progress natively)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("No URL returned from upload");
      }

      // Success state
      setSuccess(true);

      // Call both callbacks if provided
      if (onChange) {
        onChange(data.url);
      }
      if (onUploadComplete) {
        onUploadComplete(data.url);
      }

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(value);
    } else if (onChange) {
      onChange("");
    }
  };
  if (success) {
    console.log("Upload successful");
    console.log(uploadProgress);
  }
  return (
    <div className={cn("space-y-4", className)}>
      {value ? (
        <div
          className={`
            relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-muted
          `}
        >
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            `
              flex aspect-video w-full max-w-md cursor-pointer flex-col items-center justify-center
              gap-2 rounded-lg border-2 border-dashed bg-muted/50 transition-colors
              hover:bg-muted
            `,
            disabled && "cursor-not-allowed opacity-50"
          )}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
              fileInputRef.current?.click();
            }
          }}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">Click to browse or drag and drop</p>
                <p className="text-xs text-muted-foreground">
                  Max {maxSize}MB • JPG, PNG, WebP, GIF
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
        aria-label={`Upload ${label}`}
        title={`Upload ${label}`}
      />

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
      )}
    </div>
  );
}
