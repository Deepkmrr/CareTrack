# CareTrack

CareTrack is a small internal patient-visit tracking application for clinical teams. It provides a React interface for managing clinicians, patients, and visit records, with an Express API and SQLite database behind it.

## Features

- Internal login and logout experience for the local workspace
- Dashboard activity log with recent visits in reverse chronological order
- Search visits by patient, clinician, or notes
- Filter visits by clinician or patient
- Create, edit, and delete visits
- Add, edit, and delete clinicians
- Add, edit, and delete patients
- Visit timestamp, clinical notes, patient comments, and star ratings
- About page, responsive navigation, footer, animations, and mobile layout
- Seed data for a quick first run
- Prettier formatting configuration and validation scripts

## Technology

### Frontend

- React 18
- Vite 4
- React Router
- React Bootstrap and Bootstrap
- Styled Components
- React Icons

### Backend

- Node.js
- Express
- better-sqlite3
- CORS

## Requirements

- Node.js 16 or newer
- npm 8 or newer

Node.js 20 or newer is recommended for current tooling, but the project dependencies are pinned to versions that work with the existing Node.js 16 environment.

## Installation

Clone the repository and enter the project directory:

```powershell
git clone https://github.com/Deepkmrr/CareTrack.git
cd CareTrack
```

Install dependencies:

```powershell
npm install
```

## Running the application

Start both the API server and the React development server:

```powershell
npm run dev
```

The application is available at:

```text
http://localhost:5173
```

The API runs at:

```text
http://localhost:3001
```

You can also run the processes separately:

```powershell
# Terminal 1
npm run server

# Terminal 2
npm run dev -- --host localhost
```

The Vite development server normally uses port `5173`. The Express API uses port `3001`.

## Demo login

The local login screen is a frontend access gate for the demo workspace. Any valid-looking email and the default password value can be used to enter the application. Authentication is stored in browser `localStorage` under `caretrack-auth`.

This login is not production authentication. A production deployment should add server-side sessions or an identity provider, password hashing, authorization, and secure cookies.

## Application pages

| Page       | URL           | Purpose                                                          |
| ---------- | ------------- | ---------------------------------------------------------------- |
| Workspace  | `/`           | Activity log, recent visits, search, filters, and visit creation |
| Clinicians | `/clinicians` | Create, edit, list, and delete clinicians                        |
| Patients   | `/patients`   | Create, edit, list, and delete patients                          |
| About us   | `/about`      | Application overview                                             |

The Clinicians and Patients pages are linked from the application header. The dashboard intentionally focuses on activity and recent visits only.

## Project structure

```text
CareTrack/
├── server/
│   ├── caretrack.db             # Local SQLite database, created at runtime
│   └── index.js                 # Express server, schema, seed data, and API routes
├── src/
│   ├── components/
│   │   ├── layout/Shell.jsx     # Header, navigation, and footer
│   │   └── ui/Styled.jsx        # Shared styled-components primitives
│   ├── features/
│   │   ├── about/About.jsx
│   │   ├── auth/Login.jsx
│   │   ├── clinicians/ClinicianItem.jsx
│   │   ├── dashboard/Dashboard.jsx
│   │   ├── patients/PatientItem.jsx
│   │   ├── people/PeoplePage.jsx
│   │   └── visits/VisitModal.jsx
│   ├── services/api.js           # Shared frontend API request helper
│   ├── App.jsx                   # Authentication state and routes
│   ├── main.jsx                  # React entry point
│   └── styles.css                # Global and responsive styles
├── .gitignore
├── .prettierignore
├── .prettierrc
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## SQLite database

The database is stored at:

```text
server/caretrack.db
```

It is created automatically when the API starts. The file is intentionally ignored by Git because it contains local runtime data.

The server creates these tables:

### `clinicians`

| Column       | Description                   |
| ------------ | ----------------------------- |
| `id`         | Auto-incrementing primary key |
| `name`       | Clinician name                |
| `specialty`  | Medical specialty             |
| `email`      | Optional email address        |
| `created_at` | Creation timestamp            |

### `patients`

| Column          | Description                   |
| --------------- | ----------------------------- |
| `id`            | Auto-incrementing primary key |
| `name`          | Patient name                  |
| `date_of_birth` | Optional date of birth        |
| `contact`       | Optional contact information  |
| `created_at`    | Creation timestamp            |

### `visits`

| Column         | Description                          |
| -------------- | ------------------------------------ |
| `id`           | Auto-incrementing primary key        |
| `clinician_id` | Foreign key to `clinicians.id`       |
| `patient_id`   | Foreign key to `patients.id`         |
| `visited_at`   | Visit date and time                  |
| `notes`        | Optional clinical notes              |
| `rating`       | Visit rating from 0 to 5             |
| `comment`      | Optional patient comment or feedback |
| `created_at`   | Creation timestamp                   |

Foreign keys are enabled. Clinicians and patients with recorded visits cannot be deleted until their visits are removed.

To inspect the database with SQLite:

```powershell
sqlite3 server/caretrack.db
```

Then run:

```sql
.tables
SELECT * FROM clinicians;
SELECT * FROM patients;
SELECT * FROM visits;
.quit
```

## API reference

All API routes use the `/api` prefix and return JSON unless the response is `204 No Content`.

### Clinicians

| Method   | Endpoint              | Description                    |
| -------- | --------------------- | ------------------------------ |
| `GET`    | `/api/clinicians`     | List clinicians alphabetically |
| `POST`   | `/api/clinicians`     | Create a clinician             |
| `PUT`    | `/api/clinicians/:id` | Update a clinician             |
| `DELETE` | `/api/clinicians/:id` | Delete a clinician             |

Clinician request body:

```json
{
  "name": "Dr. Avery Stone",
  "specialty": "Internal Medicine",
  "email": "avery.stone@example.com"
}
```

### Patients

| Method   | Endpoint            | Description                  |
| -------- | ------------------- | ---------------------------- |
| `GET`    | `/api/patients`     | List patients alphabetically |
| `POST`   | `/api/patients`     | Create a patient             |
| `PUT`    | `/api/patients/:id` | Update a patient             |
| `DELETE` | `/api/patients/:id` | Delete a patient             |

Patient request body:

```json
{
  "name": "Jordan Lee",
  "date_of_birth": "1990-05-14",
  "contact": "(555) 010-2000"
}
```

### Visits

| Method   | Endpoint          | Description                                |
| -------- | ----------------- | ------------------------------------------ |
| `GET`    | `/api/visits`     | List visits newest first with joined names |
| `POST`   | `/api/visits`     | Record a visit                             |
| `PUT`    | `/api/visits/:id` | Edit a visit                               |
| `DELETE` | `/api/visits/:id` | Delete a visit                             |

Visit request body:

```json
{
  "clinician_id": 1,
  "patient_id": 1,
  "visited_at": "2026-09-24T10:30",
  "notes": "Routine follow-up.",
  "rating": 5,
  "comment": "Clear care plan and reassuring follow-up."
}
```

## npm scripts

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Run the API and Vite development server together |
| `npm run server`       | Run only the Express API                         |
| `npm run build`        | Create a production frontend build in `dist/`    |
| `npm run preview`      | Preview the production frontend build            |
| `npm run format`       | Format project files with Prettier               |
| `npm run format:check` | Check formatting without changing files          |

## Validation

Before pushing changes, run:

```powershell
npm run format:check
npm run build
```

To smoke-test the API after starting the server:

```powershell
Invoke-RestMethod http://localhost:3001/api/clinicians
Invoke-RestMethod http://localhost:3001/api/patients
Invoke-RestMethod http://localhost:3001/api/visits
```

## Git workflow

The GitHub repository is:

```text
https://github.com/Deepkmrr/CareTrack
```

To commit and push future changes:

```powershell
git status
git add .
git commit -m "Describe your change"
git push origin main
```

The `.gitignore` excludes `node_modules`, `dist`, environment files, and `server/*.db` so local dependencies, build artifacts, secrets, and database runtime data are not committed.

## Troubleshooting

### Port 3001 is already in use

Stop the existing Node process or change the port in `server/index.js`. Update the API URL in `src/services/api.js` to match.

### The database is missing

Start the API with:

```powershell
npm run server
```

The server creates `server/caretrack.db` and seeds it on first startup.

### The frontend cannot reach the API

Make sure both servers are running and that the API is available at `http://localhost:3001`. The frontend calls this URL from `src/services/api.js`.

### Reset local demo data

Stop the API, delete `server/caretrack.db`, and start the API again. The schema and seed data will be recreated.
