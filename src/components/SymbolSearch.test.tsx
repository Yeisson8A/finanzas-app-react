import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import SymbolSearch from "./SymbolSearch";
import { searchSymbols } from "../api/financeApi";
import type { MockedFunction } from "vitest";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

function mockAxiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {
      headers: {},
    } as InternalAxiosRequestConfig,
  };
}

// ==========================
// Mock API
// ==========================
vi.mock("../api/financeApi", () => ({
  searchSymbols: vi.fn(),
}));

const mockSearch = searchSymbols as MockedFunction<typeof searchSymbols>;

// ==========================
// Helpers
// ==========================
const waitDebounce = () => new Promise((resolve) => setTimeout(resolve, 600));

// ==========================
// Tests
// ==========================
describe("SymbolSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // ==========================
  // Default value
  // ==========================
  it("calls onSelect with defaultValue on mount", async () => {
    const onSelect = vi.fn();

    render(<SymbolSearch onSelect={onSelect} defaultValue="AAPL" />);

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith("AAPL");
    });
  });

  // ==========================
  // Successful search
  // ==========================
  it("searches and shows results", async () => {
    const onSelect = vi.fn();

    mockSearch.mockResolvedValueOnce(
      mockAxiosResponse({
        results: [
          {
            symbol: "AAPL",
            name: "Apple Inc",
            region: "US",
            currency: "USD",
          },
        ],
      }),
    );

    render(<SymbolSearch onSelect={onSelect} />);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "aa" },
    });

    await waitDebounce();

    await waitFor(() => {
      expect(screen.getByText("AAPL")).toBeInTheDocument();
      expect(screen.getByText(/Apple Inc/i)).toBeInTheDocument();
    });
  });

  // ==========================
  // Select symbol
  // ==========================
  it("selects a symbol when clicked", async () => {
    const onSelect = vi.fn();

    mockSearch.mockResolvedValueOnce(
      mockAxiosResponse({
        results: [
          {
            symbol: "TSLA",
            name: "Tesla",
            region: "US",
            currency: "USD",
          },
        ],
      }),
    );

    render(<SymbolSearch onSelect={onSelect} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "ts" } });

    await waitDebounce();

    const item = await screen.findByText("TSLA");

    fireEvent.click(item);

    expect(onSelect).toHaveBeenCalledWith("TSLA");

    expect(screen.getByRole("textbox")).toHaveValue("TSLA");
  });

  // ==========================
  // Clear results if < 2 chars
  // ==========================
  it("clears results when query is too short", async () => {
    const onSelect = vi.fn();

    render(<SymbolSearch onSelect={onSelect} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a" } });

    await waitDebounce();

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  // ==========================
  // Loading indicator
  // ==========================
  it("shows loader while searching", async () => {
    const onSelect = vi.fn();

    // Simular API lenta
    mockSearch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              mockAxiosResponse({
                results: [],
              }),
            );
          }, 500);
        }),
    );

    render(<SymbolSearch onSelect={onSelect} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "ap" } });

    // Esperar debounce (400ms)
    await new Promise((r) => setTimeout(r, 450));

    // Ahora el loader SÍ debe existir
    expect(screen.getByText("Searching...")).toBeInTheDocument();

    // Esperar a que termine
    await new Promise((r) => setTimeout(r, 600));
  });

  // ==========================
  // Error handling
  // ==========================
  it("handles api error gracefully", async () => {
    const onSelect = vi.fn();

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockSearch.mockRejectedValueOnce(new Error("API error"));

    render(<SymbolSearch onSelect={onSelect} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "aa" } });

    await waitDebounce();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
