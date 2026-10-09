"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { Database } from "@/types/database";

type PricingPackage = Database["public"]["Tables"]["pricing_packages"]["Row"];

interface PricingEditorProps {
  packages: PricingPackage[];
}

export function PricingEditor({ packages: initialPackages }: PricingEditorProps) {
  const [packages, setPackages] = useState(initialPackages);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    duration: "",
    description: "",
    features: "",
    active: true,
  });
  const router = useRouter();

  const startEdit = (pkg: PricingPackage) => {
    setEditing(pkg.id);
    setFormData({
      name: pkg.name,
      slug: pkg.slug,
      price: pkg.price.toString(),
      duration: pkg.duration || "",
      description: pkg.description || "",
      features: Array.isArray(pkg.features) ? (pkg.features as string[]).join("\n") : "",
      active: pkg.active,
    });
  };

  const handleSave = async (id?: string) => {
    try {
      const featuresArray = formData.features
        .split("\n")
        .filter((f) => f.trim())
        .map((f) => f.trim());

      const payload = {
        name: formData.name,
        slug: formData.slug,
        price: parseFloat(formData.price),
        duration: formData.duration || null,
        description: formData.description || null,
        features: featuresArray,
        active: formData.active,
      };

      const url = id ? `/api/admin/pricing?id=${id}` : "/api/admin/pricing";
      const method = id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success(id ? "Package updated" : "Package created");
      setEditing(null);
      setCreating(false);
      setFormData({
        name: "",
        slug: "",
        price: "",
        duration: "",
        description: "",
        features: "",
        active: true,
      });
      router.refresh();
    } catch (error) {
      toast.error("Failed to save package");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;

    try {
      const response = await fetch(`/api/admin/pricing?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setPackages(packages.filter((p) => p.id !== id));
      toast.success("Package deleted");
    } catch (error) {
      toast.error("Failed to delete package");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setCreating(true)}
          className="bg-gold hover:bg-gold-dark text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      {creating && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Package</h3>
          <PackageForm
            formData={formData}
            setFormData={setFormData}
            onSave={() => handleSave()}
            onCancel={() => {
              setCreating(false);
              setFormData({
                name: "",
                slug: "",
                price: "",
                duration: "",
                description: "",
                features: "",
                active: true,
              });
            }}
          />
        </Card>
      )}

      <div className="space-y-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="p-6">
            {editing === pkg.id ? (
              <PackageForm
                formData={formData}
                setFormData={setFormData}
                onSave={() => handleSave(pkg.id)}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Package Name</div>
                  <div className="font-medium text-lg">{pkg.name}</div>
                  <div className="text-sm text-foreground/60">{pkg.duration}</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Price</div>
                  <div className="text-2xl font-bold text-gold">
                    ${pkg.price.toFixed(0)}
                  </div>
                  <div className="text-sm text-foreground/60 mt-2">
                    Status: {pkg.active ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Button
                    onClick={() => startEdit(pkg)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(pkg.id)}
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function PackageForm({
  formData,
  setFormData,
  onSave,
  onCancel,
}: {
  formData: any;
  setFormData: any;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Package Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Extended Session"
          />
        </div>
        <div>
          <Label>Slug *</Label>
          <Input
            value={formData.slug}
            onChange={(e) =>
              setFormData({
                ...formData,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
            placeholder="extended-session"
          />
        </div>
        <div>
          <Label>Price (USD) *</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="200"
          />
        </div>
        <div>
          <Label>Duration</Label>
          <Input
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="1-2 hours"
          />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Package description"
          rows={3}
        />
      </div>
      <div>
        <Label>Features (one per line)</Label>
        <Textarea
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          placeholder="Professional editing&#10;Online gallery&#10;High-resolution downloads"
          rows={5}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="active"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          className="w-4 h-4"
        />
        <Label htmlFor="active">Active (visible on website)</Label>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} className="bg-gold hover:bg-gold-dark text-white">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button onClick={onCancel} variant="outline">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
