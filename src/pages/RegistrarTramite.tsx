import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TramiteTypeSelector } from "@/components/tramites/TramiteTypeSelector";
import { User, Phone, FileText, StickyNote, ArrowLeft, Check, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegistrarTramite, useCupoDisponible } from "@/hooks/useMatrizadorApi";

interface FormData {
  tipoTramite: string;
  tramiteId?: string;
  nombreCliente: string;
  cedula: string;
  telefono: string;
  notas: string;
}

const RegistrarTramite = () => {
  const navigate = useNavigate();
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tipoTramite: "",
    nombreCliente: "",
    cedula: "",
    telefono: "",
    notas: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // API hooks
  const { mutate: registrar, isPending: isSubmitting } = useRegistrarTramite();
  const { data: cupo } = useCupoDisponible();

  // Check if registration is blocked
  const isBlocked = cupo?.puede_registrar === false;
  const showWarning = cupo && cupo.porcentaje_usado >= 80 && cupo.porcentaje_usado < 100;

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.tipoTramite) {
      newErrors.tipoTramite = "Debe seleccionar un tipo de tramite";
    }
    if (!formData.nombreCliente || formData.nombreCliente.length < 3) {
      newErrors.nombreCliente = "El nombre debe tener al menos 3 caracteres";
    }
    if (!formData.cedula || !/^\d{10,13}$/.test(formData.cedula)) {
      newErrors.cedula = "La cedula/RUC debe tener entre 10 y 13 digitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (isBlocked) {
      toast.error("Registro bloqueado", {
        description: "Se ha alcanzado el limite mensual. Contacte al notario.",
      });
      return;
    }

    registrar(
      {
        tramite: formData.tramiteId,
        concepto: formData.tipoTramite,
        nombre_cliente: formData.nombreCliente,
        cedula_cliente: formData.cedula,
        telefono: formData.telefono || undefined,
        notas: formData.notas || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Tramite registrado con exito", {
            description: `El tramite para ${formData.nombreCliente} fue registrado. La cajera sera notificada.`,
            duration: 8000,
          });
          navigate("/");
        },
        onError: (error) => {
          toast.error("Error al registrar", {
            description: error instanceof Error ? error.message : "Intente nuevamente",
          });
        },
      }
    );
  };

  const handleSelectTramite = (tramite: string, tramiteId?: string) => {
    setFormData({ ...formData, tipoTramite: tramite, tramiteId });
    setShowTypeSelector(false);
    setErrors({ ...errors, tipoTramite: undefined });
  };

  return (
    <AppLayout>
      {showTypeSelector ? (
        <TramiteTypeSelector
          onSelect={handleSelectTramite}
          onBack={() => setShowTypeSelector(false)}
          selected={formData.tipoTramite}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 lg:mb-8">
            <Link
              to="/"
              className="w-12 h-12 rounded-xl bg-fides-lavender-200 flex items-center justify-center hover:bg-fides-lavender-300 transition-colors"
            >
              <ArrowLeft size={24} className="text-fides-navy-600" />
            </Link>
            <div>
              <h1 className="fides-title">REGISTRAR NUEVO TRAMITE</h1>
              <p className="fides-body mt-1">Complete los datos del cliente</p>
            </div>
          </div>

          {/* Blocked Alert */}
          {isBlocked && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-start gap-3">
              <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">Limite mensual alcanzado</p>
                <p className="text-red-600 text-base">
                  No es posible registrar mas tramites este mes. Contacte al notario.
                </p>
              </div>
            </div>
          )}

          {/* Warning Alert */}
          {showWarning && !isBlocked && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border-2 border-amber-200 flex items-start gap-3">
              <AlertTriangle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-700">Limite proximo</p>
                <p className="text-amber-600 text-base">
                  La notaria se acerca al limite mensual ({Math.round(cupo.porcentaje_usado)}% usado).
                  Puede continuar registrando.
                </p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="fides-card max-w-2xl mx-auto">
            <div className="space-y-6">
              {/* Tipo de Tramite */}
              <div>
                <label className="fides-label flex items-center gap-2 mb-3">
                  <FileText size={20} className="text-fides-accent" />
                  Tipo de Tramite *
                </label>
                <button
                  onClick={() => setShowTypeSelector(true)}
                  disabled={isBlocked}
                  className={`w-full fides-input text-left flex items-center justify-between ${
                    errors.tipoTramite ? "fides-input-error" : ""
                  } ${formData.tipoTramite ? "fides-input-valid" : ""} ${
                    isBlocked ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className={formData.tipoTramite ? "text-mat-text-primary" : "text-mat-text-muted"}>
                    {formData.tipoTramite || "Seleccionar tipo de tramite..."}
                  </span>
                  <span className="text-fides-accent font-medium">Cambiar</span>
                </button>
                {errors.tipoTramite && (
                  <p className="text-fides-danger text-sm mt-2 flex items-center gap-1">
                    {errors.tipoTramite}
                  </p>
                )}
              </div>

              {/* Nombre del Cliente */}
              <div>
                <label className="fides-label flex items-center gap-2 mb-3">
                  <User size={20} className="text-fides-accent" />
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  value={formData.nombreCliente}
                  onChange={(e) => {
                    setFormData({ ...formData, nombreCliente: e.target.value });
                    if (errors.nombreCliente) setErrors({ ...errors, nombreCliente: undefined });
                  }}
                  placeholder="Ej: Juan Carlos Perez Mendoza"
                  disabled={isBlocked}
                  className={`fides-input ${errors.nombreCliente ? "fides-input-error" : ""} ${
                    isBlocked ? "opacity-50" : ""
                  }`}
                />
                {errors.nombreCliente && (
                  <p className="text-fides-danger text-sm mt-2 flex items-center gap-1">
                    {errors.nombreCliente}
                  </p>
                )}
              </div>

              {/* Cedula / RUC */}
              <div>
                <label className="fides-label flex items-center gap-2 mb-3">
                  <FileText size={20} className="text-fides-accent" />
                  Cedula / RUC *
                </label>
                <input
                  type="text"
                  value={formData.cedula}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, cedula: value });
                    if (errors.cedula) setErrors({ ...errors, cedula: undefined });
                  }}
                  placeholder="Ej: 1234567890"
                  maxLength={13}
                  disabled={isBlocked}
                  className={`fides-input ${errors.cedula ? "fides-input-error" : ""} ${
                    isBlocked ? "opacity-50" : ""
                  }`}
                />
                {errors.cedula && (
                  <p className="text-fides-danger text-sm mt-2 flex items-center gap-1">
                    {errors.cedula}
                  </p>
                )}
              </div>

              {/* Telefono */}
              <div>
                <label className="fides-label flex items-center gap-2 mb-3">
                  <Phone size={20} className="text-fides-accent" />
                  Telefono (opcional)
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: 0991234567"
                  disabled={isBlocked}
                  className={`fides-input ${isBlocked ? "opacity-50" : ""}`}
                />
              </div>

              {/* Notas */}
              <div>
                <label className="fides-label flex items-center gap-2 mb-3">
                  <StickyNote size={20} className="text-fides-accent" />
                  Notas (opcional)
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Ej: Cliente viene con documentos originales..."
                  rows={3}
                  maxLength={500}
                  disabled={isBlocked}
                  className={`fides-input resize-none ${isBlocked ? "opacity-50" : ""}`}
                />
                <p className="text-sm text-mat-text-muted mt-1 text-right">
                  {formData.notas.length}/500
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/"
                  className="fides-btn-secondary flex-1 py-4 text-center"
                >
                  Cancelar
                </Link>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isBlocked}
                  className="fides-btn-primary flex-1 py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Check size={24} />
                      Registrar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default RegistrarTramite;
