# Aditya Portfolio (React + Node/Express + MongoDB)

Monorepo-style setup:
- `client/` : React (Vite)
- `server/` : Node + Express + MongoDB (Mongoose)

## Prerequisites
- Node.js (LTS)
- MongoDB (local or Atlas)

## Environment
Create `server/.env` based on `server/.env.example`.

## Setup
### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd server
npm install
npm run dev
```

Server runs on `http://localhost:5000` by default.

## Notes
- In production, you can build the React app and serve the static files from the Express server.
- CORS is enabled for the dev client.

