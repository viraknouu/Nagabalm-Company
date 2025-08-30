import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Locales supportées - utilisation d'un type strict
export const locales = ["en", "km"] as const;
export type Locale = (typeof locales)[number];

// Fonction utilitaire pour vérifier si une locale est valide
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  try {
    // Récupérer la locale demandée (c'est une promise en v4.0)
    const requested = await requestLocale;

    // Valider et utiliser la locale demandée ou par défaut
    let locale: Locale = "en";

    if (requested && isValidLocale(requested)) {
      locale = requested;
    }

    // Charger les messages pour la locale
    const messages = await import(`./messages/${locale}.json`).then(
      (module) => module.default
    );

    return {
      locale,
      messages,
      // Configuration supplémentaire pour next-intl
      timeZone: "Asia/Phnom_Penh",
      now: new Date(),
    };
  } catch (error) {
    console.error("Error loading locale configuration:", error);
    // En cas d'erreur, utiliser la configuration par défaut
    return {
      locale: "en" as Locale,
      messages: (await import("./messages/en.json")).default,
      timeZone: "Asia/Phnom_Penh",
      now: new Date(),
    };
  }
});
