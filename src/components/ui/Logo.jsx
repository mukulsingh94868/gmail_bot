import Link from "next/link";
import { Infinity as InfinityIcon } from "lucide-react";

const Logo = ({ href, size = "md", className = "" }) => {
  const large = size === "lg";

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-900 via-brand-700 to-brand-500 text-white shadow-md shadow-brand-700/30 ${
          large ? "h-11 w-11" : "h-9 w-9"
        }`}
      >
        <InfinityIcon size={large ? 24 : 20} strokeWidth={2.5} />
      </span>
      <span
        className={`font-display font-bold tracking-tight text-slate-900 ${
          large ? "text-2xl" : "text-lg"
        }`}
      >
        RecruitLoop
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="RecruitLoop home" className="rounded-xl">
      {content}
    </Link>
  );
};

export default Logo;
