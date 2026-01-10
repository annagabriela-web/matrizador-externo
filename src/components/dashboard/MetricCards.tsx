import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
}

export function MetricCard({ icon: Icon, title, value, subtitle, accent = false }: MetricCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-5 border border-gray-100"
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        borderTop: accent ? '3px solid #8b5cf6' : undefined
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[13px] font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-[13px] text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <Icon size={22} className="text-gray-400" />
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
    <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <h3 className="flex items-center gap-2 text-[15px] font-bold text-gray-800 mb-5 uppercase tracking-wide">
        <span className="text-lg">📋</span>
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, index) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          // Different shades of blue for each bar
          const colors = ['#5170ff', '#7c8dff', '#a3b0ff', '#c4cbff'];
          const barColor = colors[index % colors.length];

          return (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[14px] font-medium text-gray-700">{item.label}</span>
                <span className="text-[14px] font-semibold text-gray-500">
                  {item.count} trámite{item.count !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(percentage, 3)}%`,
                    backgroundColor: barColor
                  }}
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
  // Progress bar color based on percentage
  const progressColor = monthProgress < 80 ? '#10b981' : monthProgress < 95 ? '#f59e0b' : '#ef4444';

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      {/* User header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: '#8b5cf6' }}
        >
          {userName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-[15px] text-gray-800">{userName}</p>
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#d1fae5', color: '#059669' }}
          >
            <span style={{ fontSize: '8px' }}>●</span> Activa
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center py-4 px-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-3xl font-bold text-gray-800">{tramitesCount}</p>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-1">Trámites</p>
        </div>
        <div className="text-center py-4 px-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-3xl font-bold text-gray-800">{completedPercentage}%</p>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-1">Completados</p>
        </div>
      </div>

      {/* Top category */}
      <p className="text-[13px] text-gray-600 mb-4">
        Top: <span className="font-semibold text-gray-800 uppercase">{topCategory}</span>
        <span className="text-gray-500"> ({topCategoryCount})</span>
      </p>

      {/* Progress section */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[12px] font-semibold text-gray-700 uppercase tracking-wide">Avance del Mes</span>
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: progressColor }}
          />
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${monthProgress}%`,
              backgroundColor: progressColor
            }}
          />
        </div>
        <p className="text-[12px] text-gray-500">
          Tu contribución: {tramitesCount} trámites
        </p>
      </div>
    </div>
  );
}
