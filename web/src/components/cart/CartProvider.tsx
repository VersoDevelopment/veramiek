"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isOpAanvraag, type Product } from "@/lib/api";

/** Eén regel in de winkelwagen: het minimale product plus een aantal. */
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  qty: number;
  /**
   * Hoeveel er van dit stuk lagen toen het in de winkelwagen ging. null of
   * undefined betekent "niet geteld" en dus geen limiet.
   *
   * Deze waarde kan verouderen: de winkelwagen leeft in localStorage en kan
   * dagen blijven staan. De winkelwagenpagina haalt daarom bij het openen de
   * actuele voorraad op en trekt de aantallen zo nodig recht.
   */
  stock?: number | null;
};

/** Hoogste aantal dat je van dit stuk mag bestellen. */
export function maxAantal(stock: number | null | undefined): number {
  return typeof stock === "number" && stock > 0 ? stock : Infinity;
}

type CartContextValue = {
  items: CartItem[];
  /** Totaal aantal stuks (voor de teller in de nav). */
  count: number;
  /** Totaalbedrag in euro's. */
  total: number;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  /** Past aantallen aan op de actuele voorraad; geeft terug wat er veranderde. */
  stemAfOpVoorraad: (producten: Product[]) => {
    name: string;
    van: number;
    naar: number;
  }[];
  clear: () => void;
  /** UI-state van de cart-drawer. */
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "veramiek-cart";

/** Leest de opgeslagen cart uit localStorage (SSR-safe). */
function readStored(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // Pas na mount uit localStorage hydrateren, zodat server- en client-render
  // identiek starten (geen hydration mismatch).
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage kan geblokkeerd zijn (private mode); stil negeren.
    }
  }, [items, hydrated]);

  const add = useCallback((product: Product, qty = 1) => {
    /* De knop is al vervangen door een aanvraag, maar een pagina die al open
       stond kan verouderde voorraad tonen. Dan hier alsnog weigeren, anders
       bestelt iemand iets wat er niet ligt. */
    if (isOpAanvraag(product)) return;
    const max = maxAantal(product.stock);
    setItems((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) {
        /* Niet stilzwijgend meer toevoegen dan er ligt. Vera heeft er maar
           een, dus acht bestellen kan niet, ook niet in twee klikken. */
        return current.map((i) =>
          i.id === product.id
            ? { ...i, qty: Math.min(i.qty + qty, max), stock: product.stock }
            : i,
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] ?? null,
          qty: Math.min(qty, max),
          stock: product.stock,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((current) =>
      qty <= 0
        ? current.filter((i) => i.id !== id)
        : current.map((i) =>
            i.id === id ? { ...i, qty: Math.min(qty, maxAantal(i.stock)) } : i,
          ),
    );
  }, []);

  /*
   * Trekt de winkelwagen recht met de voorraad van dit moment. De winkelwagen
   * kan dagen in localStorage staan; zonder deze stap bestelt iemand alsnog
   * drie stuks waarvan er nog een ligt. Geeft terug wat er is aangepast, zodat
   * de pagina het kan melden in plaats van stilletjes te wijzigen.
   */
  const stemAfOpVoorraad = useCallback((producten: Product[]) => {
    const gewijzigd: { name: string; van: number; naar: number }[] = [];
    setItems((current) =>
      current.flatMap((item) => {
        const product = producten.find((p) => p.id === item.id);
        /* Product bestaat niet meer of staat niet meer in de webshop: laten
           staan met de bekende voorraad, dan valt het tenminste op. */
        if (!product) return [item];
        const max = maxAantal(product.stock);
        const nieuw = Math.min(item.qty, max);
        if (product.stock === 0) {
          gewijzigd.push({ name: item.name, van: item.qty, naar: 0 });
          return [];
        }
        if (nieuw !== item.qty) {
          gewijzigd.push({ name: item.name, van: item.qty, naar: nieuw });
        }
        return [{ ...item, stock: product.stock, qty: nieuw }];
      }),
    );
    return gewijzigd;
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return {
      items,
      count,
      total,
      add,
      remove,
      setQty,
      stemAfOpVoorraad,
      clear,
      isOpen,
      open,
      close,
    };
  }, [items, isOpen, add, remove, setQty, stemAfOpVoorraad, clear, open, close]);

  return <CartContext value={value}>{children}</CartContext>;
}

/** Toegang tot de winkelwagen. Moet binnen <CartProvider> gebruikt worden. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart moet binnen <CartProvider> gebruikt worden");
  }
  return ctx;
}
