# 💻 Developer & Operations Guide

This guide describes how to set up the **AI Proposal Generator** development environment, manage environment variables, understand the package architecture, configure PDF printing, and execute multi-platform deployments.

---

## 1. Quick-Start Setup

### Prerequisites
- **Node.js** $\ge 18.0.0$ (Recommended: LTS version)
- **npm** $\ge 9.0.0$
- A modern web browser (Google Chrome or Microsoft Edge recommended for printing compatibility)

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd Proposal-Generation-Agent-main/Proposal-Generation-Agent-main
   ```
2. Install npm package dependencies:
   ```bash
   npm install
   ```
3. Initialize the environment file:
   ```bash
   cp .env.example .env
   ```

### Configuration
Edit the newly created `.env` file and add your credentials:
```env
# Gemini API Key (Required for requirements refinement)
VITE_GEMINI_API_KEY=AIzaSyYourGeminiAPIKeyHere

# Groq API Key (Required for Phase 1 & Phase 2 proposal engine)
VITE_GROQ_API_KEY=gsk_YourGroqAPIKeyHere

# Optional Azure/Firebase Configurations (If using production database sync)
VITE_FIREBASE_API_KEY=AIzaSyFirebaseKey...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:123456:web:abcd
```

---

## 2. Command Line Interface

The project utilizes standard Vite build scripts configured in `package.json`:

```bash
# 1. Spin up the local development web server (http://localhost:5173)
npm run dev

# 2. Compile and optimize the project for production (outputs bundle to dist/)
npm run build

# 3. Preview the production compilation locally (http://localhost:4173)
npm run preview
```

---

## 3. PDF Print Engine Configuration

The app exports proposals to A4 print-ready PDFs using the browser's native **`window.print()`** engine combined with customized print CSS rules located in `src/styles/print.css`.

> [!WARNING]
> **Essential Browser Export Settings**
> When exporting your generated proposal, you MUST verify these browser settings in the print prompt:
> 1. **Destination**: Select **Save as PDF** or **Microsoft Print to PDF**.
> 2. **Paper Size**: Select **A4** (210mm × 297mm).
> 3. **Margins**: Set to **None** (margins are handled explicitly by `PageWrapper.jsx` padding).
> 4. **Options**: Check the box for **Background graphics** (this ensures card themes, highlights, and colored borders render correctly).
> 5. **Headers and Footers**: Uncheck this box (to hide browser-injected timestamps, page count, and URLs).

---

## 4. Multi-Platform Deployment Blueprints

### A. Vercel (Recommended)
Vercel automatically detects the Vite config and deploys static assets instantly.
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Trigger the deployment:
   ```bash
   vercel --prod
   ```
3. Set your environment variables in the Vercel dashboard: **Settings ➔ Environment Variables** (add `VITE_GEMINI_API_KEY` and `VITE_GROQ_API_KEY`).

---

### B. Azure Static Web Apps (CI/CD)
Azure compiles the app in GitHub Actions CI/CD.
1. In the [Azure Portal](https://portal.azure.com/), create a new **Static Web App**.
2. Link your GitHub repository, selecting **Vite** as the build preset:
   - **App location**: `/`
   - **Output location**: `dist`
3. Add your `VITE_GROQ_API_KEY` and `VITE_GEMINI_API_KEY` to the repository **Secrets & Variables ➔ Actions**.
4. Configure the YAML deployment workflow (`.github/workflows/azure-static-web-apps-xxx.yml`):
   ```yaml
   with:
     azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
     repo_token: ${{ secrets.GITHUB_TOKEN }}
     action: "upload"
     app_location: "/"
     output_location: "dist"
   env:
     VITE_GROQ_API_KEY: ${{ secrets.VITE_GROQ_API_KEY }}
     VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
     # (Add Firebase environment keys here if applicable)
   ```

---

### C. Docker Containerization
To deploy as a self-contained container using an Nginx web server:
1. Create a `Dockerfile` in the root:
   ```dockerfile
   # Stage 1: Build the SPA
   FROM node:18-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   ARG VITE_GROQ_API_KEY
   ARG VITE_GEMINI_API_KEY
   ENV VITE_GROQ_API_KEY=$VITE_GROQ_API_KEY
   ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
   RUN npm run build

   # Stage 2: Serve using Nginx
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```
2. Build and run the image:
   ```bash
   docker build --build-arg VITE_GROQ_API_KEY=gsk_xxx --build-arg VITE_GEMINI_API_KEY=AIza_xxx -t proposal-generator .
   docker run -p 8080:80 proposal-generator
   ```
