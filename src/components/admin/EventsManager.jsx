import React, { useEffect, useState } from "react";
import { Plus, Pencil, Star, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import EventForm from "./EventForm";
import { formatDateShort } from "@/lib/dates";

export default function EventsManager({ menus, refreshKey }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // event or {} for new
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const page = await base44.entities.Event.filter({}, { sort: "date", limit: 100 });
      setEvents(page.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  const save = async (form) => {
    if (editing.id) {
      await base44.entities.Event.update(editing.id, form);
    } else {
      await base44.entities.Event.create(form);
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this event?")) return;
    await base44.entities.Event.delete(id);
    load();
  };

  const toggleFeatured = async (ev) => {
    if (ev.is_featured) {
      await base44.entities.Event.update(ev.id, { is_featured: false });
    } else {
      // unfeature others, feature this one
      const featured = events.filter((e) => e.is_featured);
      await base44.entities.Event.bulkUpdate(
        featured.map((e) => ({ id: e.id, is_featured: false }))
      );
      await base44.entities.Event.update(ev.id, { is_featured: true });
    }
    load();
  };

  if (editing) {
    return (
      <div className="max-w-xl mx-auto">
        <EventForm event={editing.id ? editing : null} menus={menus} onSave={save} onCancel={() => setEditing(null)} />
      </div>
    );
  }

  const filtered = filter
    ? events.filter((e) => e.menu === filter)
    : events;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl text-white">Events</h2>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm text-white"
          style={{ backgroundColor: "#CB3200" }}
        >
          <Plus size={16} /> New
        </button>
      </div>

      {menus.length > 0 && (
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4 w-full h-10 rounded-md px-3 bg-white/5 border border-white/15 text-white text-sm"
        >
          <option value="" className="text-black">All events</option>
          {menus.map((m) => (
            <option key={m.id} value={m.id} className="text-black">{m.month_label}</option>
          ))}
        </select>
      )}

      {loading ? (
        <p className="text-white/50 text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-white/50 text-sm italic">No events yet. Tap "New" to add one.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((ev) => (
            <div key={ev.id} className="flex items-center gap-3 p-3 rounded-md bg-white/5 border border-white/10">
              <button
                onClick={() => toggleFeatured(ev)}
                className={`shrink-0 ${ev.is_featured ? "text-terracotta" : "text-white/30 hover:text-white/60"}`}
                title="Set as featured / Next Tea.Talk"
              >
                <Star size={18} fill={ev.is_featured ? "currentColor" : "none"} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm truncate">
                  <span className="font-mono text-white/50 mr-2">{formatDateShort(ev.date)}</span>
                  {ev.name}
                </p>
                <p className="text-white/40 text-xs">
                  {ev.is_published ? "Published" : "Draft"}
                </p>
              </div>
              <button onClick={() => setEditing(ev)} className="text-white/50 hover:text-white">
                <Pencil size={16} />
              </button>
              <button onClick={() => remove(ev.id)} className="text-white/50 hover:text-terracotta">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}