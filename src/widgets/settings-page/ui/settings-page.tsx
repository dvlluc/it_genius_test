"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { notify } from "@/shared/lib/notifications";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useUiSettingsStore } from "@/shared/stores/ui-settings";
import { usePathname, useRouter } from "@/i18n/routing";
import type { Locale } from "@/shared/config/constants";

const settingsSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  role: z.string().min(2),
  theme: z.enum(["light", "dark", "system"]),
  locale: z.enum(["en", "ru"]),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  orderUpdates: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsPage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const tNotify = useTranslations("notifications");
  const { setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const emailNotif = useUiSettingsStore((s) => s.notifications.email);
  const pushNotif = useUiSettingsStore((s) => s.notifications.push);
  const marketingNotif = useUiSettingsStore((s) => s.notifications.marketing);
  const orderUpdatesNotif = useUiSettingsStore((s) => s.notifications.orderUpdates);
  const theme = useUiSettingsStore((s) => s.theme);
  const setStoreTheme = useUiSettingsStore((s) => s.setTheme);
  const setLocale = useUiSettingsStore((s) => s.setLocale);
  const setNotifications = useUiSettingsStore((s) => s.setNotifications);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: "Alex Admin",
      email: "alex.admin@example.com",
      role: "Administrator",
      theme,
      locale: locale as Locale,
      emailNotifications: emailNotif,
      pushNotifications: pushNotif,
      marketingEmails: marketingNotif,
      orderUpdates: orderUpdatesNotif,
    },
  });

  const watchedTheme = form.watch("theme");
  const watchedLocale = form.watch("locale");

  const themeLabels: Record<SettingsFormValues["theme"], string> = {
    light: t("themeLight"),
    dark: t("themeDark"),
    system: t("themeSystem"),
  };
  const localeLabels: Record<Locale, string> = {
    en: "English",
    ru: "Русский",
  };

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      theme,
      locale: locale as Locale,
      emailNotifications: emailNotif,
      pushNotifications: pushNotif,
      marketingEmails: marketingNotif,
      orderUpdates: orderUpdatesNotif,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync store → form only when store inputs change
  }, [theme, locale, emailNotif, pushNotif, marketingNotif, orderUpdatesNotif]);

  const onSubmit = (values: SettingsFormValues) => {
    setTheme(values.theme);
    setStoreTheme(values.theme);
    setLocale(values.locale);
    setNotifications({
      email: values.emailNotifications,
      push: values.pushNotifications,
      marketing: values.marketingEmails,
      orderUpdates: values.orderUpdates,
    });
    if (values.locale !== locale) {
      router.replace(pathname, { locale: values.locale });
    }
    notify.settingsSaved(tNotify("settingsSaved"));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section aria-labelledby="section-profile" className="space-y-4 rounded-xl border p-4">
          <h2 id="section-profile" className="text-sm font-medium">{t("profile")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("fullName")}</Label>
              <Input id="fullName" {...form.register("fullName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="role">{t("role")}</Label>
              <Input id="role" {...form.register("role")} />
            </div>
          </div>
        </section>

        <section aria-labelledby="section-appearance" className="space-y-4 rounded-xl border p-4">
          <h2 id="section-appearance" className="text-sm font-medium">{t("appearance")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("theme")}</Label>
              <Select
                value={watchedTheme}
                onValueChange={(value) => {
                  if (!value) return;
                  form.setValue("theme", value as SettingsFormValues["theme"], {
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: SettingsFormValues["theme"] | null) =>
                      value ? themeLabels[value] : t("theme")
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t("themeLight")}</SelectItem>
                  <SelectItem value="dark">{t("themeDark")}</SelectItem>
                  <SelectItem value="system">{t("themeSystem")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("language")}</Label>
              <Select
                value={watchedLocale}
                onValueChange={(value) => {
                  if (!value) return;
                  form.setValue("locale", value as Locale, { shouldDirty: true });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: Locale | null) =>
                      value ? localeLabels[value] : t("language")
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section aria-labelledby="section-notifications" className="space-y-4 rounded-xl border p-4">
          <h2 id="section-notifications" className="text-sm font-medium">{t("notifications")}</h2>
          {(
            [
              ["emailNotifications", "emailNotifications"],
              ["pushNotifications", "pushNotifications"],
              ["marketingEmails", "marketingEmails"],
              ["orderUpdates", "orderUpdates"],
            ] as const
          ).map(([field, labelKey]) => {
            // eslint-disable-next-line react-hooks/incompatible-library
            const checked = form.watch(field);
            return (
              <div key={field} className="flex items-center justify-between gap-4">
                <Label htmlFor={field}>{t(labelKey)}</Label>
                <Switch
                  id={field}
                  checked={checked}
                  onCheckedChange={(value) =>
                    form.setValue(field, value, { shouldDirty: true })
                  }
                />
              </div>
            );
          })}
        </section>

        <Button type="submit">{tCommon("save")}</Button>
      </form>
    </div>
  );
}
