# Campus Notification System

**Roll Number:** BL.EN.U4CSE23013  
**Track:** Full Stack (React + Node.js/Express)

---

## Project Structure

```
BL.EN.U4CSE23013/
├── logging_middleware/          # Reusable Log() package (Stage pre-test)
├── notification_app_be/         # Express backend (Stages 1-5)
├── notification_app_fe/         # React frontend (Stage 7)
├── priority_inbox.js            # Priority algorithm — max-heap (Stage 6)
├── notification_system_design.md # Architecture doc (Stages 1-6)
├── .gitignore
└── README.md
```

---

## How to Run

### Step 1 — Get Auth Token

1. Register: `POST http://20.207.122.201/evaluation-service/register`
2. Authenticate: `POST http://20.207.122.201/evaluation-service/auth`
3. Copy the `access_token` from the response

### Step 2 — Backend

```bash
cd notification_app_be
# Paste your token in .env
# LOG_AUTH_TOKEN=your_token_here
npm run dev
```
Runs on `http://localhost:5000`

### Step 3 — Frontend

```bash
cd notification_app_fe
npm run dev
```
Runs on `http://localhost:3000`

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| All Notifications | `/` | All notifications from evaluation server with type filter |
| Priority Inbox | `/priority` | Top-n notifications ranked by weight + recency |

---

## API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Fetch all |
| POST | `/api/notifications` | Create |
| PUT | `/api/notifications/:id` | Update |
| DELETE | `/api/notifications/:id` | Delete |
| PATCH | `/api/notifications/:id/read` | Mark as read |

---

## Notification Types (Evaluation Server)

- `Event` — campus events
- `Result` — academic results
- `Placement` — placement drives

---

## Priority Algorithm (Stage 6)

Score = `weight × 1,000,000,000 + unix_timestamp`

| Type | Weight |
|------|--------|
| Placement | 3 |
| Result | 2 |
| Event | 1 |

See `priority_inbox.js` for full max-heap implementation.
