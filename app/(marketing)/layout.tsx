/** Pass-through: the marketing page owns its own nav + footer. */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
