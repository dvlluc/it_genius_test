import { describe, it, expect } from "vitest";
import { formatCurrency, formatNumber, formatPercent, formatRating } from "../formatters";

describe("formatCurrency", () => {
  it("formats as USD currency", () => {
    expect(formatCurrency(1234)).toBe("$1,234");
  });

  it("rounds to whole dollars", () => {
    expect(formatCurrency(99.99)).toBe("$100");
  });
});

describe("formatNumber", () => {
  it("formats with thousand separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });
});

describe("formatPercent", () => {
  it("formats as percentage", () => {
    expect(formatPercent(50)).toBe("50%");
  });
});

describe("formatRating", () => {
  it("formats with one decimal", () => {
    expect(formatRating(4.567)).toBe("4.6");
  });
});
