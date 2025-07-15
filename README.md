# NewsHub Payment Integration Platform

A modern, full-stack web application for news access and subscription management, featuring secure Stripe payments, user authentication, and a beautiful dashboard experience.

---

## Features

- 🔒 User Authentication (Email/Password & Google OAuth)
- 📰 Latest News (Indian & World, via NewsAPI)
- 💳 Subscription Management (Stripe integration)
- 🧾 Payment Verification & Webhooks
- 🏷️ Plan Management (configurable plans)
- 📱 Responsive, modern UI (Dashboard & Home)
- 🌗 Dark/Light Theme Support (default: dark)
- 🛡️ Secure API endpoints (Next.js API routes)

---

## Tech Stack

- **Framework:** [Next.js 13+ App Router](https://nextjs.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **UI:** [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Auth:** [NextAuth.js](https://next-auth.js.org/)
- **News:** [NewsAPI](https://newsapi.org/)

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- PostgreSQL database
- Stripe, NewsAPI, and Google OAuth credentials

### Installation

1. **Clone or Extract the Project**
   ```bash
   git clone https://github.com/DheerajBaheti06/payment_integration.git
   cd payment_integration
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in all required variables:
     - `DATABASE_URL` (Postgres connection string)
     - `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
     - `NEWS_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
     - `NEXT_PUBLIC_APP_URL` (e.g. http://localhost:3000)
4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

---

## Usage Overview

- **Sign Up/Login:**
  - Email/password or Google OAuth
- **Browse News:**
  - Indian news (free), World news (premium)
- **Subscribe:**
  - Choose a plan on the Pricing page, pay via Stripe
- **Dashboard:**
  - View news, manage subscription, toggle theme
- **Sign Out:**
  - Securely log out from the dashboard

---

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth session secret
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `NEWS_API_KEY` - NewsAPI key
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` - Stripe keys
- `NEXT_PUBLIC_APP_URL` - Base URL for callbacks

---

## API Endpoints (Key)

- `/api/auth/[...nextauth]` - Auth (NextAuth.js)
- `/api/create-checkout-session` - Stripe checkout session
- `/api/verify-payment` - Payment verification
- `/api/subscription` - Get/update user subscription
- `/api/user-subscription` - Get current user's subscription
- `/api/webhooks/stripe` - Stripe webhook handler
- `/api/users` - (Authenticated) List users

---

## Payment & Subscription Flow

1. **User selects a premium plan** on the Pricing page
2. **Stripe Checkout** is launched for payment
3. **On success:**
   - User is redirected to `/payment/success`
   - Stripe webhook updates subscription in DB
4. **On failure/cancel:**
   - User is redirected to `/payment/failure`
5. **Subscription status** is checked on dashboard/news access

---

## Plan Management

- All plans are defined in `src/config/plans.js`
- To add/edit/remove plans, update this file and redeploy

---

## Testing Payments

- Use Stripe test cards (e.g. `4242 4242 4242 4242`)
- See Stripe docs for more test scenarios

---

## Deployment

1. Set up a production PostgreSQL database
2. Set all environment variables in your host
3. Use live Stripe keys and webhook URL
4. Build and start:
   ```bash
   npm run build
   npm start
   ```

---

## Author

- Dheeraj Baheti

---

## License

Author
   -DHEERAJ BAHETI
   This project is for educational/demo purposes. Contact the author for production/commercial use.
