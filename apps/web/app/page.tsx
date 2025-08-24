"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Citation = { id: string; url?: string; quote: string };
type GenerateResponse = { draft: string; citations: Citation[] };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function Home() {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<GenerateResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function onGenerate(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const res = await fetch(`${API_URL}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = (await res.json()) as GenerateResponse;
            setData(json);
        } catch (err: any) {
            setError(err.message || "Ошибка запроса");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={onGenerate} className="bg-white border rounded-2xl p-4 space-y-3 shadow-sm">
                <label className="block text-sm font-medium">Тема статьи</label>
                <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Например: Что такое RAG и когда он нужен"
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring"
                />
                <button
                    type="submit"
                    disabled={loading || !topic.trim()}
                    className="inline-flex items-center rounded-xl bg-blue-600 text-white px-4 py-2 disabled:opacity-60"
                >
                    {loading ? "Генерируем..." : "Сгенерировать драфт"}
                </button>
            </form>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            {data && (
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 bg-white border rounded-2xl p-4 shadow-sm">
                        <h2 className="font-semibold mb-2">Черновик</h2>
                        <div className="prose max-w-none">
                            <ReactMarkdown>{data.draft}</ReactMarkdown>
                        </div>
                    </div>

                    <aside className="bg-white border rounded-2xl p-4 shadow-sm">
                        <h3 className="font-semibold mb-2">Источники</h3>
                        <ol className="list-decimal list-inside space-y-2">
                            {data.citations.map((c, i) => (
                                <li key={c.id}>
                                    <span className="block text-sm">{c.quote}</span>
                                    {c.url && (
                                        <a className="text-blue-600 text-sm underline" href={c.url} target="_blank">
                                            Открыть источник
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </aside>
                </div>
            )}
        </div>
    );
}