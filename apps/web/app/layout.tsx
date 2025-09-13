import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Content Assistant - AI-powered статьи с источниками",
  description: "RAG-система для генерации статей с фактическими источниками. Анти-галлюцинации и проверяемые цитаты.",
  keywords: ["AI", "RAG", "контент", "статьи", "источники", "цитаты"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
        <body 
            className="min-h-screen bg-gray-50 text-gray-900"
            suppressHydrationWarning={true}
        >
        <header className="border-b bg-white">
            <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
                <h1 className="font-semibold">Content Assistant</h1>
                <nav className="text-sm space-x-4">
                    <a href="/" className="hover:underline">Создать драфт</a>
                    <a href="/upload" className="hover:underline">Загрузка</a>
                    <a href="/drafts" className="hover:underline">Черновики</a>
                    <a href="/generate" className="hover:underline">Сгенерировать</a>
                    <a href="/documents" className="hover:underline">Documents</a>
                </nav>
            </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
        </body>
        </html>
    );
}
