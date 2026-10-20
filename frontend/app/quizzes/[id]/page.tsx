'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

type Question = {
    id: string;
    title: string;
    type: string;
};

type Quiz = {
    id: string;
    title: string;
    questions: Question[];
};

function QuizDetailsContent() {
    const { id } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchQuiz = async () => {
            try {
                // Повернули /${id} в кінець
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`);
                setQuiz(response.data);
            } catch (error) {
                console.error(error);
                alert('Error loading quiz details');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    if (loading) return <div className="p-8 text-black">Loading...</div>;
    if (!quiz) return <div className="p-8 text-black">Quiz not found</div>;

    return (
        <div className="max-w-3xl mx-auto p-8 text-black">
            <div className="mb-6">
                <button onClick={() => router.push('/quizzes')} className="text-blue-500 hover:underline mb-4 inline-block">
                    &larr; Back to all quizzes
                </button>
                <h1 className="text-3xl font-bold">{quiz.title}</h1>
                <p className="text-gray-500 mt-2">Structure view (Read-only)</p>
            </div>

            <div className="space-y-6">
                {quiz.questions.map((q, index) => (
                    <div key={q.id} className="border border-slate-200 p-4 rounded-lg bg-white shadow-sm opacity-80">                        <p className="font-semibold mb-3">{index + 1}. {q.title}</p>

                        {q.type === 'boolean' && (
                            <div className="space-x-4">
                                <label className="cursor-not-allowed text-gray-600">
                                    <input type="radio" disabled className="mr-2" />
                                    True
                                </label>
                                <label className="cursor-not-allowed text-gray-600">
                                    <input type="radio" disabled className="mr-2" />
                                    False
                                </label>
                            </div>
                        )}

                        {q.type === 'input' && (
                            <input
                                type="text"
                                disabled
                                className="border p-2 rounded w-full bg-gray-200 cursor-not-allowed"
                                placeholder="Short text answer expected here..."
                            />
                        )}

                        {q.type === 'checkbox' && (
                            <div className="flex flex-col space-y-2">
                                <label className="cursor-not-allowed text-gray-600">
                                    <input type="checkbox" disabled className="mr-2" />
                                    Multiple Choice Option
                                </label>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
// вимикаємо серв.рендеринг.
export default dynamic(() => Promise.resolve(QuizDetailsContent), { ssr: false });