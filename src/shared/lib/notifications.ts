import { toast } from "sonner";
import { useUiSettingsStore } from "@/shared/stores/ui-settings";

type NotificationType = "success" | "error" | "info" | "warning";

type NotifyOptions = {
  type?: NotificationType;
  duration?: number;
};

function isEnabled(category: "email" | "push" | "marketing" | "orderUpdates"): boolean {
  const { notifications } = useUiSettingsStore.getState();
  return notifications[category];
}

function show(message: string, options: NotifyOptions = {}) {
  const { type = "info", duration = 4000 } = options;

  switch (type) {
    case "success":
      toast.success(message, { duration });
      break;
    case "error":
      toast.error(message, { duration: duration + 2000 });
      break;
    case "warning":
      toast.warning(message, { duration });
      break;
    default:
      toast.info(message, { duration });
  }
}

export const notify = {
  csvExport(message: string) {
    if (isEnabled("orderUpdates")) {
      show(message, { type: "success" });
    }
  },

  fetchError(message: string) {
    if (isEnabled("orderUpdates")) {
      show(message, { type: "error" });
    }
  },

  settingsSaved(message: string) {
    show(message, { type: "success" });
  },

  info(message: string) {
    show(message, { type: "info" });
  },

  success(message: string) {
    if (isEnabled("orderUpdates")) {
      show(message, { type: "success" });
    }
  },

  error(message: string) {
    show(message, { type: "error" });
  },
};
