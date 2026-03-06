# 💸 OptiToken: Zero-Friction AI FinOps Dashboard

Stop guessing who burned your API credits. **OptiToken** is a lightweight, self-hosted dashboard that connects to your AI providers (OpenAI, Anthropic) and gives you a unified view of your token usage and costs.

Plus, it includes an **AI Recommender** that analyzes your usage patterns and suggests actionable ways to cut down your API bills.

![Dashboard Preview](https://via.placeholder.com/800x400?text=OptiToken+Dashboard+Preview)

## ✨ Why use OptiToken?
* **Multi-Vendor:** See OpenAI and Anthropic costs in one single, beautiful dashboard.
* **Proactive Savings:** Get AI-driven insights (e.g., "Switching these prompts from GPT-4o to GPT-4o-mini will save you $300/month").
* **Zero-Friction Setup:** SQLite database, no messy configs. Up and running in 2 minutes.
* **100% Private:** Your API keys and data stay on your local machine.

## 🚀 Quick Start (Run in 2 minutes)

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/optitoken.git](https://github.com/YOUR_USERNAME/optitoken.git)
   cd optitoken
   ```

2. **Set up your API Keys:**
   Copy the example environment file and add your Read-Only API keys.
   ```bash
   cp .env.example .env
   ```

3. **Install & Run:**
   ```bash
   npm install
   npm run dev
   ```
   *Boom.* Go to `http://localhost:3000` and start saving money.

## ⚙️ Environment Variables (`.env`)
| Variable | Description | Required |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | Your OpenAI API Key (Restricted to Billing read-only) | Yes |
| `ANTHROPIC_API_KEY`| Your Anthropic API Key | Optional |

## 🤝 Contributing
Found a bug? Want to add support for Gemini or Claude? PRs are more than welcome!
