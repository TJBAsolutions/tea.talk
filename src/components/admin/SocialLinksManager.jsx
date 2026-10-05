import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const PLATFORMS = ["Instagram", "TikTok", "RSVP", "Email", "Other"];

export default function SocialLinksManager() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ platform: "Instagram", label: "", url: "", display_order: 0, is_active: true });

  const load = async () => {
    setLoading(true);
    try {
      const page = await base44.entities.SocialLink.filter({}, { sort: "display_order", limit: 50 });
      setLinks(page.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await base44.entities.SocialLink.create(form);
    setAdding(false);
    setForm({ platform: "Instagram", label: "", url: "", display_order: links.length, is_active: true });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Remove this link?")) return;
    await base44.entities.SocialLink.delete(id);
    load();
  };

  const toggle = async (l) => {
    await base44.entities.SocialLink.update(l.id, { is_active: !l.is_active });
    load();
  };

  const field = "bg-white/5 border-white/15 text-white placeholder:text-white/40";

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl text-white">Social links</h2>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm text-white"
          style={{ backgroundColor: "#CC3D0B" }}
        >
          <Plus size={16} /> New
        </button>
      </div>

      {adding && (
        <form onSubmit={create} className="mb-5 p-4 rounded-md bg-white/5 border border-white/15 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-sm">New link</h3>
            <button type="button" onClick={() => setAdding(false)} className="text-white/50"><X size={18} /></button>
          </div>
          <div>
            <Label className="text-white/70">Platform</Label>
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className={`mt-1 w-full h-10 rounded-md px-3 ${field}`}
            >
              {PLATFORMS.map((p) => <option key={p} value={p} className="text-black">{p}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-white/70">Label (optional)</Label>
            <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="@tea.talk" className={`mt-1 ${field}`} />
          </div>
          <div>
            <Label className="text-white/70">URL</Label>
            <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required placeholder="https://..." className={`mt-1 ${field}`} />
          </div>
          <Button type="submit" className="w-full text-white" style={{ backgroundColor: "#CC3D0B" }}>Add link</Button>
        </form>
      )}

      {loading ? (
        <p className="text-white/50 text-sm">Loading…</p>
      ) : links.length === 0 ? (
        <p className="text-white/50 text-sm italic">No links yet.</p>
      ) : (
        <div className="space-y-2">
          {links.map((l) => (
            <div key={l.id} className="flex items-center gap-3 p-3 rounded-md bg-white/5 border border-white/10">
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm truncate">
                  <span className="text-terracotta mr-2">{l.platform}</span>
                  {l.label || l.url}
                </p>
                <p className="text-white/40 text-xs truncate">{l.url}</p>
              </div>
              <Switch checked={l.is_active} onCheckedChange={() => toggle(l)} />
              <button onClick={() => remove(l.id)} className="text-white/50 hover:text-terracotta">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}