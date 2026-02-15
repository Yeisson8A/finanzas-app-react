import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from "vitest";

import KpiCard from "../components/KpiCard";
import { getKpiInsight } from "../api/financeApi";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

// ===============================
// MOCK API
// ===============================

vi.mock("../api/financeApi", () => ({
  getKpiInsight: vi.fn(),
}));

const mockedGetKpiInsight = getKpiInsight as MockedFunction<
  typeof getKpiInsight
>;

// ===============================
// TESTS
// ===============================

describe("KpiCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and value", () => {
    render(<KpiCard title="Last Price" value="150.25" symbol="AAPL" />);

    expect(screen.getByText("Last Price")).toBeInTheDocument();

    expect(screen.getByText("150.25")).toBeInTheDocument();
  });

  it("renders numeric value", () => {
    render(<KpiCard title="Volatility" value={12.5} symbol="AAPL" />);

    expect(screen.getByText("Volatility")).toBeInTheDocument();

    expect(screen.getByText("12.5")).toBeInTheDocument();
  });

  it("has correct html structure", () => {
    const { container } = render(
      <KpiCard title="Trend" value="Bullish" symbol="AAPL" />,
    );

    const card = container.querySelector(".kpi-card");

    expect(card).toBeInTheDocument();

    expect(card?.querySelector("h4")).toHaveTextContent("Trend");

    expect(card?.querySelector("p")).toHaveTextContent("Bullish");
  });

  it("shows tooltip and loads insight on hover", async () => {
    const mockResponse: AxiosResponse = {
      data: {
        insight: "Stable performance",
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: {},
      } as InternalAxiosRequestConfig,
    };

    // Arrange
    mockedGetKpiInsight.mockResolvedValue(mockResponse);

    render(<KpiCard title="RSI" value="55" symbol="AAPL" />);

    const card = screen.getByText("RSI").closest(".kpi-card")!;

    // Act → hover
    fireEvent.mouseEnter(card);

    // Loading appears
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();

    // Wait for insight
    await waitFor(() => {
      expect(screen.getByText("Stable performance")).toBeInTheDocument();
    });
  });

  it("hides tooltip on mouse leave", async () => {
    const mockResponse: AxiosResponse = {
      data: {
        insight: "Low risk",
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: {},
      } as InternalAxiosRequestConfig,
    };

    mockedGetKpiInsight.mockResolvedValue(mockResponse);

    render(<KpiCard title="RSI" value="50" symbol="AAPL" />);

    const card = screen.getByText("RSI").closest(".kpi-card")!;

    fireEvent.mouseEnter(card);

    await waitFor(() => {
      expect(screen.getByText("Low risk")).toBeInTheDocument();
    });

    // Act → leave
    fireEvent.mouseLeave(card);

    // Assert
    await waitFor(() => {
      expect(screen.queryByText("Low risk")).not.toBeInTheDocument();
    });
  });

  it("shows fallback message when API fails", async () => {
    // Arrange
    mockedGetKpiInsight.mockRejectedValue(new Error("API error"));

    render(<KpiCard title="Volatility" value="30" symbol="TSLA" />);

    const card = screen.getByText("Volatility").closest(".kpi-card")!;

    // Act
    fireEvent.mouseEnter(card);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("AI insight unavailable.")).toBeInTheDocument();
    });
  });

  it("does not call API again if insight is cached", async () => {
    const mockResponse: AxiosResponse = {
      data: {
        insight: "Cached insight",
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: {},
      } as InternalAxiosRequestConfig,
    };

    mockedGetKpiInsight.mockResolvedValue(mockResponse);

    render(<KpiCard title="MA 20" value="140" symbol="AAPL" />);

    const card = screen.getByText("MA 20").closest(".kpi-card")!;

    // First hover
    fireEvent.mouseEnter(card);

    await waitFor(() => {
      expect(screen.getByText("Cached insight")).toBeInTheDocument();
    });

    // Hide
    fireEvent.mouseLeave(card);

    // Hover again
    fireEvent.mouseEnter(card);

    // API only once
    expect(getKpiInsight).toHaveBeenCalledTimes(1);
  });
});
