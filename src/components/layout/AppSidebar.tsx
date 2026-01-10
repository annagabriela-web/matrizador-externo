import { 
  Home, 
  Plus, 
  ClipboardList, 
  Package, 
  HelpCircle, 
  LogOut, 
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
          fixed top-0 left-0 h-full w-[280px] fides-sidebar z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo - FIDES Branding */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            {/* Icono F con efecto especial */}
            <div className="flex-shrink-0">
              <span 
                className="font-sans text-[32px] font-bold leading-none"
                style={{ 
                  color: '#5170ff',
                  textShadow: '2px 2px 0 #F59E0B, -1px 4px 0 #3a5ae0'
                }}
              >
                F
              </span>
            </div>
            <div>
              <h1 
                className="text-xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Quattrocento', serif" }}
              >
                Fides
              </h1>
              <p className="text-xs text-white/70 leading-tight">
                Management<br />Suite
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          {/* Main Menu Section */}
          <div className="px-4 mb-6">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-3">
              Menú Principal
            </p>
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`fides-sidebar-item ${isActive(item.path) ? "active" : ""}`}
                >
                  <item.icon size={22} strokeWidth={2} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Configuration Section */}
          <div className="px-4">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-3">
              Configuración
            </p>
            <div className="space-y-1">
              {configNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`fides-sidebar-item ${isActive(item.path) ? "active" : ""}`}
                >
                  <item.icon size={22} strokeWidth={2} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all"
            style={{
              background: 'rgba(220, 38, 38, 0.15)',
              color: '#FCA5A5'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
            }}
          >
            <LogOut size={20} strokeWidth={2} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
