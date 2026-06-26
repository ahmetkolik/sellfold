import { cn } from "@/lib/utils";
import appConfig from "@/app.config";

/** Dropcart logomark — shopping cart with striped basket on navy. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label={appConfig.name}>
      <rect width="40" height="40" rx="10" fill="#1B2D3A" />
      {/* handle arm */}
      <path
        d="M7.5 9.5 L12 9.5 L15.5 22 L28 22"
        stroke="#EC9B78" strokeWidth="2.2" strokeLinecap="round"
        strokeLinejoin="round" fill="none"
      />
      {/* basket stripes */}
      <line x1="15" y1="13" x2="27" y2="13" stroke="#EC9B78" strokeWidth="2" strokeLinecap="round" />
      <line x1="15.5" y1="17" x2="27.5" y2="17" stroke="#EC9B78" strokeWidth="2" strokeLinecap="round" />
      {/* wheels */}
      <circle cx="19" cy="26.5" r="2.2" fill="#EC9B78" />
      <circle cx="26.5" cy="26.5" r="2.2" fill="#EC9B78" />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
  onDark = false,
}: {
  className?: string;
  withWordmark?: boolean;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0 drop-shadow-sm" />
      {withWordmark && (
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            onDark ? "text-sidebar-foreground" : "text-foreground",
          )}
        >
          {appConfig.name}
        </span>
      )}
    </span>
  );
}
