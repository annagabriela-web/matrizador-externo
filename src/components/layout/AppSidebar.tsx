import {
  Home,
  Plus,
  ClipboardList,
  Package,
  HelpCircle,
  Menu,
  X,
  Settings,
  User
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

const mainNavItems = [
  { icon: Home, label: "Inicio", path: "/" },
  { icon: Plus, label: "Registrar Trámite", path: "/registrar" },
  { icon: ClipboardList, label: "Mis Trámites", path: "/tramites" },
  { icon: Package, label: "Materiales", path: "/materiales" },
  { icon: HelpCircle, label: "Ayuda", path: "/ayuda" },
];

const configNavItems = [
  { icon: Settings, label: "Configuración", path: "/configuracion" },
  { icon: User, label: "Perfil", path: "/perfil" },
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
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg bg-fides-navy-800 text-white shadow-lg"
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
          fixed top-0 left-0 h-full w-[220px] z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          background: 'linear-gradient(180deg, #1e3a5f 0%, #152238 100%)'
        }}
      >
        {/* Logo - FIDES Branding */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-3">
            {/* Logo F con efecto */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <span
                className="text-3xl font-bold"
                style={{
                  color: '#5170ff',
                  textShadow: '2px 2px 0 #F59E0B'
                }}
              >
                F
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight tracking-tight">
                Fides
              </h1>
              <p className="text-[11px] text-white/60 leading-tight">
                Management<br />Suite
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {/* Main Menu Section */}
          <div className="mb-6">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2 px-3">
              Menú Principal
            </p>
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium
                    transition-all duration-200
                    ${isActive(item.path)
                      ? "bg-[#5170ff] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <item.icon size={20} strokeWidth={2} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Configuration Section */}
          <div>
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2 px-3">
              Configuración
            </p>
            <div className="space-y-1">
              {configNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium
                    transition-all duration-200
                    ${isActive(item.path)
                      ? "bg-[#5170ff] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <item.icon size={20} strokeWidth={2} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer spacer */}
        <div className="p-3" />
      </aside>
    </>
  );
}
