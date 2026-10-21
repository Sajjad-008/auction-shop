import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { Search, SearchX } from "lucide-react";
import AuctionCard from "../components/AuctionCard";
import { categories } from "../data/categories";
import { matches } from "../utils/search";

function Empty({ icon: Icon, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
      <Icon size={40} className="text-muted" />
      {children}
    </div>
  );
}

export default function SearchResults() {
  const { auctions } = useOutletContext();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = categories.find((c) => c.key === params.get("cat"));

  if (!q.trim() && !category)
    return (
      <Empty icon={Search}>
        <p className="text-muted">عبارتی بنویس یا یه دسته‌بندی انتخاب کن.</p>
      </Empty>
    );

  const inAll = auctions.filter((a) => matches(a, q));
  const list = category
    ? inAll.filter((a) => a.category === category.key)
    : inAll;
  const where = category ? `در «${category.label}»` : "در همه دسته‌ها";

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        {list.length.toLocaleString("fa-IR")} نتیجه
        {q.trim() && (
          <>
            {" "}
            برای «<b className="text-fg">{q.trim()}</b>»
          </>
        )}{" "}
        {where}
      </p>

      {list.length === 0 ? (
        <Empty icon={SearchX}>
          <p className="text-muted">چیزی پیدا نشد. عبارت دیگه‌ای امتحان کن.</p>
          {category && inAll.length > 0 && (
            <Link
              to={`/search?q=${encodeURIComponent(q.trim())}`}
              className="font-bold text-primary hover:underline"
            >
              جستجو در همه دسته‌ها ({inAll.length.toLocaleString("fa-IR")}{" "}
              نتیجه)
            </Link>
          )}
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((a) => (
            <AuctionCard key={a.id} auction={a} />
          ))}
        </div>
      )}
    </div>
  );
}
