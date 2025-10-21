import { FormEvent, useState } from "react";

export interface SearchBoxProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export function SearchBox({ onSearch, placeholder = "Cari produk" }: SearchBoxProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} aria-label="form pencarian">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="search-input"
      />
      <button type="submit">Cari</button>
      <button type="button" onClick={handleClear} disabled={!value}>
        Reset
      </button>
    </form>
  );
}
