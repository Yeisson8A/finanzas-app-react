import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import KpiCard from "./KpiCard";


describe("KpiCard", () => {

  it("renders title and string value", () => {

    render(
      <KpiCard
        title="Last Price"
        value="150.25"
      />
    );


    expect(
      screen.getByText("Last Price")
    ).toBeInTheDocument();

    expect(
      screen.getByText("150.25")
    ).toBeInTheDocument();

  });


  it("renders numeric value", () => {

    render(
      <KpiCard
        title="Volatility"
        value={12.5}
      />
    );


    expect(
      screen.getByText("Volatility")
    ).toBeInTheDocument();

    expect(
      screen.getByText("12.5")
    ).toBeInTheDocument();

  });


  it("has correct html structure", () => {

    const { container } = render(
      <KpiCard
        title="Trend"
        value="Bullish"
      />
    );


    const card = container.querySelector(".kpi-card");

    expect(card).toBeInTheDocument();

    expect(card?.querySelector("h4"))
      .toHaveTextContent("Trend");

    expect(card?.querySelector("p"))
      .toHaveTextContent("Bullish");

  });

});
