import { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";

export default function HeroAnimation({
  className = "",
}: {
  className?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scope = createScope({ root: root.current }).add(() => {
      animate(".pulse-ring", {
        scale: [1, 2.6],
        opacity: [0.55, 0],
        duration: 1400,
        ease: "outQuad",
        loop: true,
      });
      animate(".pulse-core", {
        scale: [1, 0.8, 1],
        opacity: [1, 0.7, 1],
        duration: 1400,
        ease: "inOutSine",
        loop: true,
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <span
      ref={root}
      aria-hidden="true"
      className={`relative flex size-3 shrink-0 items-center justify-center ${className}`}
    >
      <span className="pulse-ring absolute inset-0 rounded-full bg-primary" />
      <span className="pulse-core relative size-2.5 rounded-full bg-primary" />
    </span>
  );
}
