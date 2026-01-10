import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
}

export function MetricCard({ icon: Icon, title, value, subtitle, accent = false }: MetricCardProps) {
  return (
    <div className={accent ? "fides-card-metric" : "fides-card"}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-base font-medium text-mat-text-muted mb-1">{title}</p>
          <p className="text-3xl font-bold text-mat-text-primary">{value}</p>
          {subtitle && (
            <p className="text-sm text-mat-text-muted mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-fides-lavender-200 flex items-center justify-center">
          <Icon size={24} className="text-fides-navy-600" />
        </div>
      </div>
    </div>
  );
}

interface DistributionItem {
  label: string;
  count: number;
  color?: string;
}

interface DistributionCardProps {
  title: string;
  items: DistributionItem[];
  total: number;
}

export function DistributionCard({ title, items, total }: DistributionCardProps) {
  return (
    <div className="fides-card">
      <h3 className="fides-subtitle mb-6">{title}</h3>
      <div className="space-y-4">
        {items.map((item) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          return (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-medium text-mat-text-primary">{item.label}</span>
                <span className="text-base font-semibold text-mat-text-secondary">
                  {item.count} trámite{item.count !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="h-3 bg-fides-lavender-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fides-accent to-fides-accent-light rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(percentage, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface UserSummaryCardProps {
  userName: string;
  tramitesCount: number;
  completedPercentage: number;
  topCategory: string;
  topCategoryCount: number;
  monthProgress: number;
}

export function UserSummaryCard({
  userName,
  tramitesCount,
  completedPercentage,
  topCategory,
  topCategoryCount,
  monthProgress,
}: UserSummaryCardProps) {
  const progressColor = 
    monthProgress < 80 ? "bg-mat-cupo-disponible" : 
    monthProgress < 95 ? "bg-mat-cupo-alerta" : "bg-mat-cupo-critico";

  return (
    <div className="fides-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-fides-accent flex items-center justify-center">
          <span className="text-white font-bold text-lg">{userName.charAt(0)}</span>
        </div>
        <div>
          <p className="font-semibold text-lg text-mat-text-primary">{userName}</p>
          <span className="cupo-disponible text-xs">● Activa</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-fides-lavender-100 rounded-xl">
          <p className="text-3xl font-bold text-mat-text-primary">{tramitesCount}</p>
          <p className="text-sm text-mat-text-muted mt-1">TRÁMITES</p>
        </div>
        <div className="text-center p-4 bg-fides-lavender-100 rounded-xl">
          <p className="text-3xl font-bold text-mat-text-primary">{completedPercentage}%</p>
          <p className="text-sm text-mat-text-muted mt-1">COMPLETADOS</p>
        </div>
      </div>

      <p className="text-base text-mat-text-secondary mb-6">
        Top: <span className="font-semibold">{topCategory}</span> ({topCategoryCount})
      </p>

      <div className="pt-4 border-t border-fides-lavender-300">
        <div className="flex justify-between items-center mb-2">
          <span className="text-base font-medium text-mat-text-primary">AVANCE DEL MES</span>
          <span className={`w-3 h-3 rounded-full ${progressColor}`} />
        </div>
        <div className="h-4 bg-fides-lavender-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor} rounded-full transition-all duration-500`}
            style={{ width: `${monthProgress}%` }}
          />
        </div>
        <p className="text-sm text-mat-text-muted mt-2">
          Tu contribución: {tramitesCount} trámites
        </p>
      </div>
    </div>
  );
}
