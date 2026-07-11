import type { Cart } from "@/entities/order/model/types";
import type { Product } from "@/entities/product/model/types";
import type { User } from "@/entities/user/model/types";
import { LOW_STOCK_THRESHOLD } from "@/shared/config/constants";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function computeRevenue(carts: Cart[]): number {
  return carts.reduce((sum, cart) => sum + cart.discountedTotal, 0);
}

export function computeAverageRating(products: Product[]): number {
  if (products.length === 0) return 0;
  return products.reduce((sum, product) => sum + product.rating, 0) / products.length;
}

export function computeLowStockCount(products: Product[]): number {
  return products.filter((product) => product.stock < LOW_STOCK_THRESHOLD).length;
}

export function buildMonthlySeries(carts: Cart[]) {
  return MONTHS.map((month, index) => {
    const revenue = carts
      .filter((cart) => cart.id % 12 === index)
      .reduce((sum, cart) => sum + cart.discountedTotal, 0);
    const orders = carts.filter((cart) => cart.id % 12 === index).length;
    return { month, revenue: Math.round(revenue), orders };
  });
}

export function buildUsersGrowth(users: User[]) {
  return MONTHS.map((month, index) => ({
    month,
    users: users.filter((user) => user.id % 12 <= index).length,
  }));
}

export function buildUsersByCountry(users: User[]) {
  const counts = new Map<string, number>();
  for (const user of users) {
    const country = user.address.country || "Unknown";
    counts.set(country, (counts.get(country) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export function buildCategoryDistribution(products: Product[]) {
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export function buildTopProducts(products: Product[], carts: Cart[]) {
  const sold = new Map<number, { title: string; quantity: number; revenue: number }>();

  for (const cart of carts) {
    for (const item of cart.products) {
      const current = sold.get(item.id) ?? {
        title: item.title,
        quantity: 0,
        revenue: 0,
      };
      current.quantity += item.quantity;
      current.revenue += item.discountedTotal;
      sold.set(item.id, current);
    }
  }

  if (sold.size === 0) {
    return products
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
      .map((product) => ({
        name: product.title,
        quantity: product.stock,
        revenue: product.price,
      }));
  }

  return Array.from(sold.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map((item) => ({
      name: item.title.length > 18 ? `${item.title.slice(0, 18)}…` : item.title,
      quantity: item.quantity,
      revenue: Math.round(item.revenue),
    }));
}
