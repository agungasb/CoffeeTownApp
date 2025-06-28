// This layout is now a simple passthrough.
// The main layout logic has been moved to /src/app/layout.tsx
export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
