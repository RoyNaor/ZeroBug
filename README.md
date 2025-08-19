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

