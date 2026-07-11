import { redirect } from "@/i18n/routing";

type LocaleIndexProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleIndexPage({ params }: LocaleIndexProps) {
  const { locale } = await params;
  redirect({ href: "/dashboard", locale });
}
