import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Search, Filter, Clock, FileText, CheckCircle, CheckCircle2, Eye, Copy } from "lucide-react";
import { toast } from "sonner";

type TramiteStatus = "pendiente" | "facturado" | "completado" | "reconciliado";

interface Tramite {
  id: string;
  fecha: string;
  cliente: string;
  cedula: string;
  tramite: string;
  estado: TramiteStatus;
  escrituraNo?: string;
}

const mockTramites: Tramite[] = [
  { id: "1", fecha: "10/01/2026", cliente: "Juan Pérez", cedula: "1234567890", tramite: "Compraventa", estado: "pendiente" },
  { id: "2", fecha: "10/01/2026", cliente: "María López", cedula: "0987654321", tramite: "Poder General", estado: "facturado", escrituraNo: "12345" },
  { id: "3", fecha: "09/01/2026", cliente: "Carlos Ruiz", cedula: "1122334455", tramite: "Testamento", estado: "completado", escrituraNo: "12340" },
  { id: "4", fecha: "09/01/2026", cliente: "Ana García", cedula: "5544332211", tramite: "Reconocimiento de Firmas", estado: "completado", escrituraNo: "12338" },
  { id: "5", fecha: "08/01/2026", cliente: "Pedro Sánchez", cedula: "6677889900", tramite: "Declaración Juramentada", estado: "reconciliado", escrituraNo: "12335" },
  { id: "6", fecha: "08/01/2026", cliente: "Laura Martínez", cedula: "9988776655", tramite: "Posesión Efectiva", estado: "pendiente" },
  { id: "7", fecha: "07/01/2026", cliente: "Roberto Gómez", cedula: "1231231234", tramite: "Donación", estado: "facturado", escrituraNo: "12330" },
];

const statusConfig: Record<TramiteStatus, { label: string; icon: typeof Clock; className: string }> = {
  pendiente: { label: "Pendiente", icon: Clock, className: "status-pendiente" },
  facturado: { label: "Facturado", icon: FileText, className: "status-facturado" },
  completado: { label: "Completado", icon: CheckCircle, className: "status-completado" },
  reconciliado: { label: "Reconciliado", icon: CheckCircle2, className: "status-reconciliado" },
};

const MisTramites = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TramiteStatus | "todos">("todos");
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);

  const filteredTramites = mockTramites.filter((t) => {
    const matchesSearch =
      t.cliente.toLowerCase().includes(search.toLowerCase()) ||
      t.tramite.toLowerCase().includes(search.toLowerCase()) ||
      t.cedula.includes(search);
    const matchesStatus = statusFilter === "todos" || t.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const copyEscritura = (num: string) => {
    navigator.clipboard.writeText(num);
    toast.success("Número copiado", {
      description: `Escritura No. ${num} copiada al portapapeles`,
      duration: 3000,
    });
  };

  return (
    <AppLayout>
      <div className="mb-6 lg:mb-8">
        <h1 className="fides-title">📋 MIS TRÁMITES</h1>
        <p className="fides-body mt-1">Lista de trámites registrados</p>
      </div>

      {/* Filters */}
      <div className="fides-card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente, trámite o cédula..."
              className="fides-input pl-12"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-mat-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TramiteStatus | "todos")}
              className="fides-input w-auto min-w-[180px]"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="facturado">Facturado</option>
              <option value="completado">Completado</option>
              <option value="reconciliado">Reconciliado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-base text-mat-text-muted mb-4">
        Mostrando {filteredTramites.length} de {mockTramites.length} trámites
      </p>

      {/* Desktop Table */}
      <div className="hidden lg:block fides-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-fides-lavender-300">
              <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Fecha</th>
              <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Cliente</th>
              <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Trámite</th>
              <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Estado</th>
              <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Escritura</th>
              <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTramites.map((tramite) => {
              const status = statusConfig[tramite.estado];
              const StatusIcon = status.icon;
              return (
                <tr
                  key={tramite.id}
                  className="border-b border-fides-lavender-200 hover:bg-fides-lavender-100 transition-colors"
                >
                  <td className="py-4 px-4 text-base text-mat-text-secondary">{tramite.fecha}</td>
                  <td className="py-4 px-4">
                    <p className="text-base font-medium text-mat-text-primary">{tramite.cliente}</p>
                    <p className="text-sm text-mat-text-muted">{tramite.cedula}</p>
                  </td>
                  <td className="py-4 px-4 text-base text-mat-text-secondary">{tramite.tramite}</td>
                  <td className="py-4 px-4">
                    <span className={status.className}>
                      <StatusIcon size={16} />
                      {status.label}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {tramite.escrituraNo ? (
                      <button
                        onClick={() => copyEscritura(tramite.escrituraNo!)}
                        className="flex items-center gap-2 text-base font-mono text-fides-accent hover:underline"
                      >
                        {tramite.escrituraNo}
                        <Copy size={16} />
                      </button>
                    ) : (
                      <span className="text-mat-text-muted">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => setSelectedTramite(tramite)}
                      className="fides-btn-ghost text-sm py-2 px-3"
                    >
                      <Eye size={18} />
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filteredTramites.map((tramite) => {
          const status = statusConfig[tramite.estado];
          const StatusIcon = status.icon;
          return (
            <div
              key={tramite.id}
              className="fides-card"
              onClick={() => setSelectedTramite(tramite)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-lg text-mat-text-primary">{tramite.cliente}</p>
                  <p className="text-sm text-mat-text-muted">{tramite.cedula}</p>
                </div>
                <span className={status.className}>
                  <StatusIcon size={14} />
                  <span className="text-xs">{status.label}</span>
                </span>
              </div>
              <p className="text-base text-mat-text-secondary mb-2">{tramite.tramite}</p>
              <div className="flex justify-between items-center text-sm text-mat-text-muted">
                <span>{tramite.fecha}</span>
                {tramite.escrituraNo && (
                  <span className="font-mono text-fides-accent">Esc. {tramite.escrituraNo}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedTramite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="fides-card w-full max-w-lg animate-fade-in">
            <h2 className="fides-subtitle mb-6">DETALLE DEL TRÁMITE</h2>

            {/* Timeline */}
            <div className="mb-6">
              <p className="text-sm font-medium text-mat-text-muted mb-3">PROGRESO:</p>
              <div className="flex items-center gap-2 mb-2">
                {["pendiente", "facturado", "completado", "reconciliado"].map((step, idx) => {
                  const stepStatus = ["pendiente", "facturado", "completado", "reconciliado"];
                  const currentIdx = stepStatus.indexOf(selectedTramite.estado);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          isCompleted ? "bg-fides-success" : "bg-fides-lavender-300"
                        } ${isCurrent ? "ring-2 ring-fides-success ring-offset-2" : ""}`}
                      />
                      {idx < 3 && (
                        <div
                          className={`flex-1 h-1 ${
                            idx < currentIdx ? "bg-fides-success" : "bg-fides-lavender-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-mat-text-muted">
                <span>Pendiente</span>
                <span>Facturado</span>
                <span>Completado</span>
                <span>Reconciliado</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b border-fides-lavender-200">
                <span className="text-mat-text-muted">Cliente</span>
                <span className="font-medium text-mat-text-primary">{selectedTramite.cliente}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-fides-lavender-200">
                <span className="text-mat-text-muted">Cédula</span>
                <span className="font-medium text-mat-text-primary">{selectedTramite.cedula}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-fides-lavender-200">
                <span className="text-mat-text-muted">Trámite</span>
                <span className="font-medium text-mat-text-primary">{selectedTramite.tramite}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-fides-lavender-200">
                <span className="text-mat-text-muted">Fecha</span>
                <span className="font-medium text-mat-text-primary">{selectedTramite.fecha}</span>
              </div>
              {selectedTramite.escrituraNo && (
                <div className="flex justify-between py-2 border-b border-fides-lavender-200">
                  <span className="text-mat-text-muted">Escritura No.</span>
                  <button
                    onClick={() => copyEscritura(selectedTramite.escrituraNo!)}
                    className="flex items-center gap-2 font-mono text-fides-accent hover:underline"
                  >
                    {selectedTramite.escrituraNo}
                    <Copy size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <button
              onClick={() => setSelectedTramite(null)}
              className="fides-btn-primary w-full py-4"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default MisTramites;
