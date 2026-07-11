import { describe, it, expect } from "vitest";
import {
  computeRevenue,
  computeAverageRating,
  computeLowStockCount,
  buildMonthlySeries,
  buildUsersGrowth,
  buildUsersByCountry,
  buildCategoryDistribution,
  buildTopProducts,
} from "../analytics";
import type { Cart } from "@/entities/order/model/types";
import type { Product } from "@/entities/product/model/types";
import type { User } from "@/entities/user/model/types";

function makeCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 1,
    products: [],
    total: 0,
    discountedTotal: 0,
    userId: 1,
    totalProducts: 0,
    totalQuantity: 0,
    ...overrides,
  };
}

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: "Test Product",
    description: "A test product",
    category: "electronics",
    price: 99.99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    tags: [],
    thumbnail: "https://example.com/thumb.jpg",
    images: [],
    ...overrides,
  };
}

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    age: 30,
    gender: "male",
    email: "john@example.com",
    phone: "+1234567890",
    username: "johndoe",
    image: "https://example.com/avatar.jpg",
    company: { name: "Acme" },
    address: {
      address: "123 Main St",
      city: "Springfield",
      state: "IL",
      stateCode: "IL",
      postalCode: "62701",
      country: "US",
    },
    ...overrides,
  };
}

describe("computeRevenue", () => {
  it("returns 0 for empty carts", () => {
    expect(computeRevenue([])).toBe(0);
  });

  it("sums discountedTotal from all carts", () => {
    const carts = [
      makeCart({ discountedTotal: 100 }),
      makeCart({ discountedTotal: 200 }),
      makeCart({ discountedTotal: 50 }),
    ];
    expect(computeRevenue(carts)).toBe(350);
  });
});

describe("computeAverageRating", () => {
  it("returns 0 for empty products", () => {
    expect(computeAverageRating([])).toBe(0);
  });

  it("computes average rating", () => {
    const products = [
      makeProduct({ rating: 4 }),
      makeProduct({ rating: 5 }),
      makeProduct({ rating: 3 }),
    ];
    expect(computeAverageRating(products)).toBe(4);
  });
});

describe("computeLowStockCount", () => {
  it("counts products with stock < 10", () => {
    const products = [
      makeProduct({ stock: 5 }),
      makeProduct({ stock: 15 }),
      makeProduct({ stock: 8 }),
      makeProduct({ stock: 100 }),
    ];
    expect(computeLowStockCount(products)).toBe(2);
  });
});

describe("buildMonthlySeries", () => {
  it("returns 12 months", () => {
    const result = buildMonthlySeries([]);
    expect(result).toHaveLength(12);
  });

  it("distributes carts by id % 12", () => {
    const carts = [
      makeCart({ id: 0, discountedTotal: 100 }),
      makeCart({ id: 1, discountedTotal: 200 }),
      makeCart({ id: 12, discountedTotal: 50 }),
    ];
    const result = buildMonthlySeries(carts);
    expect(result[0].revenue).toBe(150);
    expect(result[0].orders).toBe(2);
    expect(result[1].revenue).toBe(200);
    expect(result[1].orders).toBe(1);
  });
});

describe("buildUsersGrowth", () => {
  it("returns 12 months", () => {
    const result = buildUsersGrowth([]);
    expect(result).toHaveLength(12);
  });
});

describe("buildUsersByCountry", () => {
  it("groups users by country and sorts by count", () => {
    const users = [
      makeUser({ id: 1, address: { ...makeUser().address, country: "US" } }),
      makeUser({ id: 2, address: { ...makeUser().address, country: "US" } }),
      makeUser({ id: 3, address: { ...makeUser().address, country: "UK" } }),
    ];
    const result = buildUsersByCountry(users);
    expect(result[0]).toEqual({ name: "US", value: 2 });
    expect(result[1]).toEqual({ name: "UK", value: 1 });
  });
});

describe("buildCategoryDistribution", () => {
  it("groups products by category", () => {
    const products = [
      makeProduct({ category: "electronics" }),
      makeProduct({ category: "electronics" }),
      makeProduct({ category: "clothing" }),
    ];
    const result = buildCategoryDistribution(products);
    expect(result[0]).toEqual({ name: "electronics", value: 2 });
    expect(result[1]).toEqual({ name: "clothing", value: 1 });
  });
});

describe("buildTopProducts", () => {
  it("returns top products by quantity from carts", () => {
    const products = [makeProduct({ id: 1, title: "Widget" })];
    const carts = [
      makeCart({
        products: [
          { id: 1, title: "Widget", price: 10, quantity: 5, total: 50, discountPercentage: 0, discountedTotal: 50, thumbnail: "" },
        ],
      }),
    ];
    const result = buildTopProducts(products, carts);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toBe("Widget");
    expect(result[0].quantity).toBe(5);
  });
});
