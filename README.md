# 👶 PediTrack Pro — Advanced Pediatric Monitoring & Analytics Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Firebase](https://img.shields.io/badge/Firebase-11.9-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

PediTrack Pro is an advanced, premium, and feature-rich **Pediatric Monitoring and Clinical Growth Analytics Platform** designed for parents, pediatricians, and public health practitioners. Built using modern web design principles—featuring clean glassmorphic components, fluid responsive grids, smooth animations, and dual-theme compatibility—it delivers high-precision clinical tracking directly in the browser.

The platform relies on the **World Health Organization (WHO) Child Growth Standards** (LMS method) and the **American Academy of Pediatrics (AAP) / American Heart Association (AHA) Clinical Practice Guidelines** for blood pressure classification to provide reliable, precise, and instantly actionable insights.

---

## 🗺️ Table of Contents
1. [🌟 Core Features](#-core-features)
2. [🩺 Clinical Calculations & Engines](#-clinical-calculations--engines)
3. [🌐 Multi-Language & Internationalization](#-multi-language--internationalization)
4. [🛠️ Tech Stack & Architecture](#%EF%B8%8F-tech-stack--architecture)
5. [📦 Installation & Local Setup](#-installation--local-setup)
6. [🚀 Deploying to GitHub Pages](#-deploying-to-github-pages)
7. [📂 Project Directory Structure](#-project-directory-structure)
8. [✍️ Creator & Contact Info](#%EF%B8%8F-creator--contact-info)

---

## 🌟 Core Features

- **🩺 Pediatric Blood Pressure Analyzer**
  - Evaluates pediatric blood pressure based on age, biological sex, and height percentile.
  - Classifies readings into **Hypotension**, **Normal**, **Elevated**, **Stage 1 Hypertension**, or **Stage 2 Hypertension** following AAP guidelines.
- **📈 Comprehensive WHO Growth Trackers (0–19 Years)**
  - **Height-for-Age (HFA)**: Stature monitoring relative to peers.
  - **Weight-for-Age (WFA)**: Identifying underweight or overweight milestones.
  - **Weight-for-Length (WFL)**: Stature-independent assessment for infants (< 2 years).
  - **Weight-for-Height (WFH)**: Wasting and acute malnutrition indicators for toddlers/preschoolers.
  - **BMI-for-Age (BFA)**: Core pediatric obesity screening.
  - **Head Circumference-for-Age (HCFA)**: Vital neurodevelopmental monitoring.
  - **Arm Circumference-for-Age (MUAC)**: Critical public health malnutrition screening.
  - **Skinfolds-for-Age (Triceps TSFA & Subscapular SSFA)**: Precision subcutaneous fat distribution analysis.
- **📊 Interactive LMS Growth Charts**
  - Displays beautiful, responsive, and dynamic line charts showing standard deviation (SD) curves (`-3SD`, `-2SD`, `0SD/Median`, `+2SD`, `+3SD`).
  - Plots patient-specific measurements directly against population reference curves.
- **⚡ Unified Command Menu (`⌘K` / `Ctrl+K`)**
  - Instantly search all medical calculators, switch routes, and toggle application actions.
- **🌓 Adaptive Theme Engine**
  - Gorgeous responsive design with fluid dark and light modes, soft gradients, and high contrast visibility.
- **💾 Local State & Saved History**
  - All calculation history is stored locally in the browser's state engine (Zustand), allowing practitioners to manage and review historical patient calculations without external databases.

---

## 🩺 Clinical Calculations & Engines

### 1. The LMS Growth Calculation Engine
Under the hood, PediTrack Pro implements the **WHO LMS Method** for calculating Z-scores and percentiles. The Z-score ($Z$) is computed using:

$$Z = \frac{\left(\frac{y}{M}\right)^L - 1}{L \times S}$$

Where:
- $y$ is the actual patient measurement.
- $L$ is the Box-Cox power transformation parameter (controls skewness).
- $M$ is the median parameter.
- $S$ is the coefficient of variation parameter.

If $L = 0$, the engine automatically falls back to the logarithmic form:

$$Z = \frac{\ln(y/M)}{S}$$

This allows precise tracking of extreme growth values far exceeding standard lookup tables.

### 2. Blood Pressure Percentile Classification Engine
Pediatric blood pressure depends strictly on height. The analyzer first determines the child's height-for-age percentile using the LMS engine. It then interpolates systolic and diastolic percentiles from the clinical datasets (AAP reference standards), matching them dynamically to categorize cardiovascular risk.

---

## 🌐 Multi-Language & Internationalization
To facilitate global health screening, PediTrack Pro has **first-class multilinguality** built in. The translation engine supports:
- 🇺🇸 **English** (Standard Clinical Terminology)
- 🇪🇹 **Amharic (አማርኛ)** (Fully translated indicators and descriptions)
- 🇪🇹 **Tigrinya (ትግርኛ)** (Fully translated indicators and descriptions)

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15](https://nextjs.org/) (utilizing Static Site Generation / Static Export)
- **UI & Layout**: [React 19](https://react.dev/), [Tailwind CSS 3](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Data Visualization**: [Recharts](https://recharts.org/) (beautiful vector charts with high-performance rendering)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with persistent storage)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integrations**: [Google Genkit](https://firebase.google.com/docs/genkit) (prepared for Gemini 2.5/3.5)

---

## 📦 Installation & Local Setup

### Prerequisites
- Node.js (v18.0.0 or higher, v20+ recommended)
- npm (v9.0.0 or higher)

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/TsegayDev/PediTrack-Pro.git
   cd PediTrack-Pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) in your browser to view the application running locally.

4. **Verify types and build locally:**
   ```bash
   npm run build
   ```
   This generates a static build inside the `/out` directory, verifying that all TS and JSX exports compile correctly.

---

## 🚀 Deploying to GitHub Pages

PediTrack Pro is optimized to be deployed seamlessly to **GitHub Pages** as a fully static application.

### 🤖 Automatic CI/CD Deployment (GitHub Actions)
We have included a production-grade GitHub Actions workflow (`.github/workflows/deploy.yml`) that automates the entire process.

1. **Create your GitHub repository:** Create a new repository named `PediTrack-Pro` (or any custom name) on your GitHub account (`TsegayDev`).
2. **Push the codebase to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PediTrack Pro deployment ready"
   git branch -M main
   git remote add origin https://github.com/TsegayDev/PediTrack-Pro.git
   git push -u origin main
   ```
3. **Configure Pages Settings on GitHub:**
   - Go to your repository settings page on GitHub.
   - Click on the **Pages** menu on the left sidebar.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. **Sit back and watch it deploy!** The workflow will automatically:
   - Identify your repository name.
   - Inject the repository name dynamically into the Next.js `basePath` configuration (resolving assets issues automatically!).
   - Compile and build the Next.js app in static export mode (`output: 'export'`).
   - Deploy the compiled files under the `out/` folder to GitHub Pages.
   - Your site will be online at: **`https://tsegaydev.github.io/PediTrack-Pro/`**

> [!NOTE]
> If you deploy this project to your main user-level page (i.e. to a repository named **`TsegayDev.github.io`**), our dynamic Next.js configuration will automatically detect this and serve the application from the root path (`/`), with no subdirectory required!

---

## 📂 Project Directory Structure

```text
PediTrack-Pro/
├── .github/workflows/   # Automated CI/CD configurations
│   └── deploy.yml       # GitHub Actions deploy script for static GitHub Pages
├── public/              # Static assets, logos, manifest, and icons
├── src/
│   ├── ai/              # AI plugins & Google Genkit configuration
│   ├── app/             # Next.js App Router (Layouts & specific indicator pages)
│   ├── components/      # UI components (Shared widgets, growth charts, commands)
│   │   ├── navigation/  # App sidebar, navigation layouts
│   │   ├── ui/          # Radix & Shadcn custom primitives
│   │   └── unified-growth-chart.tsx # Core Recharts overlay visualizer
│   ├── context/         # React Contexts (Language provider, hooks)
│   ├── data/            # WHO Growth Standards reference databases (JSON formats)
│   ├── engines/         # Heavy calculations (WHO LMS engine, BP classifier)
│   │   ├── growth.ts    # Main LMS calculation and SD curve values
│   │   └── blood-pressure.ts # BP percentiles calculation
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Shared typescript types, utilities, constants
│   ├── locales/         # Multi-language files (English, Amharic, Tigrinya translations)
│   └── store/           # Zustand persistent state logs (Calculation history)
├── next.config.ts       # Specialized Next.js configuration (static output, basePath)
├── tailwind.config.ts   # Core styles and design tokens
├── package.json         # Dependencies and package scripts
└── README.md            # Detailed documentation
```

---

## ✍️ Creator & Contact Info

If you have any questions, feedback, or would like to integrate this clinical engine into other public health platforms, feel free to reach out:

- **Developer**: **Tsegay Gebrekidan**
- **GitHub Profile**: [TsegayDev](https://github.com/TsegayDev)
- **Email**: [tsegaydev@gmail.com](mailto:tsegaydev@gmail.com)
- **Phone**: [+251 94 635 1205](tel:+251946351205)
- **Location**: Ethiopia 🇪🇹
