# TaskFlow - Desafio Binario

Aplicacao full stack de lista de tarefas com autenticacao JWT, API REST e frontend em Next.js.

## Stack

- Backend: Node.js + TypeScript + Express + Prisma
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind
- Banco: PostgreSQL

## Estrutura

- `backend`: API REST com autenticacao e CRUD de tarefas
- `frontend`: interface web com login, cadastro e painel de tarefas
- `Sistemadecredito`: projeto antigo em C# mantido no repositorio

## Requisitos

- Node.js 20+
- PostgreSQL rodando localmente

## Variaveis de ambiente

### Backend (`backend/.env`)

Copie `backend/.env.example` para `backend/.env` e ajuste:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow?schema=public"
JWT_SECRET="uma-chave-forte"
PORT=3333
CORS_ORIGIN="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)

Copie `frontend/.env.example` para `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL="http://localhost:3333"
API_BASE_URL="http://localhost:3333"
```

## Como rodar localmente

### 1) Backend

```bash
cd backend
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run dev
```

API disponivel em `http://localhost:3333`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponivel em `http://localhost:3000`.

## Endpoints da API

Autenticacao:

- `POST /auth/register`
- `POST /auth/login`

Tarefas (com JWT no header `Authorization: Bearer <token>`):

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## Funcionalidades implementadas

- Cadastro e login com senha hasheada em bcrypt
- Emissao e validacao de JWT
- CRUD completo de tarefas
- Isolamento por usuario (cada usuario acessa apenas suas tarefas)
- Validacao de input com mensagens claras
- Frontend com:
  - `/login`
  - `/register`
  - `/tasks` protegida
  - criacao, conclusao e remocao de tarefas
  - filtro por status (todas, pendentes, concluidas) sem reload

## Scripts uteis

Backend:

- `npm run dev`
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:migrate`

Frontend:

- `npm run dev`
- `npm run lint`
- `npm run build`
