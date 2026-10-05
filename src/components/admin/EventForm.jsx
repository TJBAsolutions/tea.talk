import React, { useState } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function EventForm({ event, menus, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: event?.name || "",
    topic: event?.topic || "",
    description: event?.description || "",
    date: event?.date || "",
    start_time: event?.start_time || "",
    end_time: event?.end_time || "",
    location: event?.location || "",
    rsvp_link: event?.rsvp_link || "",
    image: event?.image || "",
    is_published: event?.is_published ?? false,
    is_featured: event?.is_featured ?? false,
    sort_order: event?.sort_order ?? 0,
    menu: event?.menu || (menus[0]?.id || ""),
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      set("image", file_url);
    } catch (e) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const field = "bg-white/5 border-white/15 text-white placeholder:text-white/40";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">
          {event ? "Edit event" : "New event"}
        </h3>
        <button type="button" onClick={onCancel} className="text-white/50 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div>
        <Label className="text-white/70">Event name</Label>
        <Input value={form.name} onChange={(e) => set("name", e.target.value)} required className={`mt-1 ${field}`} />
      </div>

      <div>
        <Label className="text-white/70">Topic</Label>
        <Input value={form.topic} onChange={(e) => set("topic", e.target.value)} className={`mt-1 ${field}`} placeholder="e.g. Dating & Relationships" />
      </div>

      <div>
        <Label className="text-white/70">Description</Label>
        <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={`mt-1 ${field}`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-white/70">Date</Label>
          <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required className={`mt-1 ${field}`} />
        </div>
        <div>
          <Label className="text-white/70">Sort order</Label>
          <Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className={`mt-1 ${field}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-white/70">Start time</Label>
          <Input value={form.start_time} onChange={(e) => set("start_time", e.target.value)} className={`mt-1 ${field}`} placeholder="7:00 PM" />
        </div>
        <div>
          <Label className="text-white/70">End time</Label>
          <Input value={form.end_time} onChange={(e) => set("end_time", e.target.value)} className={`mt-1 ${field}`} placeholder="9:00 PM" />
        </div>
      </div>

      <div>
        <Label className="text-white/70">Location</Label>
        <Input value={form.location} onChange={(e) => set("location", e.target.value)} className={`mt-1 ${field}`} />
      </div>

      <div>
        <Label className="text-white/70">RSVP link</Label>
        <Input value={form.rsvp_link} onChange={(e) => set("rsvp_link", e.target.value)} className={`mt-1 ${field}`} placeholder="https://..." />
      </div>

      <div>
        <Label className="text-white/70">Monthly menu</Label>
        <select
          value={form.menu}
          onChange={(e) => set("menu", e.target.value)}
          className={`mt-1 w-full h-10 rounded-md px-3 ${field}`}
        >
          <option value="">— None —</option>
          {menus.map((m) => (
            <option key={m.id} value={m.id} className="text-black">{m.month_label}</option>
          ))}
        </select>
      </div>

      <div>
        <Label className="text-white/70">Event image</Label>
        <div className="mt-1 flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2.5 border border-white/20 rounded-md text-sm text-white cursor-pointer hover:bg-white/5">
            <Upload size={16} />
            {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0])}
              disabled={uploading}
            />
          </label>
          {form.image && (
            <div className="flex items-center gap-2">
              <img src={form.image} alt="" className="w-12 h-12 object-cover rounded" />
              <button type="button" onClick={() => set("image", "")} className="text-white/40 hover:text-terracotta">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-2">
        <label className="flex items-center justify-between">
          <span className="text-white/80 text-sm">Published</span>
          <Switch checked={form.is_published} onCheckedChange={(v) => set("is_published", v)} />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-white/80 text-sm">Featured (Next Tea.Talk)</span>
          <Switch checked={form.is_featured} onCheckedChange={(v) => set("is_featured", v)} />
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="flex-1 bg-terracotta hover:opacity-90 text-white" style={{ backgroundColor: "#CC3D0B" }}>
          {saving ? "Saving…" : "Save event"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="border-white/20 text-white hover:bg-white/5">
          Cancel
        </Button>
      </div>
    </form>
  );
}