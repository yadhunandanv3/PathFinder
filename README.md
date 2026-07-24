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
* **Hexagonal Silhouette Capsule**: Vertical rounded-vertex hexagon (`199.33px` × `505.97px`, border `0.69px` solid `#1E1E1E` 30%) with realistic standing figure vector and soft cast shadow.
* **Inline Header Pill**: Encloses 5 standing human figure silhouettes (`poses.png` / `214.79px` × `92.38px`).
* **Vector Connector Lines**: SVG paths (`Vector 32`) connecting the header cards down to the tagline box with directional arrows.

### 2. Floating Navigation Cluster (`main-btns`)
* **5 Staggered Menu Cards**: `PROGRAM` (Strategic Coherence), `TEAM` (Savant Partner), `ORBIT` (Blogs), `LIBRARY` (Resources), and `CAREERS` (Opportunities).
* **Active Translucent Glass**: Translucent dark glassmorphism (`#2D2D2DBF` with `backdrop-blur-md`) with cyan vector accents (`#22D3EE`).
* **Continuous Organic Floating Motion**: Hardware-accelerated Framer Motion keyframes (`y: [0, -7, 0]`) with staggered delays (`0s`, `0.4s`, `0.2s`, `0.6s`, `0.8s`).

### 3. Unified Content Module (`LIBRARY`)
* **Single Collection Inheritance**: Fused all resources under a unified MongoDB `Content` collection (`CONCEPT_NOTE`, `PUBLIC_HANDBOOK`, `INSPIRATION`, `TESTIMONIAL`) for clean queries, sorting, and pagination.
* **Category Filtering**: Filter by category tags (`Handbooks`, `Testimonials`, `Inspirations`, `Strategy`, `General`).
* **Real-time Search**: Debounced search input across title, description, and author fields.

### 4. Curator Portal & Admin CMS
* **Role-Based Access Control (RBAC)**: Two roles:
  * **`ADMIN`**: Full administrator clearance. Access to resource CRUD, category management, and user management (`/api/users`).
  * **`SOCIAL_MEDIA_MANAGER`**: Access to resource creation and editing. Access to user management and content deletion is strictly blocked.

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
| **Authentication** | JSON Web Tokens (JWT) + Bearer Token Authorization Headers |
| **Error Handling** | Centralized API Express Error Middleware |

---

## 🚀 Quick Start Guide

### Prerequisites
* Node.js (v18.0 or higher)
* MongoDB running locally (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### Step 1: Clone the Repository
```bash
git clone https://github.com/yadhunandanv3/PathFinder.git
cd PathFinder
```

### Step 2: Backend Setup & Launch
```bash
cd backend
npm install

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

## 🔐 System Admin Credentials

Access the **Curator Portal** by clicking `Curator Portal` in the website footer:

| Email | Password | Role | Access Level |
| :--- | :--- | :--- | :--- |
| `admin@pathfinder.build` | `admin@123` | **`ADMIN`** | Full Administrator Clearance (Create, Edit, Delete, Manage Users) |
| `admin2@pathfinder.build` | `admin@123` | **`ADMIN`** | Alternate Seeder Admin Account |

*You can also click **Register New User** to register custom accounts directly into the MongoDB Atlas database.*

---

## 📡 REST API Endpoints

### Authentication Endpoints
* `POST /api/auth/login` - Authenticate and obtain JWT
* `GET /api/auth/me` - Retrieve current user profile

### Content Endpoints
* `GET /api/content` - Fetch content items (filtered and paginated)
* `GET /api/content/:id` - Fetch single content item by ID
* `POST /api/content` - Create a content item (Staff only)
* `PUT /api/content/:id` - Update an existing content item (Staff only)
* `DELETE /api/content/:id` - Delete a content item (ADMIN only)

### User Management Endpoints (ADMIN Only)
* `GET /api/users` - List all user accounts
* `POST /api/users` - Create a new user account
* `PUT /api/users/:id` - Update user account details
* `DELETE /api/users/:id` - Delete a user account

### Upload Endpoints
* `POST /api/upload` - Upload file attachment to server

---

## 📦 Production Deployment Configuration

### Single-Page App rewrites (`vercel.json`)
To prevent **404: NOT_FOUND** errors when refreshing or directly navigating to frontend subpaths (like `/login` or `/dashboard`), the frontend uses `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
