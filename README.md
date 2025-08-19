# ZeroBug — Issue Tracker

A full-stack issue tracker built with **Next.js (App Router)**, **TypeScript**, **Prisma**, **MySQL**, **NextAuth**, **TailwindCSS** and **HeroUI**.  
The project structure follows the Next.js App Router conventions and was bootstrapped with `create-next-app`.

---

## ✨ Features

- 🔐 Authentication with **NextAuth** (credentials)
- 👥 User management & protected routes via middleware
- 🐞 Full Issues CRUD (create, list, edit, delete)
- 👤 Assign issues to users
- 🎨 UI with **TailwindCSS** + **HeroUI**
- 🗃️ **Prisma ORM** with **MySQL** backend
- ⚙️ Configured for local development & easy deploy

---

## 🧱 Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript  
- **UI:** TailwindCSS, HeroUI  
- **Auth:** NextAuth (JWT)  
- **Database:** MySQL + Prisma ORM  
- **Tooling:** ESLint, PostCSS, npm/yarn/pnpm

---

## 📁 Project Structure

- app/ # Next.js App Router pages & routes
- prisma/ # Prisma schema & migrations
- public/ # Static assets
- middleware.ts # Auth & route protection
- next.config.js # Next.js config
- tailwind.config.ts # Tailwind config
- postcss.config.js # PostCSS config

---

## 🚀 Getting Started


### 1. Prerequisites
- **Node.js** 18+
- **MySQL** 8.x (local or remote)

### 2. Clone & install
```bash
git clone https://github.com/RoyNaor/ZeroBug.git
cd ZeroBug
npm install
# or: pnpm install / yarn install
```
### 3. Environment Variables
- DATABASE_URL="mysql://<USER>:<PASSWORD>@localhost:3306/issues_tracker"
- NEXTAUTH_SECRET="<generate-a-strong-random-string>"
- NEXTAUTH_URL="http://localhost:3000"

### 4. Prisma setup
```bash
npx prisma migrate dev
# or if schema already matches DB
npx prisma db push
```
### 5. Run the app
```bash
npm run dev
```


