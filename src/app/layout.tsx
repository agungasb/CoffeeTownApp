//This is the root layout. It's simple and only defines the html and body tags.
// The main layout logic is in src/app/[locale]/layout.tsx
export default function RootLayout({
  children,
  params: {locale},
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
