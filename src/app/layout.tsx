import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Growkub - บริการฟรีเพื่อธุรกิจคุณ",
  description: "ระบบ POS และเครื่องมือจัดการธุรกิจฟรีทุกอย่าง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${kanit.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
