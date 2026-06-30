<<<<<<< HEAD
# Yourt AI — All-in-One AI Suite for YouTube Creators 🚀

=======

   `npm run dev`
# Yourt AI — All-in-One AI Suite for YouTube Creators 🚀

>>>>>>> 6254c74c4256403116b13990c16ea0a9723e7189
Yourt AI is a comprehensive, production-ready, full-stack platform designed to supercharge your YouTube production workflow. It brings together cutting-edge generative AI capabilities, real-time metrics, dynamic text generation, calendar scheduling, and automated scripts—all in a beautifully designed, high-contrast creator workspace.

---

## ✨ Features

Yourt AI provides YouTube creators with a complete digital control center:

- **💡 Idea Generator:** Instantly brainstorm high-performing video concepts, angles, and structures tailored to your target niche.
- **🪝 Hook Generator:** Craft high-retention opening hooks specifically engineered for YouTube Shorts, Reels, and TikToks.
- **📝 Script Generator:** Write full script outlines, intros, body segments, and high-conversion call-to-actions (CTAs) for different format lengths.
- **🏷️ Title & Hashtag Generators:** Generate optimized, viral-worthy titles paired with real-time CTR (Click-Through Rate) style analyses, and search-optimized tags.
- **📊 Trend Analyzer:** Gain immediate insight into rising search queries, high-utility video structures, and performance estimates.
- **📅 Interactive Content Calendar:** Seamlessly schedule and drag-and-drop your generated assets into an intuitive scheduling interface.
- **💬 Creator AI Assistant (Chat Widget):** A context-aware chatbot acting as your personal production consultant to answer questions, rewrite scripts, and advise on video strategies.
- **🔒 Full Auth & Persistence Engine:** Powered by Firebase Authentication and Firestore to keep your custom profiles, saved ideas, calendar events, and custom tokens synced across devices.
- **💳 Token & Top-up Economy:** Fully configured Stripe-ready token balance model allowing seamless mock credit purchases, upgrades, and API setups.

---

## 🛠️ Built-With (Tech Stack)

The platform utilizes a modern, robust, and highly optimized full-stack architecture:

- **Frontend:** [React 19](https://react.dev/) + [Vite 6](https://vite.dev/) for instantaneous page transitions and premium client-side rendering.
- **Backend:** [Express](https://expressjs.com/) serving API endpoints, securely proxying Gemini requests, and handling user sessions.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with a sleek, high-contrast slate dashboard theme.
- **AI Core:** Official [`@google/genai`](https://github.com/google/generative-ai-js) TypeScript SDK utilizing the ultra-fast `gemini-2.5-flash` model.
- **Database & Authentication:** [Firebase Firestore](https://firebase.google.com/) and [Firebase Auth](https://firebase.google.com/docs/auth).
- **Animations:** [Motion (React v12)](https://motion.dev/) for professional micro-interactions, spring animations, and tab transitions.
- **Charts & Data Viz:** [Recharts](https://recharts.org/) for data analysis graphs, visual CTR estimations, and trend maps.
- **Build System:** Bundled backend routing utilizing [esbuild](https://esbuild.github.io/) compiling TypeScript into high-speed, self-contained ESM files.

---

## 🚀 Getting Started

To get Yourt AI running on your local machine, follow these steps:

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed.

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/yourt-ai.git
cd yourt-ai
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

Create a `.env` file in the root directory (using `.env.example` as a template):

<<<<<<< HEAD
```env
# Gemini API Configuration (Server-side Only)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (Optional Fallbacks Available)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
=======
>>>>>>> 6254c74c4256403116b13990c16ea0a9723e7189

### 5. Running the Application

To run the full-stack development server (using `tsx` to run the Express and Vite dev servers concurrently):

```bash
npm run dev
```

The application will be accessible at **`http://localhost:3000`**.

---

## 🏗️ Production Build & Deployment

To bundle the application for production:

```bash
npm run build
```

This command executes two things:
1. Compiles the frontend assets via `vite build` into the static `/dist` directory.
2. Compiles and bundles the TypeScript backend (`server.ts`) via `esbuild` into a self-contained, optimized CommonJS file at `dist/server.cjs`.

To run the production server:

```bash
npm run start
```

### Deploying to Platforms

#### Vercel
This project includes a tailored `vercel.json` and is ready to be imported into **Vercel** with zero-configuration serverless api proxying:
1. Import your GitHub repository to Vercel.
2. Add your environment variables (`GEMINI_API_KEY`, etc.) in the Vercel dashboard.
3. Deploy!

#### Cloud Run / Docker
Because of the self-contained production start commands, you can easily wrap this directory into a Dockerfile running:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
