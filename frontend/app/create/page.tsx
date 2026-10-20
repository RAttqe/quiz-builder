'use client';

import dynamic from 'next/dynamic';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Question = {
  title: string;
  type: string;
};

type QuizForm = {
  title: string;
  questions: Question[];
};

function CreateQuizForm() {
  const router = useRouter();

  const { register, control, handleSubmit } = useForm<QuizForm>({
    defaultValues: {
      title: '',
      questions: [{ title: '', type: 'boolean' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizForm) => {
    try {
      // Відправляємо сформований payload
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, data);
      alert('Quiz created successfully!');
      //перенаправлення
      router.push('/quizzes');
    } catch (error) {
      console.error(error);
      alert('Error creating quiz');
    }
  };

  return (
      <div className="max-w-2xl mx-auto p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Quiz Title</label>
            <input
                {...register('title', { required: true })}
                className="w-full border p-2 rounded text-black"
                placeholder="Enter quiz title..."
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            {fields.map((field, index) => (
                <div key={field.id} className="border border-slate-200 p-4 rounded-lg bg-white shadow-sm hover:border-slate-300 transition-all text-black">
                  <div className="flex justify-between mb-2">
                    <label className="font-medium">Question {index + 1}</label>
                    {fields.length > 1 && (
                        <button type="button" onClick={() => remove(index)} className="text-red-500 text-sm">
                          Remove
                        </button>
                    )}
                  </div>

                  <input
                      {...register(`questions.${index}.title` as const, { required: true })}
                      className="w-full border p-2 rounded mb-2"
                      placeholder="Question text..."
                  />

                  <select
                      {...register(`questions.${index}.type` as const)}
                      className="w-full border p-2 rounded"
                  >
                    <option value="boolean">True/False (Boolean)</option>
                    <option value="input">Short Text (Input)</option>
                    <option value="checkbox">Multiple Choice (Checkbox)</option>
                  </select>
                </div>
            ))}
          </div>

          <button
              type="button"
              onClick={() => append({ title: '', type: 'boolean' })}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md mr-4">
            + Add Question
          </button>

          <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Quiz
          </button>
        </form>
      </div>
  );
}
// вимикаємо серв.рендеринг.
export default dynamic(() => Promise.resolve(CreateQuizForm), { ssr: false });