import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minhas Tarefas",
  description: "CRUD de tarefas com Next.js + Tailwind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
