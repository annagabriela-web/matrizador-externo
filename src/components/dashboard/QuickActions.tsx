import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link
        to="/registrar"
        className="fides-btn-primary flex-1 py-4 text-center text-lg"
      >
        <Plus size={24} strokeWidth={2.5} />
        REGISTRAR NUEVO TRÁMITE
      </Link>
    </div>
  );
}
