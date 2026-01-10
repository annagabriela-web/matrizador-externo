import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard, DistributionCard, UserSummaryCard } from "@/components/dashboard/MetricCards";
import { RecentTramites } from "@/components/dashboard/RecentTramites";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ClipboardCheck, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEstadisticasMatrizador, useCupoDisponible } from "@/hooks/useMatrizadorApi";

// Fallback mock data for development
const mockTramites = [
  { id: "1", fecha: "10/01", cliente: "Juan Pérez", tramite: "Compraventa", estado: "pendiente" as const },
  { id: "2", fecha: "10/01", cliente: "María López", tramite: "Poder General", estado: "facturado" as const, escrituraNo: "12345" },
  { id: "3", fecha: "09/01", cliente: "Carlos Ruiz", tramite: "Testamento", estado: "completado" as const, escrituraNo: "12340" },
  { id: "4", fecha: "09/01", cliente: "Ana García", tramite: "Reconocimiento", estado: "completado" as const, escrituraNo: "12338" },
];

const mockDistribution = [
  { label: "Protocolización", count: 8 },
  { label: "Diligencias", count: 2 },
  { label: "Certificaciones", count: 1 },
  { label: "Otros", count: 1 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch real data from API
  const { data: stats, isLoading: statsLoading } = useEstadisticasMatrizador();
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

  // Calculate cupo status
  const porcentaje = cupo?.porcentaje_usado || 0;
  const cupoStatus = porcentaje >= 100 ? 'bloqueado' :
                     porcentaje >= 95 ? 'critico' :
                     porcentaje >= 80 ? 'alerta' : 'disponible';

  // Show loading state
  if (statsLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⟳</div>
            <p className="text-gray-500">Cargando estadísticas...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout cupoStatus={cupoStatus}>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
          <span>📊</span>
          MI PRODUCTIVIDAD
        </h1>
        <p className="text-[15px] text-gray-500 mt-1">Resumen de mis trámites y contribución</p>
      </div>

      {/* Quick Actions - Main CTA Button */}
      <div className="mb-6">
        <QuickActions />
      </div>

      {/* Metrics Grid - 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard
          icon={ClipboardCheck}
          title="Registrados hoy"
          value={stats?.registrados_hoy ?? 5}
          subtitle={stats?.registrados_hoy && stats.registrados_hoy > 0 ? "Buen ritmo" : "Sin registros aún"}
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

      {/* Main Content Grid - Distribution + User Summary side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Distribution Card - Takes 2 columns */}
        <div className="lg:col-span-2">
          <DistributionCard
            title="Distribución por Libro"
            items={distributionData}
            total={totalTramites}
          />
        </div>

        {/* User Summary Card - Takes 1 column */}
        <div>
          <UserSummaryCard
            userName={stats?.user_name || "Vicenta Alarcón"}
            tramitesCount={stats?.total_mes ?? totalTramites}
            completedPercentage={stats?.porcentaje_completados ?? 85}
            topCategory={stats?.top_categoria?.libro || distributionData[0]?.label || "N/A"}
            topCategoryCount={stats?.top_categoria?.count || distributionData[0]?.count || 0}
            monthProgress={cupo?.porcentaje_usado ?? 65}
          />
        </div>
      </div>

      {/* Recent Tramites Table */}
      <RecentTramites
        tramites={tramitesRecientes}
        onViewAll={() => navigate("/tramites")}
      />
    </AppLayout>
  );
};

export default Dashboard;
