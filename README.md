# Purple Merit Backend Assessment - Real-Time Collaborative Workspace

**Submitted by:** [Ricky Mahto]
**Date:** December 2025

## 📌 Project Overview
A production-grade backend service designed for a real-time collaborative coding platform. This solution implements secure authentication, real-time synchronization using WebSockets, and asynchronous job processing for code execution simulation.

## 🏗 Architecture & Tech Stack
* **Language:** Node.js (TypeScript)
* **Database (Relational):** PostgreSQL (Sequelize ORM) for user and project management.
* **Caching & Queues:** Redis (Pub/Sub & BullMQ) for sockets and background jobs.
* **Real-Time Engine:** Socket.io with Redis Adapter for horizontal scalability.
* **Async Processing:** BullMQ worker process for handling code execution tasks.
* **Containerization:** Docker & Docker Compose.

## 🚀 Setup & Run Instructions

### Prerequisites
* Docker Desktop (Must be running)
* Node.js (v18+)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-link>
cd purple-merit-backend
npm install
```

### 2. Start Infrastructure
Start PostgreSQL and Redis containers:
```bash
docker compose up -d
```

### 3. Environment Configuration
Create a .env file in the root directory:
```bash
PORT=3000
DATABASE_URL=postgres://admin:password123@localhost:5432/pm_workspace
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=secure_secret_key
```

### 4. Run the Application
Start the server in development mode:
```bash
npx ts-node src/server.ts
```
The server will start at http://localhost:3000.

### 🧪 Test Instructions
**Option 1: Swagger API Docs (Recommended)**
1.Start the server.

2.Navigate to http://localhost:3000/api-docs.

3.Use the interactive UI to test endpoints:
   POST /auth/register: Register a user and copy the token.

   Authorize: Click the lock icon and enter Bearer <your_token>.

   POST /jobs/execute: Test the async job queue.

**Option 2: Real-Time Collaboration Test**
1.Open the file test-client.html in two separate browser windows.

2.Click "Join Project Room" in both windows.

3.Type in one window and observe the text appearing instantly in the other.

### ⚖️ Design Decisions 
Inline Swagger: API documentation is embedded in server.ts to ensure stability across different deployment environments.

Redis Adapter: Used to allow the WebSocket server to scale horizontally.

BullMQ: Selected for robust job processing with built-in retry logic, fulfilling the "Production-Grade" requirement.
