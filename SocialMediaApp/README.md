# ACS Social Awareness Platform

## Overview

**ACS Social Awareness Platform** is a full-stack web application built for an IT internship project. It connects a community around **social awareness campaigns**, **local business listings**, and a **public community feed**. Registered members can create campaigns (with optional photos), add businesses to a shared directory, post on the feed, and use a personal dashboard. **Administrators** review submitted campaigns before they appear publicly, assign roles to users, and handle **admin demotion** requests that require multiple approvals.

The solution uses an **ASP.NET Core** backend (REST APIs + optional MVC views for account flows) and a **React (Vite)** single-page application for the main user interface. Authentication is **session-based** (cookies); the React dev server proxies API calls so cookies work during development.

---

## Features

### Public & marketing pages

- **Home** — Landing page with hero, feature highlights, and calls to action.
- **About Us, What We Do, News & Media, Support Us, Contact Us** — Informational pages with a consistent layout.

### Members (logged-in users)

- **Campaigns** — Browse approved campaigns in a feed-style layout (images, description, goals).
- **Create campaign** — Submit a new campaign (title, description, optional impact goal, **multiple images**) for admin approval.
- **My Campaigns** — View your submissions and their status (e.g. Pending, Approved, Rejected).
- **Business directory** — List community businesses; **create business ads** (name, industry, website, city).
- **Dashboard** — Overview of the logged-in user, quick links to create campaigns/ads, and summaries of “My Campaigns” and “My Business Ads”.
- **Feed** — Community posts with optional author name and likes.

### Administrators

- **Admin dashboard** — Approve or reject **pending campaigns**; view **all users** and assign the **Admin** role.
- **Admin demotion requests** — Workflow to remove admin privileges with **multiple approvals** (as implemented in the API).
- **Admin registration** — Separate registration path protected by a **secret key** in configuration (`AdminRegistrationKey` in `appsettings.json`).

### UX / navigation

- Main navigation includes marketing links; member-only tools are grouped (e.g. **My Area** dropdown) to keep the header clean when logged in.
- Styling uses **Tailwind CSS** and **Framer Motion** for a modern, consistent look across pages.

---

## Architecture

| Layer | Technology |
|--------|------------|
| **Backend** | ASP.NET Core, Entity Framework Core |
| **Database** | **SQLite** (`social.db` by default — see `appsettings.json`) |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Framer Motion |
| **Auth** | Server sessions + cookies; CORS configured for the Vite dev origin |

### API surface (high level)

REST controllers under `Controllers/Api/` include (names may vary slightly):

- **Account** — Login, register, logout, current user.
- **Campaigns** — List approved campaigns; create (multipart for images).
- **Businesses** — List and create business entries.
- **Dashboard** — Aggregated data for the member dashboard.
- **Feed** — List posts, create post, like post.
- **Admin** — Pending campaigns, approve/reject, users/roles, demotion requests.

Static uploads (e.g. campaign images) are served from `wwwroot` as configured in the app.

---

## Project structure (simplified)

```
SocialMediaApp/
├── Controllers/          # MVC + API controllers
├── Data/                 # DbContext, seeding
├── Models/               # Entity models
├── Views/                # Razor views (e.g. account)
├── wwwroot/              # Static files, uploads
├── client/               # React SPA (Vite)
│   └── src/              # Pages, layout, API client
├── appsettings.json      # Connection string, AdminRegistrationKey
└── Program.cs            # Middleware, CORS, session, DB seeding
```

---

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (match the version in `SocialMediaApp.csproj`)
- [Node.js](https://nodejs.org/) (LTS recommended) for the React client
- **SQLite** is used via EF Core — no separate database server is required for the default setup.

---

## Getting started (development)

### 1. Backend

From the `SocialMediaApp` folder:

```bash
dotnet restore
dotnet run
```

- Default URL: check **`Properties/launchSettings.json`** (often `http://localhost:5252`).
- On first run, the app ensures roles exist (see `Program.cs` / `RoleSeeder`).
- If you add or change EF models, apply migrations as usual:

  ```bash
  dotnet ef migrations add <MigrationName>
  dotnet ef database update
  ```

  *(Ensure the EF Core tools are installed if you use the CLI.)*

### 2. Frontend (React)

From `SocialMediaApp/client`:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically **`http://localhost:5173`**). Vite proxies `/api` (and uploads if configured) to the backend so **session cookies** work with the SPA.

### 3. Configuration

- **`appsettings.json`**
  - **`ConnectionStrings:DefaultConnection`** — SQLite file path (default: `social.db` in the app folder).
  - **`AdminRegistrationKey`** — Secret used when registering a new admin via the admin registration flow (change in production).

---

## Production build (frontend)

From `SocialMediaApp/client`:

```bash
npm run build
```

Output is under `client/dist/`. Host these static files from your ASP.NET app (e.g. under `wwwroot`) and add SPA fallback routing in `Program.cs` if you serve the React app from the same host.

Details: **[README-REACT.md](./README-REACT.md)** (proxy, admin flow, build notes).

---

## Security notes (for reviewers)

- Keep **`AdminRegistrationKey`** secret in production; use environment variables or user secrets, not committed secrets.
- Use **HTTPS** in production; configure CORS for your real front-end origin only.
- Uploaded files should be validated (type/size) and stored outside the web root or with strict rules — review `CampaignsApiController` and related code for your threat model.

---

## License / academic use

This project was developed as an **internship / learning** exercise. Adjust license and deployment steps for your organization as needed.

---

## See also

- **[README-REACT.md](./README-REACT.md)** — React stack, run commands, admin registration key, Vite proxy, production build.
