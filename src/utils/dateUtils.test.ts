import { describe, it, expect } from "vitest";

import { formatDate } from "../utils/date";


describe("formatDate", () => {

  it("formats a Date object correctly", () => {

    // Fecha local (sin UTC shift)
    const date = new Date(2024, 0, 5);

    const result = formatDate(date);

    expect(result).toBe("2024-01-05");
  });


  it("formats an ISO string correctly", () => {

    const result = formatDate("2023-12-31T12:00:00");

    expect(result).toBe("2023-12-31");
  });


  it("pads single digit month and day", () => {

    const date = new Date(2024, 2, 7);

    const result = formatDate(date);

    expect(result).toBe("2024-03-07");
  });


  it("handles timestamps correctly", () => {

    const timestamp = new Date(1700000000000);

    const result = formatDate(timestamp);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });


  it("returns NaN values for invalid input", () => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = formatDate("invalid-date" as any);

    expect(result).toBe("NaN-NaN-NaN");
  });

});

