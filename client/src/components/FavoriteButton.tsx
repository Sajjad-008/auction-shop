import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useAppContext from "../hooks/useAppContext";

interface Props {
  auctionId: number;
  className?: string;
}

export default function FavoriteButton({ auctionId, className = "" }: Props) {
  const { user, favorites, toggleFavorite } = useAppContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = !!user && favorites.includes(auctionId);
  const label = active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login", { state: { from: pathname } });
      return;
    }
    toggleFavorite(auctionId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`transition-colors hover:bg-hover active:bg-primary-soft ${className}`}
    >
      <Heart
        size={20}
        className={active ? "fill-danger text-danger" : "text-muted"}
      />
    </button>
  );
}
