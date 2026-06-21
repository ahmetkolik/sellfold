import { cn } from "@/lib/utils";
import appConfig from "@/app.config";

/** Vitrin logomark — a storefront with a striped coral awning. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label={appConfig.name}>
      <defs>
        <linearGradient id="vt-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9d6e" />
          <stop offset="0.5" stopColor="#fb6f53" />
          <stop offset="1" stopColor="#e84d6b" />
        </linearGradient>
        <linearGradient id="vt-awn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#ffe6d8" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#vt-bg)" />
      <rect width="40" height="40" rx="11" fill="#fff" opacity="0.06" />
      {/* storefront body */}
      <rect x="11" y="20" width="18" height="11" rx="1.6" fill="#fff" opacity="0.95" />
      {/* door */}
      <rect x="17.6" y="24" width="4.8" height="7" rx="0.8" fill="url(#vt-bg)" opacity="0.55" />
      {/* awning canopy */}
      <path d="M9.5 13 H30.5 a1.5 1.5 0 0 1 1.5 1.5 V19 H8 V14.5 A1.5 1.5 0 0 1 9.5 13 Z" fill="url(#vt-awn)" />
      {/* awning stripes */}
      <g fill="url(#vt-bg)" opacity="0.85">
        <rect x="11" y="13" width="3.4" height="6" />
        <rect x="17.8" y="13" width="3.4" height="6" />
        <rect x="24.6" y="13" width="3.4" height="6" />
      </g>
      {/* scalloped awning edge */}
      <path d="M8 19 q2 2.4 4 0 q2 2.4 4 0 q2 2.4 4 0 q2 2.4 4 0 q2 2.4 4 0 L32 19 Z" fill="url(#vt-awn)" />
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
