import { useEffect, useState } from "react";
import type { Lang } from "../content";

export const PALETTES = [
  { id: "lime", bg: "#0b0c0a" },
  { id: "ocean", bg: "#08111a" },
  { id: "rose", bg: "#120b0f" },
  { id: "amber", bg: "#100d07" },
  { id: "light", bg: "#f6f7f2" },
] as const;
export type Palette = (typeof PALETTES)[number]["id"];

const isLang = (s: string | null): s is Lang => s === "pt" || s === "en";
const isPalette = (s: string | null | undefined): s is Palette => PALETTES.some((p) => p.id === s);

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* modo privado: a escolha vale só para esta visita */
  }
}

function initialLang(): Lang {
  const q = new URLSearchParams(location.search).get("lang");
  if (isLang(q)) return q;
  const saved = read("lang");
  if (isLang(saved)) return saved;
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

/** O script inline do index.html já aplicou a paleta salva antes do primeiro paint. */
function initialPalette(): Palette {
  const d = document.documentElement.dataset.palette;
  return isPalette(d) ? d : "lime";
}

export function usePrefs() {
  const [lang, setLang] = useState(initialLang);
  const [palette, setPalette] = useState(initialPalette);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    write("lang", lang);
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.palette = palette;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", PALETTES.find((p) => p.id === palette)!.bg);
    write("palette", palette);
  }, [palette]);

  return { lang, setLang, palette, setPalette };
}
