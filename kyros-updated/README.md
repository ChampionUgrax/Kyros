# Kyros learning platform

Kyros is a React frontend connected to a Firebase-authenticated Node API. See [LIVE_SETUP.md](./LIVE_SETUP.md) for Firebase setup, local development, secrets, and deployment.

- Frontend routes: `/`, `/extension`, `/auth`, `/app/student/*`, `/app/teacher/*`, `/app/institute/*`.
- Student signup, account-backed study tools, focus tracking, and AI quiz workflows use the live API by default.
- Set `VITE_USE_MOCK_API=true` only to preview local sample data without live services.
- Student screens load from authenticated routes under `/api/student`, `/api/focus`, and `/api/ai`.
- Staff APIs are provided by the backend, but staff account provisioning is administrator-only.
