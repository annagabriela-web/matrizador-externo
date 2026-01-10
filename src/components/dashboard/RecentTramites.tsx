import { Clock, FileText, CheckCircle } from "lucide-react";

type TramiteStatus = "pendiente" | "facturado" | "completado" | "reconciliado";

interface Tramite {
  id: string;
  fecha: string;
  cliente: string;
  tramite: string;
  estado: TramiteStatus;
  escrituraNo?: string;
}

const statusConfig: Record<TramiteStatus, { label: string; icon: typeof Clock; bgColor: string; textColor: string }> = {
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    bgColor: "#fef3c7",
    textColor: "#92400e"
  },
  facturado: {
    label: "Facturado",
    icon: FileText,
    bgColor: "#dbeafe",
    textColor: "#1e40af"
  },
  completado: {
    label: "Completado",
    icon: CheckCircle,
    bgColor: "#d1fae5",
    textColor: "#065f46"
  },
  reconciliado: {
    label: "Reconciliado",
    icon: CheckCircle,
    bgColor: "#a7f3d0",
    textColor: "#047857"
  },
};

interface RecentTramitesProps {
  tramites: Tramite[];
  onViewAll?: () => void;
}

export function RecentTramites({ tramites, onViewAll }: RecentTramitesProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="flex items-center gap-2 text-[15px] font-bold text-gray-800 uppercase tracking-wide">
          <span className="text-lg">📄</span>
          Mis Trámites Recientes
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[#5170ff] font-semibold text-[14px] hover:underline"
          >
            Ver más
          </button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
              <th className="text-left py-3 px-3 text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
              <th className="text-left py-3 px-3 text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Trámite</th>
              <th className="text-left py-3 px-3 text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
              <th className="text-left py-3 px-3 text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Escritura</th>
            </tr>
          </thead>
          <tbody>
            {tramites.map((tramite) => {
              const status = statusConfig[tramite.estado];
              const StatusIcon = status.icon;
              return (
                <tr
                  key={tramite.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3.5 px-3 text-[14px] text-gray-500">{tramite.fecha}</td>
                  <td className="py-3.5 px-3 text-[14px] font-semibold text-gray-800">{tramite.cliente}</td>
                  <td className="py-3.5 px-3 text-[14px] text-gray-600">{tramite.tramite}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold"
                      style={{
                        backgroundColor: status.bgColor,
                        color: status.textColor
                      }}
                    >
                      <StatusIcon size={14} />
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[14px] font-mono text-[#5170ff]">
                    {tramite.escrituraNo || <span className="text-gray-300">-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {tramites.map((tramite) => {
          const status = statusConfig[tramite.estado];
          const StatusIcon = status.icon;
          return (
            <div
              key={tramite.id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-[14px] text-gray-800">{tramite.cliente}</p>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                  style={{
                    backgroundColor: status.bgColor,
                    color: status.textColor
                  }}
                >
                  <StatusIcon size={12} />
                  {status.label}
                </span>
              </div>
              <p className="text-[14px] text-gray-600 mb-1">{tramite.tramite}</p>
              <div className="flex justify-between items-center text-[12px] text-gray-400">
                <span>{tramite.fecha}</span>
                {tramite.escrituraNo && (
                  <span className="font-mono text-[#5170ff]">Esc. {tramite.escrituraNo}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
