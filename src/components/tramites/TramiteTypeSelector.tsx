import { useState, useMemo } from "react";
import { ArrowLeft, Search, Star, Scroll, FileText, PenTool, Home, ClipboardList, Check } from "lucide-react";

// Catálogo 2025 data structure
const catalogoData = {
  "Protocolización": {
    icon: Scroll,
    count: 61,
    items: [
      "Compraventa",
      "Declaración Juramentada Persona Natural",
      "Declaración Juramentada Persona Jurídica",
      "Poder Especial Persona Natural",
      "Poder General Persona Natural",
      "Autorización de Salida del País",
      "Cancelación de Hipoteca",
      "Unión de Hecho",
      "Posesión Efectiva",
      "Divorcio por Mutuo Consentimiento",
      "Testamento Abierto Adulto Mayor",
      "Donación",
      "Resciliación",
      "Promesa de Celebrar Contratos",
      "Cesión de Derechos",
      "Constitución de Hipoteca",
    ],
  },
  "Otros": {
    icon: ClipboardList,
    count: 8,
    items: [
      "Razones en Testimonios o Copias Certificadas",
      "Otorgamiento Copias de Archivo",
      "Concuerdo o Razón de Copias de Archivo",
      "Testimonios Solicitados por Fiscalía",
      "Marginaciones a la Matriz",
    ],
  },
  "Certificaciones": {
    icon: FileText,
    count: 4,
    items: [
      "Certificación de Documentos Exhibidos en Original",
      "Certificación de Documentos Exhibidos en Copias Certificadas",
      "Certificación de Documentos Materializados desde Página Web",
      "Certificación de Planos Exhibidos en Original",
    ],
  },
  "Diligencias": {
    icon: PenTool,
    count: 4,
    items: [
      "Reconocimiento de Firmas",
      "Reconocimiento de Firmas de Vehículo",
      "Reconocimiento de Firma de Traductor",
      "Certificación Documentos Exhibidos (D)",
    ],
  },
  "Arrendamientos": {
    icon: Home,
    count: 1,
    items: [
      "Inscripción de Contratos de Arrendamiento",
    ],
  },
};

const favoritos = [
  "Reconocimiento de Firmas",
  "Poder Especial Persona Natural",
  "Compraventa",
  "Declaración Juramentada Persona Natural",
];

type CategoryKey = keyof typeof catalogoData;

interface TramiteTypeSelectorProps {
  onSelect: (tramite: string) => void;
  onBack: () => void;
  selected?: string;
}

export function TramiteTypeSelector({ onSelect, onBack, selected }: TramiteTypeSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [tempSelected, setTempSelected] = useState(selected || "");

  // Filtered results based on search
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    
    const results: { category: CategoryKey; item: string }[] = [];
    Object.entries(catalogoData).forEach(([category, data]) => {
      data.items.forEach((item) => {
        if (item.toLowerCase().includes(search.toLowerCase())) {
          results.push({ category: category as CategoryKey, item });
        }
      });
    });
    return results;
  }, [search]);

  const handleConfirm = () => {
    if (tempSelected) {
      onSelect(tempSelected);
    }
  };

  // Category detail view
  if (selectedCategory) {
    const category = catalogoData[selectedCategory];
    const CategoryIcon = category.icon;

    return (
      <div className="fides-card max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-fides-lavender-300">
          <button
            onClick={() => setSelectedCategory(null)}
            className="w-12 h-12 rounded-xl bg-fides-lavender-200 flex items-center justify-center hover:bg-fides-lavender-300 transition-colors"
          >
            <ArrowLeft size={24} className="text-fides-navy-600" />
          </button>
          <div className="flex items-center gap-3">
            <CategoryIcon size={28} className="text-fides-accent" />
            <h2 className="fides-subtitle">{selectedCategory}</h2>
          </div>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto mb-6">
          {category.items.map((item) => (
            <button
              key={item}
              onClick={() => setTempSelected(item)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                tempSelected === item
                  ? "bg-fides-accent text-white"
                  : "bg-fides-lavender-100 hover:bg-fides-lavender-200 text-mat-text-primary"
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                tempSelected === item ? "border-white bg-white" : "border-fides-lavender-300"
              }`}>
                {tempSelected === item && <Check size={14} className="text-fides-accent" />}
              </div>
              <span className="text-base font-medium">{item}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="fides-btn-secondary flex-1 py-4"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!tempSelected}
            className="fides-btn-primary flex-1 py-4 disabled:opacity-50"
          >
            Seleccionar
          </button>
        </div>
      </div>
    );
  }

  // Main category view
  return (
    <div className="fides-card max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-fides-lavender-300">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-xl bg-fides-lavender-200 flex items-center justify-center hover:bg-fides-lavender-300 transition-colors"
        >
          <ArrowLeft size={24} className="text-fides-navy-600" />
        </button>
        <h2 className="fides-subtitle">Tipo de Trámite</h2>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar trámite..."
          className="fides-input pl-12"
        />
      </div>

      {/* Search Results */}
      {search && searchResults.length > 0 && (
        <div className="mb-6">
          <h3 className="fides-label mb-3">Resultados de búsqueda</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {searchResults.slice(0, 10).map(({ item }) => (
              <button
                key={item}
                onClick={() => onSelect(item)}
                className="w-full p-4 bg-fides-lavender-100 rounded-xl text-left hover:bg-fides-lavender-200 transition-colors"
              >
                <span className="text-base font-medium text-mat-text-primary">{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {!search && (
        <>
          <div className="mb-6">
            <h3 className="fides-label flex items-center gap-2 mb-3 text-mat-text-muted">
              📁 CATEGORÍAS (Catálogo 2025)
            </h3>
            <div className="space-y-2">
              {Object.entries(catalogoData).map(([name, data]) => {
                const CategoryIcon = data.icon;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedCategory(name as CategoryKey)}
                    className="w-full flex items-center gap-4 p-4 bg-fides-lavender-100 rounded-xl hover:bg-fides-lavender-200 transition-colors text-left"
                  >
                    <CategoryIcon size={24} className="text-fides-accent" />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-mat-text-primary">{name}</p>
                    </div>
                    <span className="text-sm font-medium text-mat-text-muted">
                      {data.count} trámites
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorites */}
          <div>
            <h3 className="fides-label flex items-center gap-2 mb-3 text-mat-text-muted">
              <Star size={18} className="text-amber-500" />
              FAVORITOS / RECIENTES
            </h3>
            <div className="space-y-2">
              {favoritos.map((item) => (
                <button
                  key={item}
                  onClick={() => onSelect(item)}
                  className="w-full p-4 bg-fides-lavender-100 rounded-xl text-left hover:bg-fides-lavender-200 transition-colors"
                >
                  <span className="text-base font-medium text-mat-text-primary">• {item}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
