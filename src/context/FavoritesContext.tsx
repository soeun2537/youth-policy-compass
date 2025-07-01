import { createContext, useContext } from "react";

export interface Policy {
  id: number;
  title: string;
  category: string;
  institution: string;
  deadline: string;
  tags: string[];
  summary: string;
  isNew?: boolean;
  liked?: boolean;
}

export interface FavoritesContextType {
  likedPolicyIds: number[];
  allPolicies: Policy[];
  handleLike: (id: number) => void;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("FavoritesContext를 찾을 수 없습니다.");
  return ctx;
}; 