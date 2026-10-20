# Quiz Builder

Вебдодаток для створення, перегляду та керування інтерактивними опитуваннями.

## 1. Set up Database & Start Backend
1. Відкрийте термінал у папці `backend` і встановіть залежності:
   `cd backend && npm install`
2. Створіть файл `.env` у корені папки `backend` і додайте конфігурацію бази даних:
   `DATABASE_URL="file:./dev.db"`
3. Ініціалізуйте базу даних (SQLite) та запустіть бекенд-сервер:
   `npx prisma db push && npx prisma generate && npm run dev`

## 2. Start Frontend
1. Відкрийте новий термінал у папці `frontend` і встановіть залежності:
   `cd frontend && npm install`
2. Створіть файл `.env.local` у корені папки `frontend` і додайте базовий URL API:
   `NEXT_PUBLIC_API_URL=http://localhost:3001`
3. Запустіть клієнтську частину:
   `npm run dev`

## 3. Create Sample Quiz
1. Відкрийте додаток у браузері за адресою `http://localhost:3000/create`.
2. Введіть назву квізу у відповідне поле.
3. Використайте кнопки для додавання питань різних типів (Boolean, Input, Checkbox) та заповніть їх.
4. Натисніть **Save Quiz**, щоб зберегти опитування в базу даних.
5. Перейдіть на сторінку `http://localhost:3000/quizzes`, щоб побачити створений квіз у списку.
