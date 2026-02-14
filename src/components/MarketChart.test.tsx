import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import MarketChart from "./MarketChart";
import type { MarketDataPoint } from "../models/types";


// ==========================
// Mock Recharts (IMPORTANTE)
// ==========================
vi.mock("recharts", () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container">{children}</div>
    ),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LineChart: ({ children }: any) => (
      <div data-testid="line-chart">{children}</div>
    ),

    Line: () => <div data-testid="line" />,

    XAxis: () => <div data-testid="x-axis" />,

    YAxis: () => <div data-testid="y-axis" />,

    Tooltip: () => <div data-testid="tooltip" />,
  };
});


// ==========================
// Mock formatDate
// ==========================
vi.mock("../utils/date", () => ({
  formatDate: (date: string) => date,
}));


// ==========================
// Test Data
// ==========================
const mockData: MarketDataPoint[] = [
  {
    date: "2024-01-01",
    close: 150,
  },
  {
    date: "2024-01-02",
    close: 155,
  },
];


// ==========================
// Tests
// ==========================
describe("MarketChart", () => {

  it("renders title", () => {

    render(<MarketChart data={mockData} />);

    expect(
      screen.getByText("Market Price")
    ).toBeInTheDocument();
  });


  it("renders chart container", () => {

    render(<MarketChart data={mockData} />);

    expect(
      screen.getByTestId("responsive-container")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("line-chart")
    ).toBeInTheDocument();
  });


  it("renders chart elements", () => {

    render(<MarketChart data={mockData} />);

    expect(
      screen.getByTestId("x-axis")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("y-axis")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("tooltip")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("line")
    ).toBeInTheDocument();
  });


  it("renders correctly with empty data", () => {

    render(<MarketChart data={[]} />);

    expect(
      screen.getByText("Market Price")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("line-chart")
    ).toBeInTheDocument();
  });

});
