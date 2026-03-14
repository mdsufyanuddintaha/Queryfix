# 🎫 QueryFix — Support Ticketing System

A full-stack ticketing system built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Supabase**.

---

## ✨ Features

- 🔐 Auth (register, login, logout) via Supabase
- 🎫 Users can raise, view, and reply to tickets
- 🛡️ Admin dashboard: view all tickets, reply, change status/priority, close/reopen
- 🌗 Dark / Light theme toggle
- 📱 Fully responsive design
- 🔒 Row-Level Security on all database tables

---

## 🧱 Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Database + Auth | Supabase (free tier) |
| Hosting | Vercel (free tier) |

---

## 🚀 Step-by-Step Setup Guide

### STEP 1 — Install Node.js

Make sure you have **Node.js 18+** installed.
Check: `node -v`
Download: https://nodejs.org

---

### STEP 2 — Set Up Supabase

1. Go to https://supabase.com and click **Start for free**
2. Sign up / log in
3. Click **New Project**
   - Name: `helpdesk`
   - Set a strong database password (save it!)
   - Choose a region close to you
   - Click **Create new project** (takes ~2 min)

4. Once ready, go to **SQL Editor** (left sidebar)
5. Click **New query**
6. Open the file `supabase/schema.sql` from this project
7. Paste the entire contents and click **Run**
   - You should see: *"Success. No rows returned"*

8. Go to **Project Settings → API** (left sidebar)
9. Copy these two values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

---

### STEP 3 — Configure the Project Locally

1. Unzip / clone the project folder

2. In the project root, create a file called `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=admin@yourdomain.com
```

Replace with your actual Supabase values.

---

### STEP 4 — Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

---

### STEP 5 — Run Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see the landing page.

---

### STEP 6 — Create Your Admin Account

1. Go to http://localhost:3000/register
2. Register with your admin email address
3. Check your email for a confirmation link and click it
4. Go back to **Supabase → SQL Editor**
5. Run this query (replace with your actual email):

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin@email.com';
```

6. Now log in at http://localhost:3000/login
7. You'll be redirected to the **Admin Dashboard** at `/admin`

---

### STEP 7 — Push to GitHub

1. Create a new repository on https://github.com/new
   - Name: `helpdesk-ticketing`
   - Set to **Public** or **Private**
   - Do NOT initialize with README (we have one)
   - Click **Create repository**

2. In your terminal (inside the project folder):

```bash
git init
git add .
git commit -m "Initial commit — HelpDesk ticketing system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/helpdesk-ticketing.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

### STEP 8 — Deploy to Vercel

1. Go to https://vercel.com and sign up / log in (use "Continue with GitHub")
2. Click **Add New → Project**
3. Find and select your `helpdesk-ticketing` repository
4. Click **Import**
5. In the **Environment Variables** section, add all four variables:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your supabase service role key |
| `NEXT_PUBLIC_APP_URL` | https://your-app.vercel.app (update after deploy) |

6. Click **Deploy**
7. Wait ~2 minutes for the build to complete
8. Click **Visit** to see your live app! 🎉

---

### STEP 9 — Update Supabase Auth Redirect URLs

1. Go to Supabase → **Authentication → URL Configuration**
2. Set **Site URL** to your Vercel URL: `https://your-app.vercel.app`
3. Under **Redirect URLs**, add: `https://your-app.vercel.app/**`
4. Click Save

---

## 📁 Project Structure

```
ticketing-app/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          ← Login page
│   │   └── register/page.tsx       ← Register page
│   ├── (user)/
│   │   ├── dashboard/page.tsx      ← User dashboard
│   │   ├── tickets/page.tsx        ← All user tickets
│   │   ├── tickets/new/page.tsx    ← Create ticket
│   │   └── tickets/[id]/page.tsx   ← Ticket detail + replies
│   ├── (admin)/
│   │   ├── admin/page.tsx          ← Admin dashboard
│   │   └── admin/tickets/[id]/page.tsx ← Admin ticket view
│   ├── api/tickets/route.ts        ← REST API
│   ├── layout.tsx                  ← Root layout + theme
│   └── page.tsx                    ← Landing page
├── components/
│   ├── ui/                         ← shadcn/ui components
│   ├── shared/                     ← Navbar, badges, theme
│   ├── tickets/                    ← Reply form
│   └── admin/                      ← Ticket actions
├── lib/
│   ├── supabase/                   ← Supabase client/server
│   └── utils.ts                    ← Helpers
├── hooks/use-toast.ts              ← Toast hook
├── types/index.ts                  ← TypeScript types
├── supabase/schema.sql             ← Database schema
├── middleware.ts                   ← Route protection
└── .env.example                    ← Env template
```

---

## 🔄 How It Works

**User Flow:**
1. User registers → auto-profile created
2. User logs in → redirected to `/dashboard`
3. User clicks "New Ticket" → fills form → submitted to Supabase
4. User can view ticket thread and add replies
5. Ticket status updates visible in real time

**Admin Flow:**
1. Admin logs in → redirected to `/admin`
2. Admin sees all tickets with filtering by status
3. Admin opens a ticket → views thread → replies
4. Admin can change status (open/pending/closed) and priority
5. Admin closes ticket → user sees "Ticket closed" message

---

## 🛠️ Future Enhancements

- Email notifications via Resend when tickets are updated
- File attachments on tickets
- Real-time updates via Supabase Realtime
- Ticket search and filtering
- Export tickets to CSV
- Multi-admin support with notes

---

## 🆘 Troubleshooting

**"relation does not exist" error** → Re-run `supabase/schema.sql` in SQL Editor

**Infinite redirect loop** → Check your `.env.local` values are correct

**Admin not redirecting** → Make sure you ran the UPDATE query to set your role

**Build fails on Vercel** → Confirm all 4 env vars are added in Vercel dashboard

---

Built with ❤️ using Next.js 15, TypeScript, Tailwind CSS, shadcn/ui & Supabase.
