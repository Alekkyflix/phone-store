# Tech Mobile - Phone Management System 📱⚡

A professional, gamified retail management system built with React and Vite, featuring seamless n8n automation for sales tracking and inventory management.

## ✨ Features

- **🛍️ Elegant Storefront**: High-performance landing page with search, filtering, and a glassmorphic cart experience.
- **🛡️ Staff Portal**: Secure access to inventory management, sales recording, and system configurations.
- **📊 n8n Integration**: Automated data flow to n8n webhooks for real-time sales tracking and customer WhatsApp notifications.
- **🎮 Tech Points System**: Gamified user experience where customers earn points for browsing and purchasing.
- **🌉 Bulletproof Proxy**: Built-in Vite proxy to handle CORS issues effortlessly during development.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PKwaringa/phone-management-sys.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment (GitHub Pages)

I've already set up one-click deployment for you. Whenever you want to update your live site:

1. Run the deploy command:
   ```bash
   npm run deploy
   ```
   This will automatically build the project and push it to the `gh-pages` branch.

## ⚙️ Configuration

The system is designed to be highly configurable via the **Staff Portal -> Settings**:

- **Webhook URL**: Directly link your n8n workflow.
- **Shop Branding**: Update your shop name, location, and contact details.
- **Theme Engine**: Switch between multiple premium UI themes (Emerald, Dark, Ocean, etc.).

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Animations**: Tailwind CSS / Custom Keyframes
- **State**: React Context & Hooks

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [PKwaringa](https://github.com/PKwaringa)
