# Cruddd

This repository contains a full-stack task/project management application.

## Project Structure

- `ui/FRONT` - React frontend built with Vite and Tailwind CSS.
- `ui/server` - Express backend API with MongoDB and authentication.

## Frontend Setup

1. Open `ui/FRONT`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `ui/FRONT` with:
   ```env
   VITE_API_TARGET=http://localhost:5000
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Backend Setup

1. Open `ui/server`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `ui/server` with these values:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   PORT=5000
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

## Usage

- Frontend runs on `http://localhost:5173` by default.
- Backend runs on `http://localhost:5000`.
- The frontend is configured to call the backend using `VITE_API_TARGET`.

## Notes

- `ui/FRONT/.env` and `ui/server/.env` are ignored by Git.
- If you deploy the frontend, set `VITE_API_TARGET` in the hosting environment.
- If the backend is remote, update `VITE_API_TARGET` accordingly.

## Deploy to Railway

### Backend service

1. Open `ui/server`.
2. Create `ui/server/.env` from `ui/server/.env.example`.
3. Set these Railway environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (optional; Railway will provide one automatically)
4. Add `ui/server/Procfile`:
   ```text
   web: npm start
   ```
5. Run in the `ui/server` folder:
   ```bash
   railway init
   railway up
   ```

### Frontend service

1. Open `ui/FRONT`.
2. Create `ui/FRONT/.env` from `ui/FRONT/.env.example`.
3. Set this Railway environment variable:
   - `VITE_API_TARGET=https://<your-backend-service>.up.railway.app`
4. Deploy as a static site or Node service. For a static site, set:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

### Important

- The frontend must use the deployed backend URL in `VITE_API_TARGET`.
- The backend uses `process.env.PORT`, so Railway can assign the correct port.
