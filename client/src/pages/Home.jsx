import { useLocation, useParams, useOutletContext } from "react-router-dom";
import AuctionCard from "../components/AuctionCard";
import { isEnded } from "../utils/auction";

export default function Home() {
  const { auctions } = useOutletContext();
  const { pathname } = useLocation();
  const { key } = useParams();

  let list = auctions;
  if (pathname === "/active") list = auctions.filter((a) => !isEnded(a));
  else if (key) list = auctions.filter((a) => a.category === key);

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
