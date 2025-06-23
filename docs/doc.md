# Документація до проєкту "real-estate-nikas"

## 🔷 Загальна інформація

"real-estate-nikas" — це повноцінна платформа для роботи ріелторської контори. Проєкт має клієнтську частину (React.js) і серверну частину (Nest.js). У проєкті реалізована аутентифікація, авторизація, розмежування доступів, структура за ролями, логування, робота зі статичними файлами.

---

## 📁 Структура проєкту

```
root/
├── client/           # React фронтенд
├── server/           # Nest бекенд
├── docs/             # Документація
└── README.md         # Загальний опис проєкту
```

---

## 🌐 Клієнтська частина (`client/`)

### Основна структура `client/src`

- **app/** — логіка додатку: маршрутизація, авторизація, глобальні сервіси.
- **assets/** — зображення, шрифти тощо.
- **components/** — реюзабельні UI-компоненти.
- **helpers/** — утилітарні функції.
- **hooks/** — кастомні хуки React.
- **layouts/** — шаблони сторінок (наприклад, Layout із хедером).
- **models/** — типи інтерфейсів (наприклад, IUser).
- **modules/** — складні модулі, які включають логіку, UI, API (наприклад, для адміністрування).
- **pages/** — сторінки, які підключаються до маршрутизатора.
- **store/** — глобальні стани (zustand).
- **types/** — глобальні типи.
- **UI/** — бібліотека власних базових UI-компонентів (Button, Input тощо).

### 🔁 `router/index.ts` — маршрутизація

```ts
export const adminRoutes: IRoute[] = [
  { path: RouteNames.MAIN, element: AdminPage },
];

export const userRoutes: IRoute[] = [
  { path: RouteNames.MAIN, element: MainPage },
];

export const publicRoutes: IRoute[] = [
  { path: RouteNames.LOGIN, element: LoginPage },
  { path: RouteNames.MAIN, element: MainPage },
];
```

📌 **Як додавати нову сторінку:**

1. Створи компонент сторінки в `pages/`.
2. Імпортуй у `router/index.ts`.
3. Додай маршрут у відповідний масив (publicRoutes / userRoutes / adminRoutes).

### 🔐 `useAuthStore.ts` — zustand store

- Зберігає інформацію про поточного користувача (роль, статус авторизації, ім’я тощо).
- Містить методи: `login`, `logout`, `checkAuth`.
- Під час логіна токен декодується та зберігається у локальному сховищі.

✅ **Використовується для перевірки ролей і логіки відображення інтерфейсу.**

### 🧩 Принципи роботи з фронтом

- ❗ Уся бізнес-логіка (запити, обробка даних, розрахунки) виноситься в `store/`, `services/`, `helpers/`.
- ❗ UI-компоненти — лише для виведення інтерфейсу.
- ❗ Декомпозуйте логіку: не створюйте прихованих залежностей між компонентами.
- ❗ Використовуйте модульну структуру — не розміщуйте код "де прийшлось".

### 🚧 Що далі?

Найближчим часом буде реалізовано головну сторінку — приклад чистої, модульної архітектури.

---

## 🖥️ Серверна частина (`server/`)

### Структура `server/src`

- **dto/** — Data Transfer Object-и.
- **user/** — контролери, моделі, сервіси для користувача.
- **token/** — логіка токенів.
- **role/** — перевірка ролей.
- **files/** — робота зі статичними файлами (див. нижче).
- **logger/** — winston-логер.
- **http-exception.filter.ts** — глобальний фільтр помилок.
- **app.module.ts** — кореневий модуль.
- **main.ts** — вхідна точка.

### 🖼️ Робота зі статичними файлами

Файл `files.service.ts` реалізує завантаження/видалення статичних файлів у папку `static/`. NestJS вже налаштований для обробки статичних ресурсів.

📍 Завантаження:

```ts
const fileName = uuid.v4() + path.extname(file.originalname);
await fs.promises.writeFile(...);
```

### 📑 Ролі та захист маршрутів

Для захисту роутів:

```ts
@Roles(['admin'])
@UseGuards(RoleGuard)
```

### 📂 `.development.env`

Налаштування середовища:

```
AUTO_LOAD_MODELS=true
PORT=5001
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DB=real_estate_uni
JWT_ACCESS_SECRET=123
JWT_REFRESH_SECRET=321
JWT_SECRET=321
STATIC_URL=http://localhost:5001/
```

---

## 📝 Логування

Файл `logger.service.ts` використовує `winston` з ротацією логів і підтримкою часової зони.

```ts
new winston.transports.DailyRotateFile({
  dirname: "logs",
  filename: "%DATE%-app.log",
  maxFiles: "14d",
});
```

Методи: `log`, `warn`, `error` — логують у консоль і файл одночасно.

---
