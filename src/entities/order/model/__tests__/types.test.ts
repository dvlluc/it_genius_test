import { describe, it, expect } from "vitest";
import { deriveOrderStatus } from "../types";
import type { Cart } from "../types";

function makeCart(id: number): Cart {
  return {
    id,
    products: [],
    total: 0,
    discountedTotal: 0,
    userId: 1,
    totalProducts: 0,
    totalQuantity: 0,
  };
}

describe("deriveOrderStatus", () => {
  it("cycles through statuses based on cart id", () => {
    expect(deriveOrderStatus(makeCart(0))).toBe("pending");
    expect(deriveOrderStatus(makeCart(1))).toBe("processing");
    expect(deriveOrderStatus(makeCart(2))).toBe("shipped");
    expect(deriveOrderStatus(makeCart(3))).toBe("delivered");
    expect(deriveOrderStatus(makeCart(4))).toBe("cancelled");
    expect(deriveOrderStatus(makeCart(5))).toBe("pending");
  });
});
