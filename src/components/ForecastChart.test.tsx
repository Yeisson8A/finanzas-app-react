import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import ForecastChart from "./ForecastChart";
import type { ForecastItem } from "../models/types";


// ==========================
// Mock Recharts
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

    Area: () => <div data-testid="area" />,

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
const mockData: ForecastItem[] = [
  {
    ds: "2024-01-01",
    yhat: 150,
    yhat_upper: 160,
    yhat_lower: 140,
  },
  {
    ds: "2024-01-02",
    yhat: 152,
    yhat_upper: 162,
    yhat_lower: 142,
  },
];


// ==========================
// Tests
// ==========================
describe("ForecastChart", () => {

  it("renders title", () => {

    render(<ForecastChart data={mockData} />);

    expect(
      screen.getByText("Forecast")
    ).toBeInTheDocument();
  });


  it("renders chart container", () => {

    render(<ForecastChart data={mockData} />);

    expect(
      screen.getByTestId("responsive-container")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("line-chart")
    ).toBeInTheDocument();
  });


  it("renders chart elements", () => {

    render(<ForecastChart data={mockData} />);

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
      screen.getAllByTestId("area").length
    ).toBe(2);

    expect(
      screen.getByTestId("line")
    ).toBeInTheDocument();
  });


  it("renders correctly with empty data", () => {

    render(<ForecastChart data={[]} />);

    expect(
      screen.getByText("Forecast")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("line-chart")
    ).toBeInTheDocument();
  });

});
