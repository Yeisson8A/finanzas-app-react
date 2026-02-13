import { useEffect, useState } from "react";

import { searchSymbols } from "../api/financeApi";
import type { SymbolSearchResult } from "../models/types";


interface Props {
  onSelect: (symbol: string) => void;
  defaultValue?: string;
}


export default function SymbolSearch({
  onSelect,
  defaultValue = "",
}: Props) {

  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<SymbolSearchResult[]>([]);
  const [loading, setLoading] = useState(false);


  // Notificar valor inicial al Dashboard
  useEffect(() => {
    if (defaultValue) {
      onSelect(defaultValue);
    }
  }, [defaultValue, onSelect]);


  // Search debounce
  useEffect(() => {

    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {

      try {
        setLoading(true);

        const res = await searchSymbols(query);

        setResults(res.data.results);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    }, 400);

    return () => clearTimeout(timer);

  }, [query]);


  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    setQuery(symbol);
    setResults([]);
  };


  return (
    <div className="symbol-search">

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search symbol (AAPL, TSLA...)"
      />


      {loading && <div className="loader">Searching...</div>}


      {results.length > 0 && (

        <ul className="dropdown">

          {results.map((r) => (

            <li
              key={r.symbol}
              onClick={() => handleSelect(r.symbol)}
            >
              <strong>{r.symbol}</strong>
              {" "}– {r.name}
              {" "}({r.region})
            </li>

          ))}

        </ul>
      )}

    </div>
  );
}

