import { User, Circle } from "lucide-react";

type CupoStatus = "disponible" | "alerta" | "critico" | "bloqueado";

interface AppHeaderProps {
  userName?: string;
  role?: string;
  notaria?: string;
  cupoStatus?: CupoStatus;
}

const cupoConfig: Record<CupoStatus, { label: string; bgColor: string; textColor: string; dotColor: string }> = {
  disponible: {
    label: "Disponible",
    bgColor: "#d1fae5",
    textColor: "#065f46",
    dotColor: "#10b981"
  },
  alerta: {
    label: "Límite próximo",
    bgColor: "#fef3c7",
    textColor: "#92400e",
    dotColor: "#f59e0b"
  },
  critico: {
    label: "Límite casi alcanzado",
    bgColor: "#fee2e2",
    textColor: "#991b1b",
    dotColor: "#ef4444"
  },
  bloqueado: {
    label: "No puedes registrar",
    bgColor: "#e5e7eb",
    textColor: "#374151",
    dotColor: "#6b7280"
  },
};

export function AppHeader({
  userName = "Vicenta Alarcón",
  role = "Matrizadora Externa",
  notaria = "Notaría 2da Portoviejo",
  cupoStatus = "disponible",
}: AppHeaderProps) {
  const cupo = cupoConfig[cupoStatus];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: Notaria Name */}
      <div className="hidden lg:block">
        <p className="text-[15px] font-medium text-gray-600">{notaria}</p>
      </div>

      {/* Mobile spacer */}
      <div className="lg:hidden w-14" />

      {/* Right: Cupo Status + User Info */}
      <div className="flex items-center gap-5">
        {/* Cupo Indicator */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: cupo.bgColor,
            color: cupo.textColor,
            border: `1px solid ${cupo.dotColor}40`
          }}
        >
          <Circle size={8} fill={cupo.dotColor} color={cupo.dotColor} />
          <span>{cupo.label}</span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-[15px] font-semibold text-gray-800">{userName}</p>
            <p className="text-[13px] text-gray-500">{role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <User size={20} className="text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
