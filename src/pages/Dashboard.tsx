import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard, DistributionCard, UserSummaryCard } from "@/components/dashboard/MetricCards";
import { RecentTramites } from "@/components/dashboard/RecentTramites";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ClipboardCheck, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockTramites = [
  { id: "1", fecha: "10/01", cliente: "Juan Pérez", tramite: "Compraventa", estado: "pendiente" as const },
  { id: "2", fecha: "10/01", cliente: "María López", tramite: "Poder General", estado: "facturado" as const, escrituraNo: "12345" },
  { id: "3", fecha: "09/01", cliente: "Carlos Ruiz", tramite: "Testamento", estado: "completado" as const, escrituraNo: "12340" },
  { id: "4", fecha: "09/01", cliente: "Ana García", tramite: "Reconocimiento", estado: "completado" as const, escrituraNo: "12338" },
];

const distributionData = [
  { label: "Protocolización", count: 8 },
  { label: "Diligencias", count: 2 },
  { label: "Certificaciones", count: 1 },
  { label: "Otros", count: 1 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      {/* Page Title */}
      <div className="mb-6 lg:mb-8">
        <h1 className="fides-title">📊 MI PRODUCTIVIDAD</h1>
        <p className="fides-body mt-1">Resumen de mis trámites y contribución</p>
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
          value={5}
          subtitle="Buen ritmo"
          accent
        />
        <MetricCard
          icon={Clock}
          title="Pendientes"
          value={2}
          subtitle="Esperando cajera"
        />
        <MetricCard
          icon={CheckCircle}
          title="Completados hoy"
          value={3}
          subtitle="Cerrados en SIN"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
        {/* Distribution + User Summary */}
        <div className="lg:col-span-2 space-y-6">
          <DistributionCard
            title="📋 DISTRIBUCIÓN POR LIBRO"
            items={distributionData}
            total={12}
          />
        </div>

        {/* User Summary */}
        <div>
          <UserSummaryCard
            userName="Vicenta Alarcón"
            tramitesCount={12}
            completedPercentage={85}
            topCategory="PROTOCOLIZACIÓN"
            topCategoryCount={8}
            monthProgress={65}
          />
        </div>
      </div>

      {/* Recent Tramites */}
      <RecentTramites
        tramites={mockTramites}
        onViewAll={() => navigate("/tramites")}
      />
    </AppLayout>
  );
};

export default Dashboard;
