import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import KpiGrid from "./KpiGrid";
import type { Kpis } from "../models/types";


// ============================
// Mock KpiCard
// ============================

vi.mock("../components/KpiCard", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ title, value }: any) => (
    <div data-testid="kpi-card">
      <span>{title}</span>
      <span>{value}</span>
    </div>
  ),
}));


// ============================
// Tests
// ============================

describe("KpiGrid", () => {

  const mockKpis: Kpis = {
    last_price: 150.25,

    daily_return_pct: 1.5,
    volatility_pct: 2.3,

    ma_20: 145.1,
    ma_50: 140.5,

    rsi_14: 60.2,

    max_drawdown_pct: -12.4,

    trend: "bullish",
  };


  it("renders all KPI cards", () => {

    render(<KpiGrid kpis={mockKpis} />);


    const cards = screen.getAllByTestId("kpi-card");

    expect(cards).toHaveLength(8);

  });


  it("renders formatted values", () => {

    render(<KpiGrid kpis={mockKpis} />);


    expect(
      screen.getByText("$150.25")
    ).toBeInTheDocument();

    expect(
      screen.getByText("1.5%")
    ).toBeInTheDocument();

    expect(
      screen.getByText("2.3%")
    ).toBeInTheDocument();

    expect(
      screen.getByText("-12.4%")
    ).toBeInTheDocument();

  });


  it("renders moving averages", () => {

    render(<KpiGrid kpis={mockKpis} />);


    expect(
      screen.getByText("145.1")
    ).toBeInTheDocument();

    expect(
      screen.getByText("140.5")
    ).toBeInTheDocument();

  });


  it("renders trend", () => {

    render(<KpiGrid kpis={mockKpis} />);


    expect(
      screen.getByText("bullish")
    ).toBeInTheDocument();

  });


  it("has grid container", () => {

    const { container } = render(
      <KpiGrid kpis={mockKpis} />
    );


    const grid = container.querySelector(".kpi-grid");

    expect(grid).toBeInTheDocument();

  });

});
