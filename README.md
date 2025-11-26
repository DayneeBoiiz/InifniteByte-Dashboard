# InfiniteByte Dashboard

A full-stack dashboard application built as part of a technical assignment.

This project implements **user authentication**, **daily usage limits**, and **data visualization** for agencies and contacts — built with **Next.js 16**, **Clerk**, **PostgreSQL**, **Prisma**, and deployed on **Vercel**.

---

## 🚀 Features

### 🔐 Authentication (Clerk)
- Secure login and session management using Clerk.
- Middleware-protected routes (`/dashboard`, `/agency`, `/contacts`).
- Custom sign-in and sign-up pages.

### 🗂 Agencies Dashboard
- Fetches all agencies from the database.
- Displays them in a fully responsive table with sorting and filtering.

### 👥 Contacts Dashboard
- Displays employee/contact data linked to each agency.
- Users are **limited to 50 contacts per day**.
- If limit is exceeded → user sees an **upgrade prompt** (no payment required).

### 📊 UI Components
- Built using **shadcn/ui**, TailwindCSS, and custom components.
- Dark mode support.
- Loading indicators, top progress bar, and smooth navigation.

### 🌐 Deployment
- Fully deployed on **Vercel**.

---

See [System Architecture](docs/ARCHITECTURE.md) for detailed flow diagrams.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19 |
| Styling | TailwindCSS, shadcn/ui |
| Authentication | Clerk |
| Deployment | Vercel |

---