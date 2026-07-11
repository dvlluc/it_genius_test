export const APP_ROUTES = {
  dashboard: "/dashboard",
  users: "/users",
  products: "/products",
  orders: "/orders",
  analytics: "/analytics",
  settings: "/settings",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export const NAV_ITEMS = [
  { href: APP_ROUTES.dashboard, labelKey: "nav.dashboard", icon: "LayoutDashboard" },
  { href: APP_ROUTES.users, labelKey: "nav.users", icon: "Users" },
  { href: APP_ROUTES.products, labelKey: "nav.products", icon: "Package" },
  { href: APP_ROUTES.orders, labelKey: "nav.orders", icon: "ShoppingCart" },
  { href: APP_ROUTES.analytics, labelKey: "nav.analytics", icon: "BarChart3" },
  { href: APP_ROUTES.settings, labelKey: "nav.settings", icon: "Settings" },
] as const;
