"use client";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { GenerateResponse, GenerateRequest, Citation } from '../../../../packages/shared';

/**
 * ОБНОВЛЕННАЯ СТРАНИЦА ГЕНЕРАЦИИ С RAG-ПОДДЕРЖКОЙ
 * 
 * Основные изменения:
 * 1. Новый endpoint /generate (вместо /articles/generate)
 * 2. Поддержка Markdown рендеринга
 * 3. Отображение цитат с источниками
 * 4. TypeScript типизация
 * 5. Улучшенный UX с состояниями загрузки
 */

export default function GeneratePage() {
    // ===== СОСТОЯНИЕ КОМПОНЕНТА =====
    const [topic, setTopic] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Изменено: вместо generic 'any' используем типизированный ответ
    const [generateResult, setGenerateResult] = useState<GenerateResponse | null>(null);

    /**
     * ФУНКЦИЯ ГЕНЕРАЦИИ С RAG-ПОДДЕРЖКОЙ
     * 
     * Что изменилось:
     * - Endpoint: /articles/generate → /generate
     * - Типизация запроса и ответа
     * - Обработка ошибок
     * - Сброс предыдущих ошибок
     */
    async function handleGenerate() {
        if (!topic.trim()) {
            setError("Пожалуйста, введите тему статьи");
            return;
        }

        setLoading(true);
        setError(null);
        setGenerateResult(null);

        try {
            // Типизированный запрос к новому RAG-endpoint
            const requestBody: GenerateRequest = { topic };
            
            const response = await fetch("http://localhost:3001/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
            }

            // Типизированный ответ
            const data: GenerateResponse = await response.json();
            
            // Валидация ответа
            if (!data.draft) {
                throw new Error("Сервер вернул пустой черновик");
            }

            setGenerateResult(data);
            
        } catch (err) {
            console.error("Ошибка генерации:", err);
            setError(err instanceof Error ? err.message : "Произошла неизвестная ошибка");
        } finally {
            setLoading(false);
        }
    }

    /**
     * ОБРАБОТЧИК НАЖАТИЯ ENTER
     * UX улучшение - генерация по Enter
     */
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading) {
            handleGenerate();
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* ===== ЗАГОЛОВОК С ОПИСАНИЕМ RAG ===== */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">AI Content Assistant</h1>
                <p className="text-gray-600">
                    Генерация статей с фактическими источниками • RAG-технология • Анти-галлюцинации
                </p>
            </div>

            {/* ===== ФОРМА ВВОДА ТЕМЫ ===== */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    Тема статьи
                </label>
                <div className="flex gap-3">
                    <input
                        id="topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Например: Современные тренды в искусственном интеллекте"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        {loading ? "🔍 Генерация..." : "🚀 Создать драфт"}
                    </button>
                </div>
                
                {/* Показываем подсказку когда поле пустое */}
                {!topic.trim() && !loading && (
                    <p className="text-sm text-gray-500 mt-2">
                        💡 Введите тему, и ИИ найдет релевантные источники для создания статьи
                    </p>
                )}
            </div>

            {/* ===== ОБРАБОТКА ОШИБОК ===== */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex">
                        <span className="text-red-400 mr-2">⚠️</span>
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Ошибка генерации</h3>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== ИНДИКАТОР ЗАГРУЗКИ ===== */}
            {loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                        <div>
                            <h3 className="text-sm font-medium text-blue-800">Генерируем статью...</h3>
                            <p className="text-sm text-blue-600 mt-1">
                                🔍 Поиск релевантных документов → 🤖 Генерация с ИИ → 📝 Добавление цитат
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== РЕЗУЛЬТАТ ГЕНЕРАЦИИ ===== */}
            {generateResult && (
                <div className="space-y-6">
                    {/* MARKDOWN СТАТЬЯ */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-xl font-semibold text-gray-900">📄 Сгенерированная статья</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Основано на {generateResult.citations.length} источниках
                            </p>
                        </div>
                        <div className="px-6 py-6">
                            {/* КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Markdown рендеринг вместо обычного текста */}
                            <ReactMarkdown 
                                className="prose prose-lg max-w-none"
                                components={{
                                    // Кастомизация стилей для Markdown элементов
                                    h1: ({children}) => <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>,
                                    h2: ({children}) => <h2 className="text-xl font-semibold mb-3 mt-6 text-gray-800">{children}</h2>,
                                    h3: ({children}) => <h3 className="text-lg font-medium mb-2 mt-4 text-gray-700">{children}</h3>,
                                    p: ({children}) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
                                    a: ({children, href}) => (
                                        <a href={href} className="text-blue-600 hover:text-blue-800 font-medium">
                                            {children}
                                        </a>
                                    ),
                                }}
                            >
                                {generateResult.draft}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* НОВАЯ СЕКЦИЯ: СПИСОК ИСТОЧНИКОВ И ЦИТАТ */}
                    {generateResult.citations && generateResult.citations.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-900">📚 Источники и цитаты</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Все утверждения подкреплены фактическими источниками
                                </p>
                            </div>
                            <div className="px-6 py-4">
                                <div className="space-y-4">
                                    {generateResult.citations.map((citation: Citation) => (
                                        <div key={citation.id} className="border-l-4 border-blue-200 pl-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                            {citation.id}
                                                        </span>
                                                        <h4 className="font-medium text-gray-900">{citation.title}</h4>
                                                    </div>
                                                    <blockquote className="text-gray-700 italic text-sm">
                                                        "{citation.quote}"
                                                    </blockquote>
                                                    {citation.url && (
                                                        <a 
                                                            href={citation.url} 
                                                            className="text-blue-600 hover:text-blue-800 text-xs mt-1 inline-block"
                                                        >
                                                            🔗 Перейти к источнику
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* КНОПКА ДЛЯ НОВОЙ ГЕНЕРАЦИИ */}
                    <div className="text-center">
                        <button
                            onClick={() => {
                                setTopic("");
                                setGenerateResult(null);
                                setError(null);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            ✏️ Создать новую статью
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}