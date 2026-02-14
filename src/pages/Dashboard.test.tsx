import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";

import Dashboard from "../pages/Dashboard";

import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { getMarket, getForecast, getKpis } from "../api/financeApi";

// ==========================
// Mock env
// ==========================
vi.stubGlobal("import.meta", {
  env: {
    VITE_DEFAULT_SYMBOL: "AAPL",
    VITE_REFRESH_TIME: "1000",
  },
});

// ==========================
// Mock API
// ==========================
vi.mock("../api/financeApi", () => ({
  getMarket: vi.fn(),
  getForecast: vi.fn(),
  getKpis: vi.fn(),
}));

// ==========================
// Mock child components
// ==========================
vi.mock("../components/MarketChart", () => ({
  default: () => <div data-testid="market-chart" />,
}));

vi.mock("../components/ForecastChart", () => ({
  default: () => <div data-testid="forecast-chart" />,
}));

vi.mock("../components/KpiGrid", () => ({
  default: () => <div data-testid="kpi-grid" />,
}));

vi.mock("../components/SymbolSearch", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ onSelect }: any) => (
    <button data-testid="symbol-search" onClick={() => onSelect("TSLA")}>
      Search
    </button>
  ),
}));

// ==========================
// Helpers
// ==========================
const mockConfig = {
  headers: {},
} as InternalAxiosRequestConfig;

function mockAxios<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: mockConfig,
  };
}

// ==========================
// Mocks
// ==========================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGetMarket = getMarket as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGetForecast = getForecast as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGetKpis = getKpis as any;

// ==========================
// Test Data
// ==========================
const marketResponse = {
  data: {
    "4. close": {
      "2024-01-01": "150",
      "2024-01-02": "155",
    },
  },
};

const forecastResponse = {
  forecast: [
    {
      ds: "2024-01-03",
      yhat: 160,
      yhat_upper: 170,
      yhat_lower: 150,
    },
  ],
};

const kpisResponse = {
  kpis: {
    last_price: 155,
    daily_return_pct: 1.2,
    volatility_pct: 2.5,
    ma_20: 150,
    ma_50: 145,
    rsi_14: 60,
    max_drawdown_pct: -5,
    trend: "bullish",
  },
};

// ==========================
// Tests
// ==========================
describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // ==========================
  // Render
  // ==========================
  it("renders dashboard title", () => {
    render(<Dashboard />);

    expect(screen.getByText(/financial dashboard/i)).toBeInTheDocument();
  });

  // ==========================
  // Load data
  // ==========================
  it("loads data on mount", async () => {
    mockGetMarket.mockResolvedValue(
      mockAxios(marketResponse),
    );

    mockGetForecast.mockResolvedValue(mockAxios(forecastResponse));

    mockGetKpis.mockResolvedValue(mockAxios(kpisResponse));

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockGetMarket).toHaveBeenCalled();
      expect(mockGetForecast).toHaveBeenCalled();
      expect(mockGetKpis).toHaveBeenCalled();
    });

    expect(screen.getByTestId("market-chart")).toBeInTheDocument();

    expect(screen.getByTestId("forecast-chart")).toBeInTheDocument();

    expect(screen.getByTestId("kpi-grid")).toBeInTheDocument();
  });

  // ==========================
  // Change symbol
  // ==========================
  it("reloads data when symbol changes", async () => {
    mockGetMarket.mockResolvedValue(mockAxios({ data: marketResponse }));

    mockGetForecast.mockResolvedValue(mockAxios(forecastResponse));

    mockGetKpis.mockResolvedValue(mockAxios(kpisResponse));

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockGetMarket).toHaveBeenCalledTimes(1);
    });

    screen.getByTestId("symbol-search").click();

    await waitFor(() => {
      expect(mockGetMarket).toHaveBeenCalledWith("TSLA");
    });
  });

  // ==========================
  // Error
  // ==========================
  it("logs error when api fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockGetMarket.mockRejectedValue(new Error("API error"));

    mockGetForecast.mockRejectedValue(new Error("API error"));

    mockGetKpis.mockRejectedValue(new Error("API error"));

    render(<Dashboard />);

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });
});
