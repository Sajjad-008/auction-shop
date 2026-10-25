import { useParams } from "react-router-dom";
import AuctionCard from "../components/AuctionCard";
import useAppContext from "../hooks/useAppContext";

export default function Home() {
  const { auctions } = useAppContext();
  const { key } = useParams<{ key: string }>();

  const list = key ? auctions.filter((a) => a.category === key) : auctions;

  if (list.length === 0)
    return <p className="text-muted">مزایده‌ای در این بخش نیست.</p>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((a) => (
        <AuctionCard key={a.id} auction={a} />
      ))}
    </div>
  );
}
