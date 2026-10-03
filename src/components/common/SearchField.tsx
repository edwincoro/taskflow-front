import { Search, X } from "lucide-react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <label className="search-field">
      <Search size={16} />
      <input
        aria-label="Buscar"
        placeholder="Buscar…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          className="icon-button"
          title="Limpiar búsqueda"
          onClick={() => onChange("")}
        >
          <X size={14} />
        </button>
      )}
    </label>
  );
}
