import { useState } from "react";

export default function AuctionImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <div className={`bg-line ${className}`} />;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
