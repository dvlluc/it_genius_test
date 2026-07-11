import { describe, it, expect } from "vitest";
import { getUserFullName, deriveUserStatus } from "../types";
import type { User } from "../types";

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

describe("getUserFullName", () => {
  it("combines first and last name", () => {
    expect(getUserFullName(makeUser())).toBe("John Doe");
  });

  it("trims leading/trailing spaces from full name", () => {
    expect(getUserFullName(makeUser({ firstName: "  John  ", lastName: "  Doe  " }))).toBe("John     Doe");
  });
});

describe("deriveUserStatus", () => {
  it("returns pending for id % 3 === 0", () => {
    expect(deriveUserStatus(makeUser({ id: 3 }))).toBe("pending");
  });

  it("returns inactive for id % 3 === 1", () => {
    expect(deriveUserStatus(makeUser({ id: 1 }))).toBe("inactive");
  });

  it("returns active for id % 3 === 2", () => {
    expect(deriveUserStatus(makeUser({ id: 2 }))).toBe("active");
  });
});
