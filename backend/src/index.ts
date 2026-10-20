import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());


app.post('/quizzes', async (req, res) => {
    try {
        const { title, questions } = req.body;

        const newQuiz = await prisma.quiz.create({
            data: {
                title,
                questions: {
                    create: questions.map((q: any) => ({
                        title: q.title,
                        type: q.type,
                        // Оскільки SQLite не має типу масиву, зберігаємо масиви як JSON-рядки
                        options: q.options ? JSON.stringify(q.options) : null,
                        correctAnswers: q.correctAnswers ? JSON.stringify(q.correctAnswers) : null,
                    })),
                },
            },
            include: { questions: true },
        });

        res.status(201).json(newQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create quiz' });
    }
});


app.get('/quizzes', async (req, res) => {
    try {
        //витягуємо лише те що треба щоб не перевантажувати систему.
        const quizzes = await prisma.quiz.findMany({
            include: { questions: true },
            orderBy: { createdAt: 'desc' }
        });


        const formatted = quizzes.map(q => ({
            id: q.id,
            title: q.title,
            questionsCount: q.questions.length,
        }));

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
});


app.get('/quizzes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await prisma.quiz.findUnique({
            where: { id },
            include: { questions: true },
        });

        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });


        const formattedQuiz = {
            ...quiz,
            questions: quiz.questions.map(q => ({
                ...q,
                options: q.options ? JSON.parse(q.options) : [],
                correctAnswers: q.correctAnswers ? JSON.parse(q.correctAnswers) : [],
            }))
        };

        res.json(formattedQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch quiz details' });
    }
});

app.delete('/quizzes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        //Видалення квізу-видалення питань.
        await prisma.quiz.delete({
            where: { id },
        });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete quiz' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});