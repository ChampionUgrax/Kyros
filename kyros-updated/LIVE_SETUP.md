# Kyros live setup

Kyros now uses Firebase Authentication for learner accounts, Firebase Admin and Firestore on the server for account data, and the server-side AI module for quizzes. The default frontend mode is live; it does not fall back to fabricated sample data when a live request fails.

## 1. Configure Firebase

Create a Firebase project, enable Email/Password Authentication, create a Firestore database, and register a Web app. Copy the Web app values into a new root `.env` file based on `.env.example`:

```dotenv
VITE_USE_MOCK_API=false
VITE_API_URL=/api
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-web-app-id
```

The Firebase Web app values are client configuration. Never put a Firebase Admin service account or Gemini key in this file.

## 2. Configure the server

Create `backend/.env` from `backend/.env.example`. Set `CLIENT_URL` to the frontend origin. Provide Firebase Admin credentials with either `FIREBASE_SERVICE_ACCOUNT_JSON` in the deployment secret store or `GOOGLE_APPLICATION_CREDENTIALS` pointing to a credential file outside the public web directory. Set `GEMINI_API_KEY` in the backend secret store to enable AI quiz generation. Keep both private keys out of source control and the ZIP.

## 3. Install and run locally

From the project root, install frontend dependencies and start Vite:

```sh
npm install
npm run dev
```

In another terminal, install and start the API:

```sh
cd backend
npm install
npm run dev
```

The Vite development server forwards `/api` requests to `http://localhost:5000`. The API health check is `/api/health`.

## 4. Deploy

Deploy the frontend and backend as separate services. Set the production `VITE_API_URL` to the backend API base URL (including `/api`) before building the frontend. Set the backend `CLIENT_URL` to the exact frontend origin. Configure the Firebase Web app domain in Firebase Authentication's authorized domains. Add Firebase Admin and Gemini credentials through the hosting provider's secret manager. Use HTTPS for both services.

The application source and production frontend build are prepared, but this archive is not itself a hosted live service. A Firebase project, private server credentials, Gemini API key, and hosting account are required to make it reachable by public users.

## Current product scope

- Learners can register and sign in with Firebase Authentication.
- Profiles, AI quiz attempts, study materials, focus sessions, notifications, and direct learner chats use authenticated API routes.
- Courses, groups, and leaderboard records are read from Firestore and remain empty until populated with account activity or institute data.
- Quiz answers are checked on the server; the Gemini key and answer key are not sent to the browser.
- Material upload accepts PDF and TXT files up to 10 MB.

Public signup supports Student, Teacher, and Coaching Institute roles. Each new account is assigned the role selected at signup.
