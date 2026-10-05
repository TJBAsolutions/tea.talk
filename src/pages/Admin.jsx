import React, { useState } from "react";
import { CalendarDays, LayoutGrid, Share2, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import EventsManager from "@/components/admin/EventsManager";
import MenusManager from "@/components/admin/MenusManager";
import SocialLinksManager from "@/components/admin/SocialLinksManager";

export default function Admin() {
  const [tab, setTab] = useState("events");
  const [menus, setMenus] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { logout } = useAuth();

  const tabs = [
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "menus", label: "Menus", icon: LayoutGrid },
    { id: "links", label: "Links", icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-[#1a1816] text-white" style={{ position: "relative", zIndex: 2 }}>
      <header className="sticky top-0 z-20 bg-[#1a1816]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-terracotta">Tea.Talk</p>
            <h1 className="text-lg text-white">Admin</h1>
          </div>
          <button
            onClick={() => logout?.(window.location.origin)}
            className="text-white/50 hover:text-white p-2"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
        <nav className="max-w-xl mx-auto px-5 flex gap-1 pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm transition-colors ${
                  active ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="max-w-xl mx-auto px-5 py-6">
        {tab === "events" && (
          <EventsManager menus={menus} refreshKey={refreshKey} />
        )}
        {tab === "menus" && (
          <MenusManager onMenusChange={(m) => { setMenus(m); setRefreshKey((k) => k + 1); }} />
        )}
        {tab === "links" && <SocialLinksManager />}
      </div>
    </div>
  );
}