# Pathfinder | Strategy Studio Web Platform

[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Pathfinder is a premium Strategy Studio web platform engineered for early-stage founders navigating high-uncertainty environments. It provides sequenced choice architecture, strategy handbooks, partner testimonials, and a secure curator portal for resource management.

---

## 🌟 Key Features & Architecture

### 1. Pixel-Perfect Figma Hero Interface
* **Display Headline**: Engineered with exact Figma parameters (`League Gothic` for bold headers, `Playfair Display` serif italic for `choose`, glowing brand Jolly Lime `#B8FF22`).
* **Hexagonal Silhouette Capsule**: Vertical rounded-vertex hexagon (`199.33px` $\times$ `505.97px`, border `0.69px` solid `#1E1E1E` 30%) with realistic standing figure vector and soft cast shadow.
* **Inline Header Pill**: Encloses 5 standing human figure silhouettes (`poses.png` / `214.79px` $\times$ `92.38px`).
* **Vector Connector Lines**: SVG paths (`Vector 32`) connecting the header cards down to the tagline box with directional arrows.

### 2. Floating Navigation Cluster (`main-btns`)
* **5 Staggered Menu Cards**: `PROGRAM` (Strategic Coherence), `TEAM` (Savant Partner), `ORBIT` (Blogs), `LIBRARY` (Resources), and `CAREERS` (Opportunities).
* **Active Translucent Glass**: Translucent dark glassmorphism (`#2D2D2DBF` with `backdrop-blur-md`) with cyan vector accents (`#22D3EE`).
* **Continuous Organic Floating Motion**: Hardware-accelerated Framer Motion keyframes (`y: [0, -7, 0]`) with staggered delays (`0s`, `0.4s`, `0.2s`, `0.6s`, `0.8s`).

### 3. Strategy Resource Explorer (`LIBRARY`)
* **Category Filtering**: Filter by `Handbooks`, `Testimonials`, and `Inspirations`.
* **Real-time Search**: Debounced search input across title, description, author, and tags with pagination stability.
* **PDF Reader & Downloads**: Direct online reading and document downloads.

### 4. Curator Portal & Admin CMS
* **Role-Based Access Control (RBAC)**: Distinct permissions for **Admin** (full access) and **Social Media Manager (SMM)** (content creation/editing, restricted deletion).
* **Resource Management**: Create, edit, and archive strategy assets.
* **Category CMS**: Dynamic category creation and status toggles.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 + Vite |
| **Styling & Tokens** | TailwindCSS + Custom Color/Shadow Design Tokens |
| **Animations** | Framer Motion (60fps GPU-accelerated keyframe loops) |
| **Icons & Vectors** | Lucide React + Hand-crafted SVG Paths |
| **Backend API** | Node.js + Express.js |
| **Database** | MongoDB / Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) + HTTP-Only / Authorization Header |
| **API Documentation** | Swagger UI (`/api-docs`) |

---

## 🚀 Quick Start Guide

### Prerequisites
* Node.js (v18.0 or higher)
* MongoDB running locally (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/PathFinder.git
cd PathFinder
```

### Step 2: Backend Setup & Seeding
```bash
cd backend
npm install

# Seed the database with initial categories, resources, and credentials
npm run db:seed

# Start backend dev server (runs on http://localhost:5000)
npm run dev
```

### Step 3: Frontend Setup & Launch
Open a second terminal window:
```bash
cd frontend
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

---

## 🔐 Pre-seeded Test Credentials

Access the **Curator Portal** by clicking `Curator Portal` in the website footer:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@pathfinder.build` | `PathfinderAdmin123!` | Full Admin Clearance (Create, Edit, Delete) |
| **Social Media Manager** | `smm@pathfinder.build` | `PathfinderSMM456!` | Content Editor (Create & Edit; Delete restricted) |

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Access |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/health` | API Health Check | Public |
| `POST` | `/api/auth/login` | User Authentication | Public |
| `GET` | `/api/auth/me` | Fetch Current User Profile | Authenticated |
| `GET` | `/api/resources` | Fetch Strategy Resources (Filtered & Paginated) | Public |
| `POST` | `/api/resources` | Create New Resource | Admin / SMM |
| `PUT` | `/api/resources/:id` | Update Existing Resource | Admin / SMM |
| `DELETE` | `/api/resources/:id` | Delete Resource | Admin Only |
| `GET` | `/api/categories` | List Active Categories | Public |

*Interactive Swagger Documentation available at `http://localhost:5000/api-docs`.*

---

## 📦 Deployment Guide

### Database (MongoDB Atlas)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Allow network access (`0.0.0.0/0`) and copy your MongoDB connection string.

### Backend (Render.com)
1. Connect GitHub repository to [Render](https://render.com/).
2. Root Directory: `backend` | Build Command: `npm install` | Start Command: `npm start`.
3. Set Environment Variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`.

### Frontend (Vercel)
1. Import repository to [Vercel](https://vercel.com/).
2. Root Directory: `frontend` | Framework: `Vite` | Build Command: `npm run build` | Output: `dist`.
3. Set Environment Variable: `VITE_API_URL=https://your-backend-name.onrender.com/api`.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
