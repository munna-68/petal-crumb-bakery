import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type FavoritesContextType = {
  favorites: Set<string>;
  toggle: (id: string, label?: string) => void;
  isFavorite: (id: string) => boolean;
  count: number;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);
const KEY = "petal-crumb-favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggle = (id: string, label?: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const isAdding = !next.has(id);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      // defer toast to avoid render-phase issues
      setTimeout(() => {
        if (isAdding) toast.success(label ? `Saved — ${label}` : "Saved to favorites", { description: "Find it again in your wishlist", duration: 2000 });
        else toast("Removed from favorites", { duration: 1500 });
      }, 0);
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.has(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite, count: favorites.size, clear: () => setFavorites(new Set()) }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
