import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const getMarket = (symbol?: string) =>
  api.get("/finance/market", {
    params: { symbol },
  });

export const getForecast = (symbol?: string) =>
  api.get("/finance/forecast", {
    params: { symbol },
  });

export const getKpis = (symbol?: string) =>
  api.get("/finance/kpis", {
    params: { symbol },
  });

export const searchSymbols = (query: string) =>
  api.get("/finance/search", {
    params: { q: query },
  });
