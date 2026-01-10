import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

type CupoStatus = "disponible" | "alerta" | "critico" | "bloqueado";

interface AppLayoutProps {
  children: ReactNode;
  cupoStatus?: CupoStatus;
}

export function AppLayout({ children, cupoStatus = "disponible" }: AppLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f3ff' }}>
      <AppSidebar />

      {/* Main Content */}
      <div className="lg:ml-[220px] min-h-screen flex flex-col">
        <AppHeader cupoStatus={cupoStatus} />

        <main className="flex-1 p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
