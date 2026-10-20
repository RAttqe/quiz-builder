'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

type Quiz = {
    id: string;
    title: string;
    questionsCount: number;
};

export default function QuizzesList() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQuizzes = async () => {
        try {
            // Обов'язково зворотні лапки (бектики)
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`);
            setQuizzes(response.data);
        } catch (error) {
            console.error(error);
            alert('Error loading quizzes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this quiz?')) return;
        try {
            // Повернули /${id} в кінець
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`);
            fetchQuizzes();
        } catch (error) {
            console.error(error);
            alert('Error deleting quiz');
        }
    };

    if (loading) return <div className="p-8 text-black">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-8 text-black">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">All Quizzes</h1>
                <Link
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                    href="/create"
                >
                    + Create New Quiz
                </Link>
            </div>

            {quizzes.length === 0 ? (
                <p className="text-gray-600">No quizzes found. Create your first one!</p>
            ) : (
                <div className="space-y-4">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="border border-slate-200 p-4 rounded-lg bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">{quiz.title}</h2>
                                <p className="text-gray-500">{quiz.questionsCount} questions</p>
                            </div>
                            <div className="space-x-3">
                                <Link
                                    href={`/quizzes/${quiz.id}`}
                                    className="text-blue-500 hover:text-blue-700 font-medium mr-4"
                                >
                                    Take Quiz
                                </Link>
                                <button
                                    onClick={() => handleDelete(quiz.id)}
                                    className="text-red-500 hover:text-red-700 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}