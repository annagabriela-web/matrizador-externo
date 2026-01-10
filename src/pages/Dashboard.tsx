import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard, DistributionCard, UserSummaryCard } from "@/components/dashboard/MetricCards";
import { RecentTramites } from "@/components/dashboard/RecentTramites";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ClipboardCheck, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEstadisticasMatrizador, useCupoDisponible } from "@/hooks/useMatrizadorApi";

// Fallback mock data for development
const mockTramites = [
  { id: "1", fecha: "10/01", cliente: "Juan Perez", tramite: "Compraventa", estado: "pendiente" as const },
  { id: "2", fecha: "10/01", cliente: "Maria Lopez", tramite: "Poder General", estado: "facturado" as const, escrituraNo: "12345" },
  { id: "3", fecha: "09/01", cliente: "Carlos Ruiz", tramite: "Testamento", estado: "completado" as const, escrituraNo: "12340" },
  { id: "4", fecha: "09/01", cliente: "Ana Garcia", tramite: "Reconocimiento", estado: "completado" as const, escrituraNo: "12338" },
];

const mockDistribution = [
  { label: "Protocolizacion", count: 8 },
  { label: "Diligencias", count: 2 },
  { label: "Certificaciones", count: 1 },
  { label: "Otros", count: 1 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch real data from API
  const { data: stats, isLoading: statsLoading, error: statsError } = useEstadisticasMatrizador();
  const { data: cupo } = useCupoDisponible();

  // Transform API data to component format
  const distributionData = stats?.distribucion_libros?.map(d => ({
    label: d.libro,
    count: d.count,
  })) || mockDistribution;

  const tramitesRecientes = stats?.tramites_recientes?.map(t => ({
    id: t.id,
    fecha: t.fecha || '',
    cliente: t.cliente,
    tramite: t.tramite,
    estado: t.estado as 'pendiente' | 'facturado' | 'completado' | 'reconciliado',
    escrituraNo: t.escritura_no,
  })) || mockTramites;

  const totalTramites = distributionData.reduce((sum, d) => sum + d.count, 0);

  // Show loading state
  if (statsLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⟳</div>
            <p className="text-mat-text-secondary">Cargando estadisticas...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show error state
  if (statsError) {
    return (
      <AppLayout>
        <div className="fides-card text-center py-8">
          <AlertCircle size={48} className="mx-auto text-fides-danger mb-4" />
          <h2 className="fides-subtitle mb-2">Error al cargar datos</h2>
          <p className="text-mat-text-secondary mb-4">
            No se pudieron cargar las estadisticas. Mostrando datos de ejemplo.
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
    <AppLayout cupoStatus={stats?.cupo_estado || cupo?.porcentaje_usado >= 80 ? (cupo?.porcentaje_usado >= 95 ? 'critico' : 'alerta') : 'disponible'}>
      {/* Page Title */}
      <div className="mb-6 lg:mb-8">
        <h1 className="fides-title">MI PRODUCTIVIDAD</h1>
        <p className="fides-body mt-1">Resumen de mis tramites y contribucion</p>
      </div>

      {/* Quick Actions - Mobile first, most important */}
      <div className="mb-6 lg:mb-8">
        <QuickActions />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <MetricCard
          icon={ClipboardCheck}
          title="Registrados hoy"
          value={stats?.registrados_hoy ?? 5}
          subtitle={stats?.registrados_hoy > 0 ? "Buen ritmo" : "Sin registros aun"}
          accent
        />
        <MetricCard
          icon={Clock}
          title="Pendientes"
          value={stats?.pendientes ?? 2}
          subtitle="Esperando cajera"
        />
        <MetricCard
          icon={CheckCircle}
          title="Completados hoy"
          value={stats?.completados_hoy ?? 3}
          subtitle="Cerrados en SIN"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
        {/* Distribution + User Summary */}
        <div className="lg:col-span-2 space-y-6">
          <DistributionCard
            title="DISTRIBUCION POR LIBRO"
            items={distributionData}
            total={totalTramites}
          />
        </div>

        {/* User Summary */}
        <div>
          <UserSummaryCard
            userName={stats?.user_name || "Matrizador"}
            tramitesCount={stats?.total_mes ?? totalTramites}
            completedPercentage={stats?.porcentaje_completados ?? 85}
            topCategory={stats?.top_categoria?.libro || distributionData[0]?.label || "N/A"}
            topCategoryCount={stats?.top_categoria?.count || distributionData[0]?.count || 0}
            monthProgress={cupo?.porcentaje_usado ?? 65}
          />
        </div>
      </div>

      {/* Recent Tramites */}
      <RecentTramites
        tramites={tramitesRecientes}
        onViewAll={() => navigate("/tramites")}
      />
    </AppLayout>
  );
};

export default Dashboard;
