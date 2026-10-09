"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Trash2, Star, Edit2, X } from "lucide-react";
import { Database } from "@/types/database";

type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

interface GalleryManagerProps {
  images: GalleryImage[];
  categories: Category[];
}

export function GalleryManager({ images: initialImages, categories }: GalleryManagerProps) {
  const [images, setImages] = useState(initialImages);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    alt_text: string;
    category_id: string;
    featured: boolean;
  }>({
    title: "",
    description: "",
    alt_text: "",
    category_id: "",
    featured: false,
  });
  const router = useRouter();

  const handleUploadSuccess = async (result: any) => {
    const imageUrl = result.info.secure_url;
    const publicId = result.info.public_id;

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          storage_path: publicId,
          alt_text: formData.alt_text || "Gallery image",
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id || null,
          featured: formData.featured,
          width: result.info.width,
          height: result.info.height,
        }),
      });

      if (!response.ok) throw new Error("Failed to save image");

      toast.success("Image uploaded successfully!");
      router.refresh();
      setFormData({
        title: "",
        description: "",
        alt_text: "",
        category_id: "",
        featured: false,
      });
    } catch (error) {
      toast.error("Failed to save image");
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, storagePath }),
      });

      if (!response.ok) throw new Error("Failed to delete");

      setImages(images.filter((img) => img.id !== id));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleUpdate = async () => {
    if (!editingImage) return;

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingImage.id,
          ...formData,
        }),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast.success("Image updated successfully");
      setEditingImage(null);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update image");
    }
  };

  const startEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title || "",
      description: image.description || "",
      alt_text: image.alt_text,
      category_id: image.category_id || "",
      featured: image.featured,
    });
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Image title"
              />
            </div>
            <div>
              <Label>Alt Text *</Label>
              <Input
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Descriptive text for accessibility"
                required
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formData.category_id || ""}
                onValueChange={(value) => setFormData({ ...formData, category_id: value ?? "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category">{formData.category_id ? categories.find(c => c.id === formData.category_id)?.name : "Select category"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Image description"
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="featured">Featured on homepage</Label>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <CldUploadWidget
            uploadPreset="ml_default"
            options={{
              folder: "steve-mezzo-images",
              resourceType: "image",
              maxFileSize: 10000000,
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
            }}
            onSuccess={handleUploadSuccess}
          >
            {({ open }) => (
              <Button
                onClick={() => {
                  if (!formData.alt_text) {
                    toast.error("Please provide alt text before uploading");
                    return;
                  }
                  open();
                }}
                className="bg-gold hover:bg-gold-dark text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            )}
          </CldUploadWidget>
        </div>
      </Card>

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Image</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditingImage(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Alt Text *</Label>
                <Input
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category_id || ""}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value ?? "" })}
                >
                  <SelectTrigger>
                    <SelectValue>{formData.category_id ? categories.find(c => c.id === formData.category_id)?.name : "Select category"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-edit"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="featured-edit">Featured on homepage</Label>
              </div>
              <Button onClick={handleUpdate} className="w-full bg-gold hover:bg-gold-dark text-white">
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Gallery Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Gallery Images ({images.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden group relative">
              <div className="aspect-square relative">
                <Image
                  src={image.image_url}
                  alt={image.alt_text}
                  fill
                  className="object-cover"
                />
                {image.featured && (
                  <div className="absolute top-2 right-2 bg-gold text-white p-1 rounded">
                    <Star className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="p-3 space-y-2">
                <div className="text-sm font-medium truncate">{image.title || "Untitled"}</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(image)}
                    className="flex-1"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(image.id, image.storage_path)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
