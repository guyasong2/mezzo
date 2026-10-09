"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { CldImage } from "next-cloudinary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Upload from "lucide-react/dist/esm/icons/upload.mjs";
import Save from "lucide-react/dist/esm/icons/save.mjs";

const DEFAULT_HEADING = "Steve Mezzo";
const DEFAULT_PARAGRAPHS = [
  "With over a decade of experience in professional photography, I specialize in capturing authentic moments that tell compelling stories. My approach combines technical excellence with artistic vision to create images that stand the test of time.",
  "From intimate portraits to grand events, every project receives my full attention and creative expertise. I believe that great photography isn't just about the camera—it's about understanding people, light, and emotion.",
  "Based in Texas, I work with clients locally and internationally, bringing a unique perspective to every shoot. Whether it's a wedding, corporate event, or personal branding session, I'm committed to delivering exceptional results that exceed expectations.",
];
const DEFAULT_STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "15+", label: "Awards Won" },
  { value: "1000+", label: "Projects Completed" },
];

export default function AdminAboutPage() {
  const [heading, setHeading] = useState(DEFAULT_HEADING);
  const [paragraphs, setParagraphs] = useState(DEFAULT_PARAGRAPHS);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((res) => res.json())
      .then((data) => {
        if (data.text) {
          const t = data.text as any;
          if (t.heading) setHeading(t.heading);
          if (t.paragraphs) setParagraphs(t.paragraphs);
          if (t.stats) setStats(t.stats);
        }
        if (data.image?.url) {
          setImageUrl(data.image.url);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heading,
          paragraphs,
          stats,
          image_url: imageUrl || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("About section updated!");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const updateParagraph = (index: number, value: string) => {
    const updated = [...paragraphs];
    updated[index] = value;
    setParagraphs(updated);
  };

  const addParagraph = () => setParagraphs([...paragraphs, ""]);
  const removeParagraph = (index: number) =>
    setParagraphs(paragraphs.filter((_, i) => i !== index));

  const updateStat = (index: number, field: "value" | "label", val: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: val };
    setStats(updated);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Edit About Section</h1>
          <p className="text-foreground/60">Update the about section on the homepage and about page</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold-dark text-white">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              {imageUrl && (
                <div className="relative w-40 h-40 flex-shrink-0">
                  <CldImage
                    src={imageUrl}
                    alt="About photo"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-3">
                <p className="text-sm text-foreground/60">
                  Upload a new profile photo. Leave empty to keep the default Cloudinary image.
                </p>
                <CldUploadWidget
                  uploadPreset="ml_default"
                  options={{
                    folder: "steve-mezzo-images",
                    resourceType: "image",
                    maxFileSize: 10000000,
                    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                  }}
                  onSuccess={(result: any) => {
                    setImageUrl(result.info.public_id);
                    toast.success("Photo uploaded!");
                  }}
                >
                  {({ open }) => (
                    <Button onClick={() => open()} variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  )}
                </CldUploadWidget>
                {imageUrl && (
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Cloudinary public ID or URL"
                    className="text-sm"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heading */}
        <Card>
          <CardHeader>
            <CardTitle>Heading</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="About heading name"
            />
          </CardContent>
        </Card>

        {/* Paragraphs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Text Content</CardTitle>
              <Button onClick={addParagraph} variant="outline" size="sm">
                Add Paragraph
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {paragraphs.map((p, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label>Paragraph {i + 1}</Label>
                  {paragraphs.length > 1 && (
                    <Button
                      onClick={() => removeParagraph(i)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive text-xs h-7"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Textarea
                  value={p}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                  rows={4}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-1">
                    <Label className="text-xs">Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => updateStat(i, "value", e.target.value)}
                      placeholder="10+"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(i, "label", e.target.value)}
                      placeholder="Years Experience"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
