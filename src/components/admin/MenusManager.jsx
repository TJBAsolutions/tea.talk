import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function MenusManager({ onMenusChange }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const page = await base44.entities.MonthlyMenu.filter({}, { sort: "-sort_order", limit: 50 });
      const items = page.items || [];
      setMenus(items);
      onMenusChange?.(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const f = editing.form;
    if (editing.id) {
      await base44.entities.MonthlyMenu.update(editing.id, f);
    } else {
      await base44.entities.MonthlyMenu.create(f);
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this menu? Events in it stay but become ungrouped.")) return;
    await base44.entities.MonthlyMenu.delete(id);
    load();
  };

  const togglePublish = async (m) => {
    await base44.entities.MonthlyMenu.update(m.id, { is_published: !m.is_published });
    load();
  };

  const field = "bg-white/5 border-white/15 text-white placeholder:text-white/40";

  if (editing) {
    return (
      <form onSubmit={save} className="max-w-xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-white">{editing.id ? "Edit menu" : "New monthly menu"}</h3>
          <button type="button" onClick={() => setEditing(null)} className="text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div>
          <Label className="text-white/70">Month label</Label>
          <Input
            value={editing.form.month_label}
            onChange={(e) => setEditing({ ...editing, form: { ...editing.form, month_label: e.target.value } })}
            required
            placeholder="October's Menu"
            className={`mt-1 ${field}`}
          />
        </div>
        <div>
          <Label className="text-white/70">Theme</Label>
          <Input
            value={editing.form.theme}
            onChange={(e) => setEditing({ ...editing, form: { ...editing.form, theme: e.target.value } })}
            placeholder="Dating & Relationships"
            className={`mt-1 ${field}`}
          />
        </div>
        <div>
          <Label className="text-white/70">Sort order (higher = shown first)</Label>
          <Input
            type="number"
            value={editing.form.sort_order}
            onChange={(e) => setEditing({ ...editing, form: { ...editing.form, sort_order: Number(e.target.value) } })}
            className={`mt-1 ${field}`}
          />
        </div>
        <label className="flex items-center justify-between">
          <span className="text-white/80 text-sm">Published</span>
          <Switch
            checked={editing.form.is_published}
            onCheckedChange={(v) => setEditing({ ...editing, form: { ...editing.form, is_published: v } })}
          />
        </label>
        <Button type="submit" className="w-full text-white" style={{ backgroundColor: "#CC3D0B" }}>
          Save menu
        </Button>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl text-white">Monthly menus</h2>
        <button
          onClick={() => setEditing({ form: { month_label: "", theme: "", sort_order: 0, is_published: false } })}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm text-white"
          style={{ backgroundColor: "#CC3D0B" }}
        >
          <Plus size={16} /> New
        </button>
      </div>
      <p className="text-white/40 text-xs mb-4">
        Tip: create a menu here, then assign events to it from the Events tab and set their sort order.
      </p>
      {loading ? (
        <p className="text-white/50 text-sm">Loading…</p>
      ) : menus.length === 0 ? (
        <p className="text-white/50 text-sm italic">No menus yet.</p>
      ) : (
        <div className="space-y-2">
          {menus.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-md bg-white/5 border border-white/10">
              <button onClick={() => togglePublish(m)} className={m.is_published ? "text-terracotta" : "text-white/30"}>
                {m.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm truncate">{m.month_label}</p>
                <p className="text-white/40 text-xs italic truncate">{m.theme || "no theme"}</p>
              </div>
              <button onClick={() => setEditing({ id: m.id, form: { month_label: m.month_label, theme: m.theme, sort_order: m.sort_order, is_published: m.is_published } })} className="text-white/50 hover:text-white">
                <Pencil size={16} />
              </button>
              <button onClick={() => remove(m.id)} className="text-white/50 hover:text-terracotta">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}