# 💸 OptiToken: Zero-Friction AI FinOps Dashboard

Stop guessing who burned your API credits. **OptiToken** is a lightweight, self-hosted dashboard that connects to your AI providers (OpenAI, Anthropic) and gives you a unified view of your token usage and costs.

Plus, it includes an **AI Recommender** that analyzes your usage patterns and suggests actionable ways to cut down your API bills.

![Dashboard Preview](https://via.placeholder.com/800x400?text=OptiToken+Dashboard+Preview)

## ✨ Why use OptiToken?
* **Multi-Vendor:** See OpenAI and Anthropic costs in one single, beautiful dashboard.
* **Proactive Savings:** Get AI-driven insights (e.g., "Switching these prompts from GPT-4o to GPT-4o-mini will save you $300/month").
* **Zero-Friction Setup:** SQLite database, no messy configs. Up and running in 2 minutes.
* **100% Private:** Your API keys and data stay on your local machine.

## 🚀 Quick Start (local dev)

This repo is structured as:

- root: meta files (`LICENSE`, this `README.md`, etc.)
- `app/`: Next.js App Router app (TypeScript, Tailwind, Prisma + SQLite)

1. **Clone the repo:**

   ```bash
   git clone https://github.com/taltol15/OptiToken.git
   cd OptiToken/app
   ```

2. **Create `.env` in `app/`:**

   ```bash
   cat > .env << 'EOF'
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"

   # Optional, but required for real billing sync:
   # OpenAI admin usage/cost (org-level, read access)
   OPENAI_ADMIN_API_KEY="sk-...admin..."
   OPENAI_ORG_ID="org_..."

   # Anthropic admin usage/cost
   ANTHROPIC_ADMIN_API_KEY="sk-ant-admin-..."
   EOF
   ```

   You can leave the provider keys empty to just play with the UI; the sync will be a no-op.

3. **Install & prepare the database:**

   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   ```

4. **Run the dashboard:**

   ```bash
   npm run dev
   ```

   Open the URL shown in the terminal (usually `http://localhost:3000`) and click **“Sync current month”** to pull live usage (if keys are set).

## ⚙️ Environment Variables (`app/.env`)

| Variable                 | Description                                                      | Required           |
| :----------------------- | :--------------------------------------------------------------- | :----------------- |
| `DATABASE_URL`           | SQLite connection string (defaults to `file:./dev.db`)          | No (default is ok) |
| `NEXT_PUBLIC_BASE_URL`   | Base URL for the app (used in some client/server interactions)  | No                 |
| `OPENAI_ADMIN_API_KEY`   | OpenAI **admin** API key with Usage/Cost API access             | Optional           |
| `OPENAI_ORG_ID`          | Your OpenAI organization ID                                     | Optional           |
| `ANTHROPIC_ADMIN_API_KEY`| Anthropic Admin API key (Usage & Cost Admin API)                | Optional           |

## 🤝 Contributing
Found a bug? Want to add support for Gemini or Claude? PRs are more than welcome!