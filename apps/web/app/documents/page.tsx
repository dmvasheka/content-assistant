"use client";

import { useState } from "react";

export default function DocumentsPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);

    async function uploadDoc() {
        await fetch("http://localhost:3001/documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });
        alert("Документ сохранён!");
    }

    async function searchDocs() {
        const res = await fetch("http://localhost:3001/documents/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        });
        const data = await res.json();
        setResults(data);
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <h1 className="text-xl font-bold">📄 Загрузка документа</h1>
            <input
                className="w-full border p-2 rounded"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                className="w-full border p-2 rounded h-40"
                placeholder="Текст статьи"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button
                onClick={uploadDoc}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Сохранить
            </button>

            <h2 className="text-lg font-semibold mt-8">🔍 Поиск</h2>
            <input
                className="w-full border p-2 rounded"
                placeholder="Введите запрос"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                onClick={searchDocs}
                className="px-4 py-2 bg-green-500 text-white rounded"
            >
                Найти похожие
            </button>

            {results.length > 0 && (
                <div className="mt-6 space-y-4">
                    {results.map((doc) => (
                        <div key={doc.id} className="p-4 border rounded shadow">
                            <h3 className="font-bold">{doc.title}</h3>
                            <p className="text-sm text-gray-700">{doc.content}</p>
                            <p className="text-xs text-gray-500">
                                similarity: {doc.similarity.toFixed(3)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}