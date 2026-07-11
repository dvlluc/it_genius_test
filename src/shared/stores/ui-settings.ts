import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/shared/config/constants";

export type ThemePreference = "light" | "dark" | "system";

export type NotificationSettings = {
  email: boolean;
  push: boolean;
  marketing: boolean;
  orderUpdates: boolean;
};

export type UserColumnId =
  | "avatar"
  | "name"
  | "email"
  | "phone"
  | "company"
  | "country"
  | "status"
  | "actions";

export type DashboardWidgetId =
  | "kpis"
  | "revenue"
  | "orders"
  | "countries"
  | "categories"
  | "topProducts"
  | "activity";

type UiSettingsState = {
  theme: ThemePreference;
  locale: Locale;
  notifications: NotificationSettings;
  userColumns: UserColumnId[];
  sidebarCollapsed: boolean;
  dashboardWidgets: DashboardWidgetId[];
  setTheme: (theme: ThemePreference) => void;
  setLocale: (locale: Locale) => void;
  setNotifications: (notifications: Partial<NotificationSettings>) => void;
  setUserColumns: (columns: UserColumnId[]) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDashboardWidgets: (widgets: DashboardWidgetId[]) => void;
};

const DEFAULT_USER_COLUMNS: UserColumnId[] = [
  "avatar",
  "name",
  "email",
  "phone",
  "company",
  "country",
  "status",
  "actions",
];

const DEFAULT_DASHBOARD_WIDGETS: DashboardWidgetId[] = [
  "kpis",
  "revenue",
  "orders",
  "countries",
  "categories",
  "topProducts",
  "activity",
];

export const useUiSettingsStore = create<UiSettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      locale: "en",
      notifications: {
        email: true,
        push: true,
        marketing: false,
        orderUpdates: true,
      },
      userColumns: DEFAULT_USER_COLUMNS,
      sidebarCollapsed: false,
      dashboardWidgets: DEFAULT_DASHBOARD_WIDGETS,
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      setNotifications: (notifications) =>
        set((state) => ({
          notifications: { ...state.notifications, ...notifications },
        })),
      setUserColumns: (userColumns) => set({ userColumns }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setDashboardWidgets: (dashboardWidgets) => set({ dashboardWidgets }),
    }),
    { name: "analytics-ui-settings" },
  ),
);
