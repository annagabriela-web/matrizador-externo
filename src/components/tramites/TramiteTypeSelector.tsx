import { useState, useMemo } from "react";
import { ArrowLeft, Search, Star, Scroll, FileText, PenTool, Home, ClipboardList, Check, Loader2 } from "lucide-react";
import { useTramitePopupData, useRegistrarUso } from "@/hooks/useMatrizadorApi";

// Fallback catalogo data (used when API is unavailable)
const catalogoData = {
  "Protocolizacion": {
    icon: Scroll,
    count: 61,
    items: [
      { id: undefined, nombre: "Compraventa" },
      { id: undefined, nombre: "Declaracion Juramentada Persona Natural" },
      { id: undefined, nombre: "Declaracion Juramentada Persona Juridica" },
      { id: undefined, nombre: "Poder Especial Persona Natural" },
      { id: undefined, nombre: "Poder General Persona Natural" },
      { id: undefined, nombre: "Autorizacion de Salida del Pais" },
      { id: undefined, nombre: "Cancelacion de Hipoteca" },
      { id: undefined, nombre: "Union de Hecho" },
      { id: undefined, nombre: "Posesion Efectiva" },
      { id: undefined, nombre: "Divorcio por Mutuo Consentimiento" },
      { id: undefined, nombre: "Testamento Abierto Adulto Mayor" },
      { id: undefined, nombre: "Donacion" },
      { id: undefined, nombre: "Resciliacion" },
      { id: undefined, nombre: "Promesa de Celebrar Contratos" },
      { id: undefined, nombre: "Cesion de Derechos" },
      { id: undefined, nombre: "Constitucion de Hipoteca" },
    ],
  },
  "Otros": {
    icon: ClipboardList,
    count: 8,
    items: [
      { id: undefined, nombre: "Razones en Testimonios o Copias Certificadas" },
      { id: undefined, nombre: "Otorgamiento Copias de Archivo" },
      { id: undefined, nombre: "Concuerdo o Razon de Copias de Archivo" },
      { id: undefined, nombre: "Testimonios Solicitados por Fiscalia" },
      { id: undefined, nombre: "Marginaciones a la Matriz" },
    ],
  },
  "Certificaciones": {
    icon: FileText,
    count: 4,
    items: [
      { id: undefined, nombre: "Certificacion de Documentos Exhibidos en Original" },
      { id: undefined, nombre: "Certificacion de Documentos Exhibidos en Copias Certificadas" },
      { id: undefined, nombre: "Certificacion de Documentos Materializados desde Pagina Web" },
      { id: undefined, nombre: "Certificacion de Planos Exhibidos en Original" },
    ],
  },
  "Diligencias": {
    icon: PenTool,
    count: 4,
    items: [
      { id: undefined, nombre: "Reconocimiento de Firmas" },
      { id: undefined, nombre: "Reconocimiento de Firmas de Vehiculo" },
      { id: undefined, nombre: "Reconocimiento de Firma de Traductor" },
      { id: undefined, nombre: "Certificacion Documentos Exhibidos (D)" },
    ],
  },
  "Arrendamientos": {
    icon: Home,
    count: 1,
    items: [
      { id: undefined, nombre: "Inscripcion de Contratos de Arrendamiento" },
    ],
  },
};

type CategoryKey = keyof typeof catalogoData;

interface TramiteItem {
  id?: string;
  nombre: string;
}

interface TramiteTypeSelectorProps {
  onSelect: (tramite: string, tramiteId?: string) => void;
  onBack: () => void;
  selected?: string;
}

export function TramiteTypeSelector({ onSelect, onBack, selected }: TramiteTypeSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [tempSelected, setTempSelected] = useState<TramiteItem | null>(
    selected ? { nombre: selected } : null
  );

  // Fetch from API
  const { data: popupData, isLoading } = useTramitePopupData(search.length >= 2 ? search : undefined);
  const { mutate: registrarUso } = useRegistrarUso();

  // Get favorites from API or use fallback
  const favoritos: TramiteItem[] = useMemo(() => {
    if (popupData?.favoritos) {
      return popupData.favoritos.map((f) => ({ id: f.id, nombre: f.nombre }));
    }
    if (popupData?.recientes) {
      return popupData.recientes.map((r) => ({ id: r.id, nombre: r.nombre }));
    }
    return [
      { nombre: "Reconocimiento de Firmas" },
      { nombre: "Poder Especial Persona Natural" },
      { nombre: "Compraventa" },
      { nombre: "Declaracion Juramentada Persona Natural" },
    ];
  }, [popupData]);

  // Search results from API or local filter
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];

    // If API returned search results
    if (popupData?.resultados) {
      return popupData.resultados.map((r) => ({
        id: r.id,
        nombre: r.nombre,
        categoria: r.categoria?.nombre,
      }));
    }

    // Local fallback search
    const results: { id?: string; nombre: string; categoria: string }[] = [];
    Object.entries(catalogoData).forEach(([category, data]) => {
      data.items.forEach((item) => {
        if (item.nombre.toLowerCase().includes(search.toLowerCase())) {
          results.push({ id: item.id, nombre: item.nombre, categoria: category });
        }
      });
    });
    return results;
  }, [search, popupData]);

  const handleSelect = (item: TramiteItem) => {
    // Register usage if we have an ID
    if (item.id) {
      registrarUso(item.id);
    }
    onSelect(item.nombre, item.id);
  };

  const handleConfirm = () => {
    if (tempSelected) {
      handleSelect(tempSelected);
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
              key={item.nombre}
              onClick={() => setTempSelected(item)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                tempSelected?.nombre === item.nombre
                  ? "bg-fides-accent text-white"
                  : "bg-fides-lavender-100 hover:bg-fides-lavender-200 text-mat-text-primary"
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                tempSelected?.nombre === item.nombre ? "border-white bg-white" : "border-fides-lavender-300"
              }`}>
                {tempSelected?.nombre === item.nombre && <Check size={14} className="text-fides-accent" />}
              </div>
              <span className="text-base font-medium">{item.nombre}</span>
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
        <h2 className="fides-subtitle">Tipo de Tramite</h2>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar tramite..."
          className="fides-input pl-12"
        />
        {isLoading && (
          <Loader2 size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-mat-text-muted animate-spin" />
        )}
      </div>

      {/* Search Results */}
      {search && searchResults.length > 0 && (
        <div className="mb-6">
          <h3 className="fides-label mb-3">Resultados de busqueda</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {searchResults.slice(0, 10).map((item) => (
              <button
                key={item.nombre}
                onClick={() => handleSelect({ id: item.id, nombre: item.nombre })}
                className="w-full p-4 bg-fides-lavender-100 rounded-xl text-left hover:bg-fides-lavender-200 transition-colors"
              >
                <span className="text-base font-medium text-mat-text-primary">{item.nombre}</span>
                {item.categoria && (
                  <span className="text-sm text-mat-text-muted ml-2">({item.categoria})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {search && searchResults.length === 0 && !isLoading && (
        <div className="mb-6 text-center py-8 text-mat-text-muted">
          <p>No se encontraron tramites para "{search}"</p>
        </div>
      )}

      {/* Categories */}
      {!search && (
        <>
          <div className="mb-6">
            <h3 className="fides-label flex items-center gap-2 mb-3 text-mat-text-muted">
              CATEGORIAS (Catalogo 2025)
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
                      {data.count} tramites
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
              {favoritos.slice(0, 5).map((item) => (
                <button
                  key={item.nombre}
                  onClick={() => handleSelect(item)}
                  className="w-full p-4 bg-fides-lavender-100 rounded-xl text-left hover:bg-fides-lavender-200 transition-colors"
                >
                  <span className="text-base font-medium text-mat-text-primary">
                    {item.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
