import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Search, Filter, Clock, FileText, CheckCircle, CheckCircle2, Eye, Copy, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useMisTramites } from "@/hooks/useMatrizadorApi";

type TramiteStatus = "pendiente" | "facturado" | "completado" | "reconciliado" | "cancelado";

interface Tramite {
  id: string;
  fecha: string;
  cliente: string;
  cedula?: string;
  tramite: string;
  estado: TramiteStatus;
  escrituraNo?: string;
}

// Fallback mock data
const mockTramites: Tramite[] = [
  { id: "1", fecha: "10/01/2026", cliente: "Juan Perez", cedula: "1234567890", tramite: "Compraventa", estado: "pendiente" },
  { id: "2", fecha: "10/01/2026", cliente: "Maria Lopez", cedula: "0987654321", tramite: "Poder General", estado: "facturado", escrituraNo: "12345" },
  { id: "3", fecha: "09/01/2026", cliente: "Carlos Ruiz", cedula: "1122334455", tramite: "Testamento", estado: "completado", escrituraNo: "12340" },
];

const statusConfig: Record<TramiteStatus, { label: string; icon: typeof Clock; className: string }> = {
  pendiente: { label: "Pendiente", icon: Clock, className: "status-pendiente" },
  facturado: { label: "Facturado", icon: FileText, className: "status-facturado" },
  completado: { label: "Completado", icon: CheckCircle, className: "status-completado" },
  reconciliado: { label: "Reconciliado", icon: CheckCircle2, className: "status-reconciliado" },
  cancelado: { label: "Cancelado", icon: XCircle, className: "bg-gray-100 text-gray-600" },
};

const MisTramites = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TramiteStatus | "todos">("todos");
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);

  // Fetch data from API
  const { data: apiTramites, isLoading, error } = useMisTramites();

  // Transform API data to component format
  const tramites: Tramite[] = useMemo(() => {
    if (!apiTramites) return mockTramites;

    return apiTramites.map((t) => ({
      id: t.id,
      fecha: t.fecha,
      cliente: t.cliente,
      cedula: undefined, // API might not return this
      tramite: t.tramite,
      estado: t.estado as TramiteStatus,
      escrituraNo: t.escritura_no,
    }));
  }, [apiTramites]);

  const filteredTramites = useMemo(() => {
    return tramites.filter((t) => {
      const matchesSearch =
        t.cliente.toLowerCase().includes(search.toLowerCase()) ||
        t.tramite.toLowerCase().includes(search.toLowerCase()) ||
        (t.cedula && t.cedula.includes(search));
      const matchesStatus = statusFilter === "todos" || t.estado === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tramites, search, statusFilter]);

  const copyEscritura = (num: string) => {
    navigator.clipboard.writeText(num);
    toast.success("Numero copiado", {
      description: `Escritura No. ${num} copiada al portapapeles`,
      duration: 3000,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⟳</div>
            <p className="text-mat-text-secondary">Cargando tramites...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className="fides-card text-center py-8">
          <AlertCircle size={48} className="mx-auto text-fides-danger mb-4" />
          <h2 className="fides-subtitle mb-2">Error al cargar tramites</h2>
          <p className="text-mat-text-secondary mb-4">
            No se pudieron cargar los tramites. Mostrando datos de ejemplo.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="fides-btn-secondary"
          >
            Reintentar
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6 lg:mb-8">
        <h1 className="fides-title">MIS TRAMITES</h1>
        <p className="fides-body mt-1">Lista de tramites registrados</p>
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
              placeholder="Buscar por cliente o tramite..."
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
        Mostrando {filteredTramites.length} de {tramites.length} tramites
      </p>

      {/* Empty state */}
      {filteredTramites.length === 0 && (
        <div className="fides-card text-center py-12">
          <FileText size={48} className="mx-auto text-mat-text-muted mb-4" />
          <h3 className="fides-subtitle mb-2">No hay tramites</h3>
          <p className="text-mat-text-secondary">
            {search || statusFilter !== "todos"
              ? "No se encontraron tramites con los filtros aplicados."
              : "Aun no has registrado ningun tramite."}
          </p>
        </div>
      )}

      {/* Desktop Table */}
      {filteredTramites.length > 0 && (
        <div className="hidden lg:block fides-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-fides-lavender-300">
                <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Fecha</th>
                <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Cliente</th>
                <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Tramite</th>
                <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Estado</th>
                <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Escritura</th>
                <th className="text-left py-4 px-4 text-base font-semibold text-mat-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTramites.map((tramite) => {
                const status = statusConfig[tramite.estado] || statusConfig.pendiente;
                const StatusIcon = status.icon;
                return (
                  <tr
                    key={tramite.id}
                    className="border-b border-fides-lavender-200 hover:bg-fides-lavender-100 transition-colors"
                  >
                    <td className="py-4 px-4 text-base text-mat-text-secondary">{tramite.fecha}</td>
                    <td className="py-4 px-4">
                      <p className="text-base font-medium text-mat-text-primary">{tramite.cliente}</p>
                      {tramite.cedula && (
                        <p className="text-sm text-mat-text-muted">{tramite.cedula}</p>
                      )}
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
      )}

      {/* Mobile Cards */}
      {filteredTramites.length > 0 && (
        <div className="lg:hidden space-y-4">
          {filteredTramites.map((tramite) => {
            const status = statusConfig[tramite.estado] || statusConfig.pendiente;
            const StatusIcon = status.icon;
            return (
              <div
                key={tramite.id}
                className="fides-card cursor-pointer"
                onClick={() => setSelectedTramite(tramite)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-lg text-mat-text-primary">{tramite.cliente}</p>
                    {tramite.cedula && (
                      <p className="text-sm text-mat-text-muted">{tramite.cedula}</p>
                    )}
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
      )}

      {/* Detail Modal */}
      {selectedTramite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="fides-card w-full max-w-lg animate-fade-in">
            <h2 className="fides-subtitle mb-6">DETALLE DEL TRAMITE</h2>

            {/* Timeline */}
            <div className="mb-6">
              <p className="text-sm font-medium text-mat-text-muted mb-3">PROGRESO:</p>
              <div className="flex items-center gap-2 mb-2">
                {["pendiente", "facturado", "completado", "reconciliado"].map((step, idx) => {
                  const stepStatus = ["pendiente", "facturado", "completado", "reconciliado"];
                  const currentIdx = stepStatus.indexOf(selectedTramite.estado);
                  const isCompleted = idx <= currentIdx && selectedTramite.estado !== "cancelado";
                  const isCurrent = idx === currentIdx && selectedTramite.estado !== "cancelado";

                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          selectedTramite.estado === "cancelado"
                            ? "bg-gray-300"
                            : isCompleted
                            ? "bg-fides-success"
                            : "bg-fides-lavender-300"
                        } ${isCurrent ? "ring-2 ring-fides-success ring-offset-2" : ""}`}
                      />
                      {idx < 3 && (
                        <div
                          className={`flex-1 h-1 ${
                            selectedTramite.estado === "cancelado"
                              ? "bg-gray-300"
                              : idx < currentIdx
                              ? "bg-fides-success"
                              : "bg-fides-lavender-300"
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

            {/* Cancelled banner */}
            {selectedTramite.estado === "cancelado" && (
              <div className="mb-6 p-3 rounded-lg bg-gray-100 text-gray-600 text-center">
                Este tramite fue cancelado
              </div>
            )}

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b border-fides-lavender-200">
                <span className="text-mat-text-muted">Cliente</span>
                <span className="font-medium text-mat-text-primary">{selectedTramite.cliente}</span>
              </div>
              {selectedTramite.cedula && (
                <div className="flex justify-between py-2 border-b border-fides-lavender-200">
                  <span className="text-mat-text-muted">Cedula</span>
                  <span className="font-medium text-mat-text-primary">{selectedTramite.cedula}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-fides-lavender-200">
                <span className="text-mat-text-muted">Tramite</span>
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
