# Kyros frontend
`npm i && cp .env.example .env && npm run dev`
- Routes: `/` landing, `/extension`, `/auth` (role dropdown), `/app/student|teacher|institute`.
- No data is hardcoded: every dashboard panel fetches from the contract at the bottom of `src/services/api.js`.
- Add/rename dashboard tabs in `src/pages/Dashboard.jsx` (endpoint + renderer type: stats, list, heatmap, leaderboard).
- Roles: `src/config/roles.js`. Marketing copy: `src/config/content.js`.
- Mobile app: responsive with bottom tab bar; wrap the `dist/` build with Capacitor.
