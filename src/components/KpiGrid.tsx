import type { Kpis } from "../models/types";
import KpiCard from "./KpiCard";

interface Props {
  kpis: Kpis;
  symbol: string;
}

export default function KpiGrid({ kpis, symbol }: Props) {
  return (
    <div className="kpi-grid">

      <KpiCard title="Last Price" value={`$${kpis.last_price}`} symbol={symbol} />
      <KpiCard title="Daily Return" value={`${kpis.daily_return_pct}%`} symbol={symbol} />
      <KpiCard title="Volatility" value={`${kpis.volatility_pct}%`} symbol={symbol} />

      <KpiCard title="MA 20" value={kpis.ma_20} symbol={symbol} />
      <KpiCard title="MA 50" value={kpis.ma_50} symbol={symbol} />

      <KpiCard title="RSI 14" value={kpis.rsi_14} symbol={symbol} />
      <KpiCard title="Drawdown" value={`${kpis.max_drawdown_pct}%`} symbol={symbol} />

      <KpiCard title="Trend" value={kpis.trend} symbol={symbol} />

    </div>
  );
}
