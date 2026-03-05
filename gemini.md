# 🏋️ Zyra fit — Master Build Specification

### Premium Full-Stack Fitness & Nutrition Tracker

*A Vibecoding Master Prompt — Next.js + Vite + React + TypeScript*

---

## 0. Vision Statement

Build **Zyra fit** — a premium, mobile-first, full-stack fitness and nutrition tracker that feels like a $20/month SaaS app but is 100% free to host. The aesthetic is  **"True Dark Operator"** : near-black surfaces, electric neon-lime (#C8FF00) and neon-red (#FF3B3B) accents, sharp geometric typography, and fluid micro-animations that reward every tap. Think: a fighter pilot's HUD crossed with a high-end fitness studio's app.

---

## 1. Tech Stack

### Frontend

| Layer          | Technology                            | Rationale                                 |
| -------------- | ------------------------------------- | ----------------------------------------- |
| Framework      | **Next.js 14**(App Router)      | SSR, file-based routing, API routes       |
| Build Tool     | **Vite**(via Next.js Turbopack) | Blazing fast HMR                          |
| Language       | **TypeScript 5**                | Full type safety                          |
| Styling        | **Tailwind CSS v3**             | Utility-first, mobile-first breakpoints   |
| UI Components  | **shadcn/ui**(customised)       | Headless, fully themeable                 |
| Animation      | **Framer Motion**               | Production-grade animations               |
| Charts         | **Recharts**                    | React-native charting                     |
| Forms          | **React Hook Form + Zod**       | Type-safe validation                      |
| State          | **Zustand**                     | Lightweight global state                  |
| Data Fetching  | **TanStack Query v5**           | Server state, caching, optimistic updates |
| Icons          | **Lucide React**                | Consistent icon set                       |
| Date Utilities | **date-fns**                    | Lightweight date manipulation             |

### Backend

| Layer        | Technology                                  | Rationale                            |
| ------------ | ------------------------------------------- | ------------------------------------ |
| API Routes   | **Next.js API Routes**(`/app/api/`) | Serverless, co-located with frontend |
| Database ORM | **Prisma**                            | Type-safe DB queries, migrations     |
| Database     | **PostgreSQL via Neon.tech**          | Free tier, serverless Postgres       |
| Auth         | **NextAuth.js v5 (Auth.js)**          | Free, supports Google + credentials  |
| File Storage | **Cloudinary (free tier)**            | Profile image uploads                |

### External APIs

| API                                | Usage                            | Free Tier               |
| ---------------------------------- | -------------------------------- | ----------------------- |
| **Edamam Food Database API** | Food search, macro data          | 10k calls/month         |
| **Wger REST API**            | Exercise database, muscle groups | Fully free, open source |

### Hosting (100% Free)

| Service                  | What it hosts       |
| ------------------------ | ------------------- |
| **Vercel (Hobby)** | Next.js app         |
| **Neon.tech**      | PostgreSQL database |
| **Cloudinary**     | Profile images      |

---

## 2. Project Structure

```
apex-fit/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← Shell with sidebar/bottom-nav
│   │   ├── page.tsx                ← Daily Dashboard (home)
│   │   ├── nutrition/
│   │   │   ├── page.tsx            ← Meal Tracker
│   │   │   └── log/page.tsx        ← Food Search & Log
│   │   ├── fitness/
│   │   │   ├── page.tsx            ← Workout Logger
│   │   │   └── cardio/page.tsx     ← Treadmill ACSM Calculator
│   │   ├── recipes/
│   │   │   ├── page.tsx            ← Recipe Library
│   │   │   └── builder/page.tsx    ← Recipe Builder
│   │   ├── history/
│   │   │   └── page.tsx            ← Charts & Historical Data
│   │   └── profile/
│   │       └── page.tsx            ← User Profile & Settings
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── food/search/route.ts    ← Proxy to Edamam
│   │   ├── food/log/route.ts
│   │   ├── workouts/route.ts
│   │   ├── cardio/route.ts
│   │   ├── recipes/route.ts
│   │   ├── weight/route.ts
│   │   ├── dashboard/route.ts
│   │   └── exercises/route.ts      ← Proxy to Wger
│   ├── globals.css
│   └── layout.tsx                  ← Root layout, font injection
├── components/
│   ├── ui/                         ← shadcn base components (customised)
│   ├── layout/
│   │   ├── BottomNav.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── dashboard/
│   │   ├── DailyRingChart.tsx
│   │   ├── MacroProgressBars.tsx
│   │   ├── NetCaloriesCard.tsx
│   │   ├── WeightCard.tsx
│   │   └── QuickLogButton.tsx
│   ├── nutrition/
│   │   ├── MealSlot.tsx
│   │   ├── FoodSearchModal.tsx
│   │   ├── FoodItem.tsx
│   │   ├── GramInput.tsx
│   │   └── MacroBreakdownPill.tsx
│   ├── fitness/
│   │   ├── WorkoutCard.tsx
│   │   ├── ExerciseSetRow.tsx
│   │   ├── TreadmillCalculator.tsx
│   │   └── MuscleGroupBadge.tsx
│   ├── recipes/
│   │   ├── RecipeCard.tsx
│   │   └── IngredientRow.tsx
│   ├── history/
│   │   ├── WeightTrendChart.tsx
│   │   └── CalorieAverageChart.tsx
│   └── shared/
│       ├── NeonButton.tsx
│       ├── GlassCard.tsx
│       ├── PageHeader.tsx
│       ├── AnimatedNumber.tsx
│       └── LoadingSkeleton.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── edamam.ts                   ← Edamam API wrapper
│   ├── wger.ts                     ← Wger API wrapper
│   ├── acsm.ts                     ← Treadmill MET calculation
│   └── utils.ts
├── hooks/
│   ├── useDashboard.ts
│   ├── useFoodSearch.ts
│   ├── useWorkoutLogger.ts
│   └── useWeightLog.ts
├── store/
│   └── useAppStore.ts              ← Zustand store
├── types/
│   └── index.ts                    ← Shared TypeScript types
├── prisma/
│   └── schema.prisma
└── tailwind.config.ts
```

---

## 3. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String       @id @default(cuid())
  email          String       @unique
  name           String?
  image          String?
  passwordHash   String?
  // User-defined nutrition targets
  dailyCalGoal   Int          @default(2000)
  proteinPct     Float        @default(30)   // % of calories from protein
  carbsPct       Float        @default(40)   // % of calories from carbs
  fatPct         Float        @default(30)   // % of calories from fat
  // Physical stats
  heightCm       Float?
  createdAt      DateTime     @default(now())
  
  accounts       Account[]
  sessions       Session[]
  foodLogs       FoodLog[]
  workoutSessions WorkoutSession[]
  cardioLogs     CardioLog[]
  weightLogs     WeightLog[]
  recipes        Recipe[]
  mealSlots      MealSlot[]
}

model MealSlot {
  id       String    @id @default(cuid())
  name     String    // e.g. "Breakfast", "Pre-workout", "Dinner"
  order    Int       @default(0)
  userId   String
  user     User      @relation(fields: [userId], references: [id])
  foodLogs FoodLog[]
}

model FoodLog {
  id           String    @id @default(cuid())
  userId       String
  mealSlotId   String?
  date         DateTime  @default(now())
  // Food data snapshot (from Edamam or recipe)
  foodName     String
  edamamFoodId String?
  grams        Float
  calories     Float
  proteinG     Float
  carbsG       Float
  fatG         Float
  fiberG       Float?
  // Optionally linked to a recipe
  recipeId     String?
  
  user         User      @relation(fields: [userId], references: [id])
  mealSlot     MealSlot? @relation(fields: [mealSlotId], references: [id])
  recipe       Recipe?   @relation(fields: [recipeId], references: [id])
}

model Recipe {
  id          String           @id @default(cuid())
  userId      String
  name        String
  description String?
  servings    Int              @default(1)
  createdAt   DateTime         @default(now())
  
  user        User             @relation(fields: [userId], references: [id])
  ingredients RecipeIngredient[]
  foodLogs    FoodLog[]
}

model RecipeIngredient {
  id           String  @id @default(cuid())
  recipeId     String
  foodName     String
  edamamFoodId String?
  grams        Float
  calories     Float
  proteinG     Float
  carbsG       Float
  fatG         Float
  
  recipe       Recipe  @relation(fields: [recipeId], references: [id], onDelete: Cascade)
}

model WorkoutSession {
  id        String        @id @default(cuid())
  userId    String
  date      DateTime      @default(now())
  name      String?       // e.g. "Push Day", "Leg Day"
  notes     String?
  
  user      User          @relation(fields: [userId], references: [id])
  exercises WorkoutExercise[]
}

model WorkoutExercise {
  id          String          @id @default(cuid())
  sessionId   String
  wgerExId    Int?            // Wger exercise ID
  exerciseName String
  sets        WorkoutSet[]
  
  session     WorkoutSession  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
}

model WorkoutSet {
  id         String          @id @default(cuid())
  exerciseId String
  setNumber  Int
  reps       Int?
  weightKg   Float?
  
  exercise   WorkoutExercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
}

model CardioLog {
  id            String   @id @default(cuid())
  userId        String
  date          DateTime @default(now())
  type          String   @default("treadmill")
  // ACSM Treadmill inputs
  speedKmh      Float
  inclinePct    Float    @default(0)
  durationMin   Float
  weightKg      Float    // body weight at time of log
  // Calculated outputs
  metValue      Float
  vo2           Float    // mL/kg/min
  caloriesBurned Float
  
  user          User     @relation(fields: [userId], references: [id])
}

model WeightLog {
  id       String   @id @default(cuid())
  userId   String
  date     DateTime @default(now())
  weightKg Float
  notes    String?
  
  user     User     @relation(fields: [userId], references: [id])
}

// NextAuth required models
model Account { ... }
model Session { ... }
```

---

## 4. Brand & Design System

### 4.1 Color Palette

```css
/* globals.css — CSS Custom Properties */
:root {
  /* True Dark Surfaces */
  --bg-void:        #0A0A0A;   /* deepest bg — almost black */
  --bg-base:        #111111;   /* page background */
  --bg-surface:     #1A1A1A;   /* cards, modals */
  --bg-elevated:    #222222;   /* input fields, nested cards */
  --bg-overlay:     #2A2A2A;   /* hover states */

  /* Neon Accents */
  --neon-lime:      #C8FF00;   /* primary action, active states */
  --neon-lime-dim:  #8AAF00;   /* muted lime for secondary text */
  --neon-red:       #FF3B3B;   /* danger, calories burned, cardio */
  --neon-red-dim:   #B02828;
  --neon-cyan:      #00FFCC;   /* hydration, water tracking */
  --neon-amber:     #FFB800;   /* warnings, carbs */

  /* Text */
  --text-primary:   #F0F0F0;
  --text-secondary: #888888;
  --text-muted:     #555555;
  --text-inverse:   #0A0A0A;

  /* Borders */
  --border-subtle:  rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
  --border-accent:  rgba(200,255,0,0.30);

  /* Glows */
  --glow-lime:      0 0 20px rgba(200,255,0,0.25), 0 0 60px rgba(200,255,0,0.08);
  --glow-red:       0 0 20px rgba(255,59,59,0.25), 0 0 60px rgba(255,59,59,0.08);
  --glow-cyan:      0 0 20px rgba(0,255,204,0.20);
}
```

### 4.2 Typography

```typescript
// app/layout.tsx font configuration
import { Space_Grotesk, JetBrains_Mono, Bebas_Neue } from 'next/font/google'

// AVOID Space Grotesk as per design skill — use instead:
import { Barlow_Condensed } from 'next/font/google'
// Display / Headings: Barlow Condensed (700, 800) — aggressive, athletic
// Body: DM Sans (400, 500) — clean, modern, highly legible
// Monospace (numbers, stats): JetBrains Mono (500, 600) — precise, technical
```

**Type Scale:**

| Token            | Size | Weight | Usage                           |
| ---------------- | ---- | ------ | ------------------------------- |
| `text-display` | 72px | 800    | Hero numbers (calories, weight) |
| `text-h1`      | 32px | 700    | Page titles                     |
| `text-h2`      | 24px | 700    | Section headers                 |
| `text-h3`      | 18px | 600    | Card titles                     |
| `text-body`    | 15px | 400    | Body text                       |
| `text-caption` | 12px | 500    | Labels, metadata                |
| `text-mono`    | 14px | 500    | Stats, numbers                  |

### 4.3 Spacing System

Use Tailwind's default scale. Key rules:

* **Card padding** : `p-4` mobile → `p-6` desktop
* **Section gap** : `gap-4` mobile → `gap-6` desktop
* **Bottom nav safe area** : `pb-24` on mobile content to avoid nav overlap

### 4.4 Border Radius

```
--radius-sm:  6px    (inputs, badges)
--radius-md:  12px   (cards)
--radius-lg:  18px   (modals, bottom sheets)
--radius-xl:  24px   (feature cards)
--radius-full: 9999px (pills, buttons)
```

### 4.5 Shadow & Glow

Avoid default box shadows. Use **glow shadows** for interactive elements:

```css
.card-glow-lime  { box-shadow: 0 0 0 1px rgba(200,255,0,0.15), 0 4px 24px rgba(0,0,0,0.4); }
.card-glow-red   { box-shadow: 0 0 0 1px rgba(255,59,59,0.15), 0 4px 24px rgba(0,0,0,0.4); }
.btn-glow-active { box-shadow: 0 0 16px rgba(200,255,0,0.4); }
```

---

## 5. Animation System (Framer Motion)

### 5.1 Core Variants — define once in `lib/motion.ts`

```typescript
// lib/motion.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
}

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
}

export const numberPop = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } }
}
```

### 5.2 Interaction Micro-animations

| Interaction        | Animation                                                    |
| ------------------ | ------------------------------------------------------------ |
| Button press       | `whileTap={{ scale: 0.96 }}`                               |
| Card hover         | `whileHover={{ y: -2, boxShadow: glow }}`                  |
| Page transition    | Framer Motion `AnimatePresence`with `fadeUp`             |
| Stat number change | `AnimatedNumber`component using `motion.span`with spring |
| Modal open         | Scale from 0.95 + fade, with backdrop blur                   |
| Bottom sheet open  | `y: '100%'`→`y: 0`spring animation                      |
| Progress bar fill  | Animate `width`from 0% on mount with 0.6s ease             |
| Ring/donut chart   | SVG `strokeDashoffset`animated on mount                    |

### 5.3 Page Load Sequence

Every page follows this stagger pattern:

1. `TopBar` fades in (delay 0ms)
2. Hero/summary card slides up (delay 50ms)
3. Section cards stagger up one by one (delay 100ms + 70ms each)
4. Charts animate their data in (delay 300ms)

---

## 6. Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void:    '#0A0A0A',
        base:    '#111111',
        surface: '#1A1A1A',
        elevated:'#222222',
        overlay: '#2A2A2A',
        lime:    { DEFAULT: '#C8FF00', dim: '#8AAF00' },
        nred:    { DEFAULT: '#FF3B3B', dim: '#B02828' },
        ncyan:   '#00FFCC',
        namber:  '#FFB800',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm':  '6px',
        'md':  '12px',
        'lg':  '18px',
        'xl':  '24px',
        '2xl': '32px',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(200,255,0,0.3)' },
          '50%':       { boxShadow: '0 0 25px rgba(200,255,0,0.6)' },
        },
        'scan-line': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'scan-line':  'scan-line 4s linear infinite',
      },
      backgroundImage: {
        'grid-pattern': 
          'linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)',
        'radial-glow-lime':
          'radial-gradient(ellipse at top, rgba(200,255,0,0.08) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-md': '40px 40px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

---

## 7. Core Business Logic

### 7.1 ACSM Treadmill Calorie Calculation

```typescript
// lib/acsm.ts

/**
 * ACSM Treadmill Metabolic Equation
 * VO2 (mL/kg/min) = (speed_m_min × 0.1) + (speed_m_min × grade × 1.8) + 3.5
 * 
 * Calories burned = MET × weight_kg × (duration_hr)
 * MET = VO2 / 3.5
 */

export interface TreadmillInput {
  speedKmh: number    // e.g. 8.0
  inclinePct: number  // e.g. 5 (for 5%)
  durationMin: number // e.g. 30
  bodyWeightKg: number
}

export interface TreadmillOutput {
  vo2: number           // mL/kg/min
  met: number         
  caloriesBurned: number
  intensityLabel: 'Light' | 'Moderate' | 'Vigorous' | 'Very Vigorous'
}

export function calculateTreadmill(input: TreadmillInput): TreadmillOutput {
  const { speedKmh, inclinePct, durationMin, bodyWeightKg } = input

  // Convert speed to m/min
  const speedMMin = (speedKmh * 1000) / 60

  // ACSM formula
  const vo2 = 
    (speedMMin * 0.1) +                          // horizontal component
    (speedMMin * (inclinePct / 100) * 1.8) +     // vertical component
    3.5                                           // resting VO2

  const met = vo2 / 3.5
  const durationHr = durationMin / 60
  const caloriesBurned = met * bodyWeightKg * durationHr

  let intensityLabel: TreadmillOutput['intensityLabel']
  if (met < 3) intensityLabel = 'Light'
  else if (met < 6) intensityLabel = 'Moderate'
  else if (met < 9) intensityLabel = 'Vigorous'
  else intensityLabel = 'Very Vigorous'

  return {
    vo2: Math.round(vo2 * 10) / 10,
    met: Math.round(met * 10) / 10,
    caloriesBurned: Math.round(caloriesBurned),
    intensityLabel,
  }
}
```

### 7.2 Dynamic Macro Calculation from Grams

```typescript
// lib/macros.ts

export interface FoodPer100g {
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
  fiberPer100g: number
}

export function scaleMacros(food: FoodPer100g, grams: number) {
  const factor = grams / 100
  return {
    calories: Math.round(food.caloriesPer100g * factor),
    protein:  Math.round(food.proteinPer100g  * factor * 10) / 10,
    carbs:    Math.round(food.carbsPer100g    * factor * 10) / 10,
    fat:      Math.round(food.fatPer100g      * factor * 10) / 10,
    fiber:    Math.round((food.fiberPer100g ?? 0) * factor * 10) / 10,
  }
}
```

### 7.3 Edamam API Wrapper

```typescript
// lib/edamam.ts
const APP_ID  = process.env.EDAMAM_APP_ID!
const APP_KEY = process.env.EDAMAM_APP_KEY!
const BASE    = 'https://api.edamam.com/api/food-database/v2'

export async function searchFood(query: string) {
  const url = `${BASE}/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(query)}&nutrition-type=cooking`
  const res = await fetch(url)
  const data = await res.json()
  // Return normalized items with per-100g values
  return data.hints.map((h: any) => ({
    foodId:          h.food.foodId,
    label:           h.food.label,
    caloriesPer100g: h.food.nutrients.ENERC_KCAL ?? 0,
    proteinPer100g:  h.food.nutrients.PROCNT     ?? 0,
    carbsPer100g:    h.food.nutrients.CHOCDF     ?? 0,
    fatPer100g:      h.food.nutrients.FAT        ?? 0,
    fiberPer100g:    h.food.nutrients.FIBTG      ?? 0,
  }))
}
```

---

## 8. Pages — Detailed Specification

---

### 8.1 Auth Pages (`/login`, `/register`)

 **Layout** : Full-screen, centered card on a `bg-void` background.

 **Visual Treatment** :

* Background: `bg-grid-pattern` subtle lime grid, `bg-radial-glow-lime` at top
* Animated scan-line effect passing over the background
* Logo: "Zyra fit" in `font-display` 48px with a neon-lime underline accent
* Card: `bg-surface` with `border border-border-subtle`, `rounded-xl`, subtle glow on focus

 **Sections** :

1. **Brand Mark** — Logo + tagline "Your body. Your data. Your edge."
2. **Auth Form** — Email/password + "Continue with Google" button
3. **Footer** — "New here?" toggle between login/register

---

### 8.2 Daily Dashboard (`/`) — PRIMARY PAGE

**Mobile Layout** (< 768px): Single column scroll
**Desktop Layout** (≥ 1024px): 3-column grid

#### Sections (top to bottom, mobile):

**A. Top Bar**

* Left: Avatar + "Good morning, [Name]" greeting
* Right: Date chip + Notification bell
* Below: Horizontal date-strip (7 days, today highlighted in lime)

**B. Net Calories Hero Card**

* Full-width, `bg-surface`, `rounded-xl`
* Giant animated number: **Net Calories** (Food Eaten − Burned) in `font-display` 72px
* Formula breakdown: `[🍽 2,100 eaten] − [🔥 380 burned] = [⚡ 1,720 net]`
* Color logic: Green if under goal, Red if over goal
* Circular ring chart: `Eaten / Goal` progress with animated stroke

**C. Macro Split Row**

* 3 pill-shaped cards:  **Protein** ,  **Carbs** , **Fat**
* Each shows: `current g / target g` + animated thin progress bar
* Colors: Protein=lime, Carbs=amber, Fat=cyan

**D. Today's Weight Card**

* Compact card showing today's logged weight in kg
* Trend arrow vs. previous day (↑ red / ↓ lime)
* Inline + button to log new weight → bottom sheet

**E. Meal Summary Accordion**

* List of user's meal slots (Breakfast, Lunch, etc.)
* Each shows total calories for that slot
* Tap to expand → shows food items
* `+` button per slot to quick-log food

**F. Today's Workout Summary**

* If logged: Shows exercise count, total volume, cardio calories
* If empty: "No workout logged yet" + CTA button

**G. Quick Actions Strip**

* 4 icon buttons: Log Food | Log Workout | Log Cardio | Log Weight

---

### 8.3 Nutrition / Meal Tracker (`/nutrition`)

 **Mobile** : Scrollable page grouped by meal slots
 **Desktop** : Left panel = today's meals, Right panel = macros detail

#### Sections:

**A. Daily Summary Bar**

* Sticky at top: calories eaten / goal + mini macro progress
* Color-coded: under = lime, over = red

**B. Meal Slots**

* Each slot is a `GlassCard` with:
  * Slot name + emoji (user-configurable)
  * Slot calorie total
  * Expand/collapse list of food items
  * Each `FoodItem` row: name | grams | calories | [protein / carbs / fat chips] | delete icon
  * `+ Add Food` button → opens `FoodSearchModal`

**C. FoodSearchModal** (Bottom Sheet on mobile, Dialog on desktop)

* Search bar with debounced Edamam API call
* Results list: `FoodItem` with macros per 100g
* On select → `GramInput` appears with live macro preview
  * Slider + number input for grams
  * Live updating `MacroBreakdownPill` showing calculated macros
  * `Log to [slot]` button

**D. Meal Slot Manager**

* Link to settings where user can add/rename/reorder/delete meal slots

---

### 8.4 Food Log (`/nutrition/log`)

Lightweight page for power users who want a clean quick-log experience:

* Prominent search bar
* Recent foods grid (last 10 unique foods)
* My Recipes section (recent recipes)

---

### 8.5 Fitness Tracker (`/fitness`)

 **Mobile** : Single column, workout cards
 **Desktop** : Left = today's workout builder, Right = exercise library

#### Sections:

**A. Active Workout Session Card**

* "Start Workout" → opens an active session
* Session timer (stopwatch)
* Exercise search (powered by Wger API — searchable exercise database)
* Per exercise: `ExerciseSetRow` — set# | weight (kg) | reps | ✓ complete checkbox
* Each set row has: previous performance hint (e.g., "Last time: 60kg × 8")

**B. Recent Workouts**

* Horizontal scroll of last 5 workout cards
* Each card: date, workout name, exercise count, volume total

**C. Cardio Tab**

* `TreadmillCalculator` component:
  * Inputs: Speed (km/h), Incline (%), Duration (min), Body Weight (auto-filled from last weight log)
  * Live output panel: MET, VO2, Calories Burned, Intensity badge
  * "Log This Cardio" button

---

### 8.6 Recipe Builder (`/recipes`, `/recipes/builder`)

#### Recipe Library Page (`/recipes`):

* Grid of `RecipeCard` components
* Each card: Recipe name, total kcal per serving, macros strip, photo (optional)
* FAB (Floating Action Button) → navigate to builder

#### Recipe Builder Page (`/recipes/builder`):

**Step 1 — Details**

* Recipe name, description, number of servings

**Step 2 — Ingredients**

* Same `FoodSearchModal` flow as nutrition
* Add ingredients with gram amounts
* Running total macros panel (per serving)
* `IngredientRow`: name | grams | kcal | macros | delete

**Step 3 — Review & Save**

* Final macro breakdown card (per serving + per full recipe)
* Option to immediately log one serving to today's diary

---

### 8.7 History & Analytics (`/history`)

 **Mobile** : Swipeable tabs — Weight | Calories | Workouts
 **Desktop** : Multi-column charts layout

#### Sections:

**A. Weight Trend Chart**

* Recharts `LineChart` with smooth curves
* X-axis: dates, Y-axis: weight in kg
* Moving average line overlay (7-day)
* Data points: tappable to show exact date/value
* Range selector: 7D | 30D | 90D | All

**B. Calorie Intake Chart**

* Recharts `BarChart` — daily calories as bars
* Horizontal reference line = goal
* Color: bars are lime when under goal, red when over
* Weekly averages shown as overlay

**C. Macro Composition Chart**

* Recharts `AreaChart` — stacked area for protein/carbs/fat over time
* Toggle between absolute grams and % of total

**D. Personal Records Table**

* Top lifted weight per exercise
* Best cardio session stats

**E. Streaks & Stats**

* Longest logging streak
* Total workouts logged
* Average daily calories (last 30 days)

---

### 8.8 Profile & Settings (`/profile`)

#### Sections:

**A. Profile Header**

* Avatar (Cloudinary upload)
* Name, email
* Stats row: Height | Current Weight | Age

**B. Nutrition Targets**

* Daily Calorie Goal (number input)
* Macro split (% sliders for Protein / Carbs / Fat — must sum to 100%)
* Real-time preview: shows grams per macro at that calorie level

**C. Meal Slot Manager**

* Drag-to-reorder list of meal slots
* Add new slot / delete / rename

**D. App Settings**

* Weight unit toggle: kg / lbs
* Theme: True Dark (default) / Darker / OLED Black
* Notification preferences

**E. Account**

* Change password
* Sign out

---

## 9. Reusable Components Specification

### `GlassCard`

```tsx
// Foundational card component
interface GlassCardProps {
  children: React.ReactNode
  glow?: 'lime' | 'red' | 'cyan' | 'none'
  padding?: 'sm' | 'md' | 'lg'
  animate?: boolean // enables fadeUp entry animation
  className?: string
}
// bg-surface, border border-border-subtle, rounded-xl
// Optional glow border on hover
// Wraps children in motion.div with fadeUp if animate=true
```

### `NeonButton`

```tsx
interface NeonButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  loading?: boolean
  glow?: boolean
}
// primary:   bg-lime text-void font-display tracking-wider
// secondary: border border-lime text-lime bg-transparent
// ghost:     text-secondary hover:text-primary
// danger:    bg-nred text-white
// whileTap scale 0.96, glow on active primary
```

### `AnimatedNumber`

```tsx
// Animates from previous value to new value using Framer Motion spring
// Used for calorie totals, weight display, etc.
interface AnimatedNumberProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}
```

### `MacroBreakdownPill`

```tsx
// Shows P / C / F in compact horizontal chip
// Used in food items, recipe cards, meal slots
interface MacroBreakdownPillProps {
  protein: number
  carbs: number
  fat: number
  size?: 'xs' | 'sm' | 'md'
}
```

### `ProgressRing`

```tsx
// SVG circular progress ring
// Used for daily calorie completion on dashboard
interface ProgressRingProps {
  value: number        // 0-100
  size?: number        // diameter in px
  strokeWidth?: number
  color?: string       // CSS color
  bgColor?: string
  label?: string       // center label
  sublabel?: string
}
// Animates strokeDashoffset on mount
```

### `TreadmillCalculator`

```tsx
// Full self-contained component
// Inputs with real-time ACSM calculation output
// Uses calculateTreadmill() from lib/acsm.ts
// Shows intensity color-coded badge: Light (cyan) | Moderate (lime) | Vigorous (amber) | Very Vigorous (red)
```

### `BottomNav` (Mobile)

```tsx
// Fixed bottom navigation bar
// Items: Home | Nutrition | Fitness | History | Profile
// Active item: lime icon + label + subtle lime underline glow
// Height: 64px + iOS safe area padding
// Background: bg-surface/90 backdrop-blur-lg border-t border-border-subtle
```

### `Sidebar` (Desktop ≥ 1024px)

```tsx
// Left sidebar, 72px wide (icon-only) or 240px (expanded, hover or toggle)
// Same nav items as BottomNav but vertical
// Logo at top, avatar/settings at bottom
// Smooth width transition: 72px ↔ 240px
```

---

## 10. Mobile-First Responsive Strategy

```
Mobile  (default):      < 768px  — single column, bottom nav, bottom sheets
Tablet  (md: 768px):   768-1023px — 2-column cards, side-by-side sections
Desktop (lg: 1024px+): ≥ 1024px  — sidebar + 3-column dashboard grid
```

Key mobile UX patterns:

* **Bottom sheets** replace modals for food/workout input on mobile
* **Horizontal scroll** for date strips and recent workout cards
* **Sticky headers** with blurred backgrounds for section headers
* **Touch target minimum** : 44×44px for all interactive elements
* **Pull-to-refresh** on dashboard (using `react-pull-to-refresh`)

---

## 11. Environment Variables

```env
# .env.local

# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth (optional, from Google Cloud Console)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Edamam Food Database API (register at developer.edamam.com)
EDAMAM_APP_ID=""
EDAMAM_APP_KEY=""

# Cloudinary (optional, for profile images)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

---

## 12. Installation & Bootstrap Sequence

```bash
# 1. Create Next.js app
npx create-next-app@latest apex-fit --typescript --tailwind --app --src-dir=false

# 2. Install dependencies
npm install framer-motion recharts zustand @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install date-fns lucide-react
npm install next-auth@beta @auth/prisma-adapter
npm install @prisma/client prisma
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge

# 3. Setup shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog sheet input label progress avatar badge

# 4. Setup Prisma
npx prisma init
# Edit prisma/schema.prisma with schema above
npx prisma db push
npx prisma generate

# 5. Add Google Fonts to app/layout.tsx
# Import Barlow_Condensed, DM_Sans, JetBrains_Mono from next/font/google
```

---

## 13. Key Implementation Notes for Vibe Coder

1. **Always derive calories from grams** — never store both. On the frontend, call `scaleMacros()` reactively in a `useMemo` whenever the gram input changes.
2. **Net calories = eating − burned** — compute this in a single dashboard API route that aggregates `FoodLog` and `CardioLog` for the day, rather than on the frontend.
3. **Recipe macro summation** — when saving a recipe, sum all `RecipeIngredient` macros in the backend API. When *logging* a recipe, save a `FoodLog` entry with the summed values (scaled by portion/servings) — don't link live to the recipe so historical data is immutable.
4. **Wger API** — use `https://wger.de/api/v2/exercise/?format=json&language=2&limit=100` to build a searchable exercise database. Cache results in Zustand.
5. **Edamam always returns per-100g nutrients** in `food.nutrients`. Normalize to this format immediately and only scale to grams at display/log time.
6. **Optimistic updates** — when logging food, immediately update the TanStack Query cache with the new entry before the server confirms. This makes the app feel instant.
7. **Date handling** — always store UTC in the database. Display in user's local timezone using `date-fns` `format()` and `toLocaleDateString()`.
8. **Chart responsiveness** — wrap all Recharts in `<ResponsiveContainer width="100%" height={200}>`. The height should be 200px on mobile, 280px on desktop (`useWindowSize` hook).
9. **Loading states** — every data-fetching component must have a `LoadingSkeleton` that matches the exact shape/dimensions of the loaded content (skeleton shimmer effect using Tailwind `animate-pulse bg-elevated`).
10. **Error handling** — all API routes return `{ success: boolean, data?: T, error?: string }`. Show toast notifications using shadcn `<Sonner>` component for errors.

---

## 14. Deployment Checklist

* [ ] Neon.tech: Create free PostgreSQL database, copy `DATABASE_URL`
* [ ] `npx prisma db push` against production database
* [ ] Edamam: Register for free Food Database API keys
* [ ] Google Cloud Console: Create OAuth credentials (optional)
* [ ] Cloudinary: Create free account (optional)
* [ ] Vercel: Import GitHub repo, add all env variables
* [ ] Set `NEXTAUTH_URL` to production Vercel URL
* [ ] Test auth flow end-to-end
* [ ] Test Edamam food search
* [ ] Test treadmill calculation
* [ ] Verify mobile layout on real device

---

## 15. Stretch Features (Post-MVP)

* **Barcode scanner** (using `html5-qrcode` library) → scan food packaging → auto-populate Edamam search
* **Progress photos** timeline with Cloudinary
* **Workout templates** — save and re-use workout structures
* **Sleep logging** — simple sleep duration tracker
* **Water intake tracker** with animated hydration ring (using `--neon-cyan`)
* **AI Meal Suggestions** — send user's remaining macros to an LLM API and get food ideas
* **PWA** — `next-pwa` for installable app experience + offline support

---

*Document version: 1.0 | Created for Zyra fit vibecoding session*
*Stack: Next.js 14 App Router + TypeScript + Tailwind CSS + Prisma + Neon.tech + Vercel*
