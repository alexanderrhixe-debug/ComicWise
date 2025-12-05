import { AppNavbar } from "components/AppNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-8">
        <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
          <p>© 2025 ComicWise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
