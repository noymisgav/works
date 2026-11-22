import type { Metadata } from "next";
import "./globals.css";
import "./doodle-custom.css";
import GardenCursor from "@/components/GardenCursor";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "קינדר ארטס | עופרי",
  description: "גלריית היצירות של עופרי",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col bg-cream text-ink antialiased" style={{ fontFamily: '"Google Sans", sans-serif' }}>
        <ThemeProvider>
          <GardenCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
