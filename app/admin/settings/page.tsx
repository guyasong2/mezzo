"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Save from "lucide-react/dist/esm/icons/save.mjs";
import Link from "next/link";

interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  updated_at: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .order("key");
    if (data) {
      setSettings(data);
      const vals: Record<string, any> = {};
      data.forEach((s) => (vals[s.key] = s.value));
      setEditValues(vals);
    }
    setLoading(false);
  };

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: editValues[key] }),
      });
      if (!res.ok) throw new Error();
      toast.success(`"${key}" updated!`);
      setEditingKey(null);
      loadSettings();
    } catch {
      toast.error("Failed to save setting");
    } finally {
      setSaving(null);
    }
  };

  const renderValueEditor = (setting: SiteSetting) => {
    const value = editValues[setting.key];
    const isEditing = editingKey === setting.key;

    if (!isEditing) {
      return (
        <pre className="text-xs bg-secondary p-3 rounded overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div className="space-y-3">
          {Object.entries(value).map(([k, v]) => {
            if (typeof v === "object" && v !== null) {
              return (
                <div key={k}>
                  <Label className="text-xs font-semibold">{k}</Label>
                  <div className="ml-4 space-y-2 mt-1">
                    {Object.entries(v as Record<string, any>).map(([subK, subV]) => (
                      <div key={subK} className="flex items-center gap-2">
                        <Label className="text-xs w-20 flex-shrink-0">{subK}</Label>
                        <Input
                          value={String(subV ?? "")}
                          onChange={(e) => {
                            const updated = { ...editValues };
                            updated[setting.key] = {
                              ...updated[setting.key],
                              [k]: { ...(updated[setting.key][k] as any), [subK]: e.target.value },
                            };
                            setEditValues(updated);
                          }}
                          className="text-sm h-8"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={k} className="flex items-center gap-2">
                <Label className="text-xs w-28 flex-shrink-0">{k}</Label>
                <Input
                  value={String(v ?? "")}
                  onChange={(e) => {
                    const updated = { ...editValues };
                    const numVal = Number(e.target.value);
                    updated[setting.key] = {
                      ...updated[setting.key],
                      [k]: !isNaN(numVal) && typeof v === "number" ? numVal : e.target.value,
                    };
                    setEditValues(updated);
                  }}
                  className="text-sm h-8"
                />
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <Input
        value={String(value ?? "")}
        onChange={(e) => {
          const updated = { ...editValues };
          updated[setting.key] = e.target.value;
          setEditValues(updated);
        }}
        className="text-sm"
      />
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // Filter out about_text and about_image since they have their own editor
  const filteredSettings = settings.filter(
    (s) => s.key !== "about_text" && s.key !== "about_image"
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Settings</h1>
        <p className="text-foreground/60">Manage site configuration</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">About Section</CardTitle>
              <p className="text-sm text-foreground/60 mt-1">Edit the about page heading, text, stats, and image</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/about">Edit About</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {filteredSettings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{setting.key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</CardTitle>
                  {setting.description && (
                    <p className="text-sm text-foreground/60 mt-1">{setting.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingKey === setting.key ? (
                    <>
                      <Button
                        onClick={() => {
                          setEditingKey(null);
                          const vals = { ...editValues };
                          vals[setting.key] = setting.value;
                          setEditValues(vals);
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSave(setting.key)}
                        disabled={saving === setting.key}
                        size="sm"
                        className="bg-gold hover:bg-gold-dark text-white"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        {saving === setting.key ? "Saving..." : "Save"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setEditingKey(setting.key)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderValueEditor(setting)}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
