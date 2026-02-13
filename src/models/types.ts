export interface Kpis {
  last_price: number;
  daily_return_pct: number;
  volatility_pct: number;
  ma_20: number;
  ma_50: number;
  rsi_14: number;
  max_drawdown_pct: number;
  trend: "bullish" | "bearish";
}

export interface ForecastItem {
  ds: string;
  yhat: number;
  yhat_upper: number;
  yhat_lower: number;
}

export interface MarketDataPoint {
  date: string;   // YYYY-MM-DD
  close: number;  // Precio de cierre
}

export interface SymbolSearchResult {
  symbol: string;
  name: string;
  region: string;
  currency: string;
}