import { Clock, FileText, CheckCircle, CheckCircle2 } from "lucide-react";

type TramiteStatus = "pendiente" | "facturado" | "completado" | "reconciliado";

interface Tramite {
  id: string;
  fecha: string;
  cliente: string;
  tramite: string;
  estado: TramiteStatus;
  escrituraNo?: string;
}

const statusConfig: Record<TramiteStatus, { label: string; icon: typeof Clock; className: string }> = {
  pendiente: { label: "Pendiente", icon: Clock, className: "status-pendiente" },
  facturado: { label: "Facturado", icon: FileText, className: "status-facturado" },
  completado: { label: "Completado", icon: CheckCircle, className: "status-completado" },
  reconciliado: { label: "Reconciliado", icon: CheckCircle2, className: "status-reconciliado" },
};

interface RecentTramitesProps {
  tramites: Tramite[];
  onViewAll?: () => void;
}

export function RecentTramites({ tramites, onViewAll }: RecentTramitesProps) {
  return (
    <div className="fides-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="fides-subtitle flex items-center gap-2">
          <FileText size={24} className="text-fides-accent" />
          MIS TRÁMITES RECIENTES
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-fides-accent font-medium text-base hover:underline focus-ring rounded"
          >
            Ver más
          </button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-fides-lavender-300">
              <th className="text-left py-3 px-4 text-base font-semibold text-mat-text-primary">Fecha</th>
              <th className="text-left py-3 px-4 text-base font-semibold text-mat-text-primary">Cliente</th>
              <th className="text-left py-3 px-4 text-base font-semibold text-mat-text-primary">Trámite</th>
              <th className="text-left py-3 px-4 text-base font-semibold text-mat-text-primary">Estado</th>
              <th className="text-left py-3 px-4 text-base font-semibold text-mat-text-primary">Escritura</th>
            </tr>
          </thead>
          <tbody>
            {tramites.map((tramite) => {
              const status = statusConfig[tramite.estado];
              const StatusIcon = status.icon;
              return (
                <tr
                  key={tramite.id}
                  className="border-b border-fides-lavender-200 hover:bg-fides-lavender-100 transition-colors"
                >
                  <td className="py-4 px-4 text-base text-mat-text-secondary">{tramite.fecha}</td>
                  <td className="py-4 px-4 text-base font-medium text-mat-text-primary">{tramite.cliente}</td>
                  <td className="py-4 px-4 text-base text-mat-text-secondary">{tramite.tramite}</td>
                  <td className="py-4 px-4">
                    <span className={status.className}>
                      <StatusIcon size={16} />
                      {status.label}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-base font-mono text-mat-text-secondary">
                    {tramite.escrituraNo || "-"}
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
              className="p-4 bg-fides-lavender-100 rounded-xl"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-base text-mat-text-primary">{tramite.cliente}</p>
                <span className={status.className}>
                  <StatusIcon size={14} />
                  <span className="text-xs">{status.label}</span>
                </span>
              </div>
              <p className="text-base text-mat-text-secondary mb-1">{tramite.tramite}</p>
              <div className="flex justify-between items-center text-sm text-mat-text-muted">
                <span>{tramite.fecha}</span>
                {tramite.escrituraNo && (
                  <span className="font-mono">Esc. {tramite.escrituraNo}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
