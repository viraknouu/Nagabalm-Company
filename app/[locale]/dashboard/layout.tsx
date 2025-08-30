import { locales } from "@/i18n";
import { notFound } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Attendre les paramètres
  const { locale } = await params;

  // Valider que la locale est supportée
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return <ProtectedRoute locale={locale}>{children}</ProtectedRoute>;
}