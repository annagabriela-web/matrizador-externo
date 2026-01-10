import { Home, Plus, ClipboardList, Package, HelpCircle, LogOut, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Inicio", path: "/" },
  { icon: Plus, label: "Registrar Trámite", path: "/registrar" },
  { icon: ClipboardList, label: "Mis Trámites", path: "/tramites" },
  { icon: Package, label: "Materiales", path: "/materiales" },
  { icon: HelpCircle, label: "Ayuda", path: "/ayuda" },
];

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg bg-fides-navy-800 text-white shadow-fides-md"
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[280px] fides-sidebar z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fides-accent to-fides-accent-dark flex items-center justify-center shadow-fides-md">
              <span className="font-logo text-xl font-bold text-white">F</span>
            </div>
            <div>
              <h1 className="font-logo text-xl font-bold text-white">Fides</h1>
              <p className="text-xs text-white/60">Management Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`fides-sidebar-item ${isActive(item.path) ? "active" : ""}`}
            >
              <item.icon size={24} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button className="fides-sidebar-item w-full text-red-300 hover:text-red-200 hover:bg-red-500/10">
            <LogOut size={24} strokeWidth={2} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
