import { User, Circle } from "lucide-react";

type CupoStatus = "disponible" | "alerta" | "critico" | "bloqueado";

interface AppHeaderProps {
  userName?: string;
  role?: string;
  notaria?: string;
  cupoStatus?: CupoStatus;
}

const cupoConfig: Record<CupoStatus, { label: string; className: string; color: string }> = {
  disponible: { label: "Disponible", className: "cupo-disponible", color: "text-emerald-500" },
  alerta: { label: "Límite próximo", className: "cupo-alerta", color: "text-amber-500" },
  critico: { label: "Límite casi alcanzado", className: "cupo-critico", color: "text-red-500" },
  bloqueado: { label: "No puedes registrar", className: "cupo-bloqueado", color: "text-gray-500" },
};

export function AppHeader({
  userName = "Vicenta Alarcón",
  role = "Matrizadora Externa",
  notaria = "Notaría 2da Portoviejo",
  cupoStatus = "disponible",
}: AppHeaderProps) {
  const cupo = cupoConfig[cupoStatus];

  return (
    <header className="fides-header justify-between">
      {/* Left: Notaria Name (hidden on mobile, replaced by menu button space) */}
      <div className="hidden lg:block">
        <p className="text-base font-medium text-mat-text-secondary">{notaria}</p>
      </div>

      {/* Mobile spacer for menu button */}
      <div className="lg:hidden w-14" />

      {/* Right: User Info + Cupo */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Cupo Indicator */}
        <div className={cupo.className}>
          <Circle size={12} className="fill-current" />
          <span className="hidden sm:inline">{cupo.label}</span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-base font-semibold text-mat-text-primary">{userName}</p>
            <p className="text-sm text-mat-text-muted">{role}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-fides-lavender-200 flex items-center justify-center">
            <User size={22} className="text-fides-navy-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
