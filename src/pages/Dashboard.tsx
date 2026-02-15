import { useEffect, useState, useCallback } from "react";

import { getMarket, getForecast, getKpis } from "../api/financeApi";

import type { Kpis, ForecastItem, MarketDataPoint } from "../models/types";

import MarketChart from "../components/MarketChart";
import ForecastChart from "../components/ForecastChart";
import KpiGrid from "../components/KpiGrid";
import SymbolSearch from "../components/SymbolSearch";

export default function Dashboard() {
  const DEFAULT_SYMBOL = import.meta.env.VITE_DEFAULT_SYMBOL;
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);

  const [market, setMarket] = useState<MarketDataPoint[]>([]);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const refreshTime = Number(import.meta.env.VITE_REFRESH_TIME) || 300000;

  const loadData = useCallback(async () => {
    try {
      const [m, f, k] = await Promise.all([
        getMarket(symbol),
        getForecast(symbol),
        getKpis(symbol),
      ]);

      const series = m.data.data["4. close"];

      const parsed: MarketDataPoint[] = Object.keys(series).map((d) => ({
        date: d,
        close: Number(series[d]),
      }));

      setMarket(parsed);
      setForecast(f.data.forecast);
      setKpis(k.data.kpis);
    } catch (error) {
      console.error("Load error:", error);
    }
  }, [symbol]); // SOLO symbol

  // Polling cada 5 min
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, refreshTime);

    return () => clearInterval(interval);
  }, [loadData, refreshTime]);

  return (
    <div className="dashboard">
      <h1>📊 Financial Dashboard</h1>

      <div className="search-container">
        <SymbolSearch onSelect={setSymbol} defaultValue={DEFAULT_SYMBOL} />
      </div>

      {kpis && <KpiGrid kpis={kpis} symbol={symbol} />}

      <MarketChart data={market} />

      <ForecastChart data={forecast} />
    </div>
  );
}
