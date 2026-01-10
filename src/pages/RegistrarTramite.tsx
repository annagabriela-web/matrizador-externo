import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TramiteTypeSelector } from "@/components/tramites/TramiteTypeSelector";
import { User, Phone, FileText, StickyNote, ArrowLeft, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FormData {
  tipoTramite: string;
  nombreCliente: string;
  cedula: string;
  telefono: string;
  notas: string;
}

const RegistrarTramite = () => {
  const navigate = useNavigate();
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tipoTramite: "",
    nombreCliente: "",
    cedula: "",
    telefono: "",
    notas: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.tipoTramite) {
      newErrors.tipoTramite = "Debe seleccionar un tipo de trámite";
    }
    if (!formData.nombreCliente || formData.nombreCliente.length < 3) {
      newErrors.nombreCliente = "El nombre debe tener al menos 3 caracteres";
    }
    if (!formData.cedula || !/^\d{10,13}$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula/RUC debe tener entre 10 y 13 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    
    toast.success("Trámite registrado con éxito", {
      description: `El trámite para ${formData.nombreCliente} fue registrado. La cajera será notificada.`,
      duration: 8000,
    });
    
    navigate("/");
  };

  const handleSelectTramite = (tramite: string) => {
    setFormData({ ...formData, tipoTramite: tramite });
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
              <h1 className="fides-title">REGISTRAR NUEVO TRÁMITE</h1>
              <p className="fides-body mt-1">Complete los datos del cliente</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="fides-card max-w-2xl mx-auto">
            <div className="space-y-6">
              {/* Tipo de Trámite */}
              <div>
                <label className="fides-label flex items-center gap-2 mb-3">
                  <FileText size={20} className="text-fides-accent" />
                  Tipo de Trámite *
                </label>
                <button
                  onClick={() => setShowTypeSelector(true)}
                  className={`w-full fides-input text-left flex items-center justify-between ${
                    errors.tipoTramite ? "fides-input-error" : ""
                  } ${formData.tipoTramite ? "fides-input-valid" : ""}`}
                >
                  <span className={formData.tipoTramite ? "text-mat-text-primary" : "text-mat-text-muted"}>
                    {formData.tipoTramite || "Seleccionar tipo de trámite..."}
                  </span>
                  <span className="text-fides-accent font-medium">Cambiar</span>
                </button>
                {errors.tipoTramite && (
                  <p className="text-fides-danger text-sm mt-2 flex items-center gap-1">
                    ⚠️ {errors.tipoTramite}
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
                  placeholder="Ej: Juan Carlos Pérez Mendoza"
                  className={`fides-input ${errors.nombreCliente ? "fides-input-error" : ""}`}
                />
                {errors.nombreCliente && (
                  <p className="text-fides-danger text-sm mt-2 flex items-center gap-1">
                    ⚠️ {errors.nombreCliente}
                  </p>
                )}
              </div>

              {/* Cédula / RUC */}
              <div>
                <label className="fides-label flex items-center gap-2 mb-3">
                  <FileText size={20} className="text-fides-accent" />
                  Cédula / RUC *
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
                  className={`fides-input ${errors.cedula ? "fides-input-error" : ""}`}
                />
                {errors.cedula && (
                  <p className="text-fides-danger text-sm mt-2 flex items-center gap-1">
                    ⚠️ {errors.cedula}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="fides-label flex items-center gap-2 mb-3">
                  <Phone size={20} className="text-fides-accent" />
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: 0991234567"
                  className="fides-input"
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
                  className="fides-input resize-none"
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
                  disabled={isSubmitting}
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
