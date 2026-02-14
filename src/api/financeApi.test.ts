import { describe, it, expect, vi, beforeEach } from "vitest";


// ============================
// Mock axios BEFORE import
// ============================

vi.mock("axios", async () => {

  const actual = await vi.importActual<
    typeof import("axios")
  >("axios");

  const mockGet = vi.fn();

  const mockInstance = {
    get: mockGet,

    defaults: {
      timeout: 10000,
      baseURL: import.meta.env.VITE_API_URL,
    },
  };


  return {
    ...actual,

    default: {
      ...actual.default,

      create: vi.fn(() => mockInstance),

      __mockGet: mockGet,
    },
  };
});


// ============================
// Import AFTER mock
// ============================

import axios from "axios";

import {
  api,
  getMarket,
  getForecast,
  getKpis,
  searchSymbols,
} from "./financeApi";


// ============================
// Helper
// ============================

const getMockGet = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (axios as any).__mockGet as ReturnType<typeof vi.fn>;


// ============================
// Tests
// ============================

describe("financeApi", () => {

  beforeEach(() => {
    getMockGet().mockReset();
  });


  it("creates axios instance with correct config", () => {

    expect(api.defaults.timeout).toBe(10000);

    expect(api.defaults.baseURL).toBe(
      import.meta.env.VITE_API_URL
    );

  });


  it("getMarket calls correct endpoint", async () => {

    const mockGet = getMockGet();

    mockGet.mockResolvedValueOnce({ data: {} });


    await getMarket("AAPL");


    expect(mockGet).toHaveBeenCalledWith(
      "/finance/market",
      {
        params: { symbol: "AAPL" },
      }
    );

  });


  it("getForecast calls correct endpoint", async () => {

    const mockGet = getMockGet();

    mockGet.mockResolvedValueOnce({ data: {} });


    await getForecast("TSLA");


    expect(mockGet).toHaveBeenCalledWith(
      "/finance/forecast",
      {
        params: { symbol: "TSLA" },
      }
    );

  });


  it("getKpis calls correct endpoint", async () => {

    const mockGet = getMockGet();

    mockGet.mockResolvedValueOnce({ data: {} });


    await getKpis("MSFT");


    expect(mockGet).toHaveBeenCalledWith(
      "/finance/kpis",
      {
        params: { symbol: "MSFT" },
      }
    );

  });


  it("searchSymbols calls correct endpoint", async () => {

    const mockGet = getMockGet();

    mockGet.mockResolvedValueOnce({ data: {} });


    await searchSymbols("app");


    expect(mockGet).toHaveBeenCalledWith(
      "/finance/search",
      {
        params: { q: "app" },
      }
    );

  });


  it("allows undefined symbol", async () => {

    const mockGet = getMockGet();

    mockGet.mockResolvedValueOnce({ data: {} });


    await getMarket();


    expect(mockGet).toHaveBeenCalledWith(
      "/finance/market",
      {
        params: { symbol: undefined },
      }
    );

  });

});

