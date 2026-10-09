"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CloudinaryUploadProps {
  onUpload: (result: any) => void;
  folder?: string;
}

export function CloudinaryUpload({ onUpload, folder = "steve-mezzo-images" }: CloudinaryUploadProps) {
  return (
    <CldUploadWidget
      uploadPreset="ml_default"
      options={{
        folder,
        resourceType: "image",
        maxFileSize: 10000000,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
      }}
      onSuccess={(result) => {
        onUpload(result);
      }}
    >
      {({ open }) => (
        <Button onClick={() => open()} className="bg-gold hover:bg-gold-dark text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload from Cloudinary
        </Button>
      )}
    </CldUploadWidget>
  );
}
