import { describe, it, expect, beforeEach } from "vitest";
import { useUiSettingsStore } from "../ui-settings";

beforeEach(() => {
  useUiSettingsStore.setState({
    theme: "system",
    locale: "en",
    notifications: { email: true, push: true, marketing: false, orderUpdates: true },
    sidebarCollapsed: false,
    dashboardWidgets: ["kpis", "revenue", "orders", "countries", "categories", "topProducts", "activity"],
  });
});

describe("ui-settings store", () => {
  it("sets theme", () => {
    useUiSettingsStore.getState().setTheme("dark");
    expect(useUiSettingsStore.getState().theme).toBe("dark");
  });

  it("sets locale", () => {
    useUiSettingsStore.getState().setLocale("ru");
    expect(useUiSettingsStore.getState().locale).toBe("ru");
  });

  it("toggles sidebar", () => {
    expect(useUiSettingsStore.getState().sidebarCollapsed).toBe(false);
    useUiSettingsStore.getState().toggleSidebar();
    expect(useUiSettingsStore.getState().sidebarCollapsed).toBe(true);
    useUiSettingsStore.getState().toggleSidebar();
    expect(useUiSettingsStore.getState().sidebarCollapsed).toBe(false);
  });

  it("sets notifications partially", () => {
    useUiSettingsStore.getState().setNotifications({ push: false });
    expect(useUiSettingsStore.getState().notifications.push).toBe(false);
    expect(useUiSettingsStore.getState().notifications.email).toBe(true);
  });

  it("sets dashboard widgets", () => {
    const newOrder = ["kpis", "orders", "revenue"];
    useUiSettingsStore.getState().setDashboardWidgets(newOrder as never[]);
    expect(useUiSettingsStore.getState().dashboardWidgets).toEqual(newOrder);
  });
});
