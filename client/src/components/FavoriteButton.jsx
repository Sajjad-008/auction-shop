import { Heart } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function FavoriteButton({ auctionId, className = "" }) {
  const { user, favorites, toggleFavorite } = useOutletContext();
  const navigate = useNavigate();
  const active = !!user && favorites.includes(auctionId);
  const label = active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها";

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate("/login");
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
