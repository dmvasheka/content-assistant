"use client";
import { useState } from "react";

export default function HomePage() {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState<any>(null);

    async function handleGenerate() {
        setLoading(true);
        const res = await fetch("http://localhost:3001/articles/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic }),
        });
        const data = await res.json();
        setArticle(data);
        setLoading(false);
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">AI Content Assistant</h1>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Введите тему статьи..."
                    className="flex-1 border rounded p-2"
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {loading ? "Генерация..." : "Создать драфт"}
                </button>
            </div>

            {article && (
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                    <p className="whitespace-pre-line">{article.content}</p>
                </div>
            )}
        </div>
    );
}