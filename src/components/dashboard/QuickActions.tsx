import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <Link
      to="/registrar"
      className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-bold text-[16px] uppercase tracking-wide transition-all duration-200 hover:opacity-90"
      style={{
        background: 'linear-gradient(135deg, #5170ff 0%, #3b5bdb 100%)',
        boxShadow: '0 4px 14px rgba(81, 112, 255, 0.35)'
      }}
    >
      <Plus size={22} strokeWidth={2.5} />
      Registrar Nuevo Trámite
    </Link>
  );
}
