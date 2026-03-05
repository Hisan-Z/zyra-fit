# 🏋️ Zyra fit — Premium Fitness & Nutrition Tracker

**Zyra fit** is a high-performance, mobile-first, full-stack fitness and nutrition tracker designed with a "True Dark Operator" aesthetic. It combines precise data tracking with a premium user experience, feeling like a high-end SaaS application while remaining completely free to self-host.

![Zyra Fit Dashboard Mockup](https://raw.githubusercontent.com/Hisan-Z/zyra-fit/master/public/icon.svg)

---

## ⚡ Vision & Aesthetic

- **Design Philosophy**: "True Dark Operator" — near-black surfaces, electric neon-lime (#C8FF00) and neon-red (#FF3B3B) accents.
- **Visuals**: Fluid micro-animations, glassmorphism, and sharp geometric typography (Barlow Condensed & DM Sans).
- **Core Goal**: Provide an edge in your fitness journey through precise tracking of net calories, macro splits, and technical workout data.

---

## 🚀 Key Features

### 🍽️ Nutrition Intelligence
- **Net Calories Hero**: Real-time tracking of `Food Eaten - Calories Burned`.
- **Itemized Recipe Logging**: Log complex recipes as individual ingredients for granular control.
- **Custom Foods Manager**: Build your own private database of custom ingredients and nutrition facts.
- **Edamam Integration**: Global food search powered by the Edamam API.

### 🏋️ Advanced Fitness Tracking
- **Workout Logger**: Technical resistance training tracker with volume calculations and intensity levels.
- **ACSM Cardio Calculator**: Science-based treadmill calorie estimation (VO2, METs) based on speed, incline, and body weight.
- **Progress Tracking**: Historical charts for weight trends and calorie averages.

### 📱 Mobile-First Experience
- **PWA Ready**: Install Zyra fit on your home screen for a native app feel.
- **Responsive Design**: Optimized for everything from small-screen phones to tablet dashboards.
- **Glassmorphic UI**: Premium cards and modals with backdrop blur and neon glows.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Customized)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack Query](https://tanstack.com/query/latest)
- **Charts**: [Recharts](https://recharts.org/)

### Backend
- **Database**: PostgreSQL (via [Neon.tech](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js v5](https://authjs.dev/)
- **APIs**: Edamam (Nutrition), WGER (Exercises)

---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Hisan-Z/zyra-fit.git
cd zyra-fit
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your credentials:

```env
DATABASE_URL="your_postgresql_url"
DIRECT_URL="your_direct_postgres_url"
NEXTAUTH_SECRET="your_secret"
EDAMAM_APP_ID="your_id"
EDAMAM_APP_KEY="your_key"
WGER_API_KEY="your_key"
```

### 4. Database Setup
```bash
npx prisma db push
npx prisma generate
```

### 5. Run the development server
```bash
npm run dev
```

---

## 📱 Installation (PWA)

1. Open the deployed application in your mobile browser.
2. Select **"Add to Home Screen"** from your browser options.
3. Launch **Zyra fit** directly from your app drawer.

---

## 📄 License
This project is open-source and free to host for personal use.

---

*Built with passion for the "True Dark" athlete.*
