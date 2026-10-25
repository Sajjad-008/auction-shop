import { Armchair, Car, Laptop, Palette, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CategoryKey } from "../types";

export interface Category {
  key: CategoryKey;
  label: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  { key: "electronics", label: "الکترونیک", icon: Laptop },
  { key: "collectibles", label: "کلکسیون و عتیقه", icon: Star },
  { key: "decor", label: "خانه و دکور", icon: Armchair },
  { key: "art", label: "هنر", icon: Palette },
  { key: "cars", label: "خودرو و موتور", icon: Car },
];
