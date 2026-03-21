# React frontend (ACS Social Awareness)

The app has a **React** front end that talks to the same .NET API.

> **For mentors:** Some parts of this project were developed with **AI assistance (Cursor)**. See **[CODE_ATTRIBUTION.md](./CODE_ATTRIBUTION.md)** for which areas are AI-assisted and how to review them. It uses:

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **Session-based auth** (cookies) with the existing API

## Run with React (development)

1. **Start the .NET API** (from `SocialMediaApp` folder):
   ```bash
   dotnet run
   ```
   API will be at `http://localhost:5252` (see `Properties/launchSettings.json`).

2. **Start the React dev server** (from `SocialMediaApp/client`):
   ```bash
   cd client
   npm install
   npm run dev
   ```
   React runs at `http://localhost:5173` and proxies `/api` to the backend.

3. Open **http://localhost:5173** in your browser and use the React UI (Login, Dashboard, Campaigns, Businesses, Feed, **My Campaigns**, **Admin**).

## Admin flow

- **Admin registration**: Use **Admin Register** (link in header when not logged in). You need the **Admin registration key** from `appsettings.json` (`AdminRegistrationKey`; default for dev is `acs-admin-2026`).
- **Admin dashboard** (visible when logged in as Admin): **Admin** in the header → Approval requests (approve/reject campaigns from users) and **Users & roles** (assign Admin role to other users).
- **My Campaigns**: Any logged-in user can open **My Campaigns** to see the status of their campaigns (Pending, Approved, Rejected).

## Build React for production

From `SocialMediaApp/client`:

```bash
npm run build
```

Then copy the built files from `client/dist/*` into `wwwroot/app` (or configure your backend to serve the SPA from there and add SPA fallback in `Program.cs` if you want a single deploy).

## API proxy

In development, Vite proxies `/api` to `http://localhost:5252`, so the React app and API use the same origin for cookies. If your backend runs on a different port, change the `proxy` target in `client/vite.config.ts`.
