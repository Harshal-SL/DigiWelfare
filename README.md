# DigiWelfare: Secure, Transparent Social Welfare Platform

DigiWelfare is a next-generation, Aadhaar-integrated platform for the secure, transparent, and efficient distribution of government welfare schemes. Leveraging AI for eligibility checks and blockchain for disbursement verification, DigiWelfare ensures that social benefits reach the right people with maximum transparency and minimum friction.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Custom Domain](#custom-domain)
- [License](#license)

## Features

- **Aadhaar-based Secure Authentication:** Login via DigiLocker for robust identity verification.
- **AI-Powered Eligibility:** Automated eligibility checks and scheme recommendations based on user profile.
- **Blockchain Verification:** All disbursements are recorded on a blockchain ledger for transparency and fraud prevention.
- **User Dashboard:** Track applications, view eligible schemes, and manage your digital profile.
- **Admin Dashboard:** Manage schemes, review and approve/reject applications, and monitor platform activity.
- **Scheme Discovery:** Search, filter, and explore a wide range of government welfare schemes.
- **Application Tracking:** Real-time status updates and notifications for every application.
- **Integrated Chatbot (DigiMitra):** Get instant help and guidance on using the platform.
- **Modern UI:** Built with shadcn-ui and Tailwind CSS for a responsive, accessible experience.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **UI:** shadcn-ui, Tailwind CSS
- **State/Data:** React Query, Context API
- **Blockchain:** Ethers.js, Web3.js (for ledger integration)
- **AI:** Google Gemini API (for chatbot)
- **Other:** Lucide Icons, Razorpay (for payments), date-fns, zod (validation)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd DigiWelfare

# Install dependencies
npm install
# or
bun install
```

### Running the App

```sh
# Start the development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Available Scripts

- `npm run dev` – Start the development server with hot reload.
- `npm run build` – Build the app for production.
- `npm run preview` – Preview the production build locally.
- `npm run lint` – Run ESLint for code quality checks.

## Project Structure

```
aid-ledger-secure-welfare-95/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components (Navbar, Footer, ChatBot, etc.)
│   ├── contexts/          # React Contexts (Auth, etc.)
│   ├── data/              # Mock data for schemes, applications, etc.
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── pages/             # Main app pages (Home, Dashboard, Schemes, Admin, etc.)
│   ├── services/          # API and blockchain service logic
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```


## License

This project is licensed under the MIT License.

## Acknowledgments

- Government of India for open welfare scheme data.
- [shadcn-ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/), [Vite](https://vitejs.dev/), and the open-source community.
