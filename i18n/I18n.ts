import Store from "../store/Store";
import type II18n from "./abstraction/II18n";

export default class I18n implements II18n {
  translations: Record<string, Record<string, string>> = {};
  get locales(): string[] {
    const firstValue = Object.keys(this.translations)[0];
    if (!firstValue) return [];
    return Object.keys(this.translations[Object.keys(this.translations)[0]]);
  }
  currentLocale = new Store<string>("");

  getLocaleFromUrl(url: URL, defaultLocale: string): string {
    let [, locale] = url.pathname.split("/");
    if (!this.locales.includes(locale)) locale = this.locales[0];

    return locale || defaultLocale;
  }

  getLocaleUrl(url: URL, locale: string, defaultLocale: string): URL {
    const currentLocale = this.getLocaleFromUrl(url, defaultLocale);
    if (currentLocale === locale) return url;

    const newUrl = new URL(url instanceof URL ? url.href : url);
    if (currentLocale !== defaultLocale) newUrl.pathname = newUrl.pathname.replace(`/${currentLocale}`, "");
    if (locale !== defaultLocale) newUrl.pathname = `/${locale}${newUrl.pathname}`;

    return newUrl;
  }

  getBrowserLocale(): string {
    return navigator.language.split('-')[0];
  }

  private readonly LOCAL_STORAGE_KEY = 'i18n-preferred-language';

  loadPreferredLocale(): string | null {
    if (typeof localStorage === 'undefined') return null;
    const saved = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (saved && this.locales.includes(saved)) {
      return saved;
    }
    return null;
  }

  savePreferredLocale(locale: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.LOCAL_STORAGE_KEY, locale);
  }

  translate(locale: string, key: string): string {
    if (!locale) {
      return key; // Fallback to key if locale not set
    }
    const translation: string = this.translations[key]?.[locale];
    if (!translation) {
      console.warn(`Translation not found for key: ${key} in locale: ${locale}. Falling back to key.`);
      return key;
    }

    return translation;
  }
}
