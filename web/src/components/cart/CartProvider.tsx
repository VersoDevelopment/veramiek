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
import type { Product } from "@/lib/api";

/** Eén regel in de winkelwagen: het minimale product plus een aantal. */
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  /** Totaal aantal stuks (voor de teller in de nav). */
  count: number;
  /** Totaalbedrag in euro's. */
  total: number;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
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
    setItems((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] ?? null,
          qty,
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
        : current.map((i) => (i.id === id ? { ...i, qty } : i)),
    );
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
      clear,
      isOpen,
      open,
      close,
    };
  }, [items, isOpen, add, remove, setQty, clear, open, close]);

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
