# Notification System Design

## Overview

Full stack developer working on a campus notification platform where students receive real-time updates regarding Placements, Events, and Results.

---

## Stage 1 — REST API Design & Contract

### Core Actions the Platform Should Support

1. Fetch all notifications (with filters and pagination)
2. Fetch a single notification by ID
3. Mark a notification as read
4. Mark all notifications as read
5. Delete a notification
6. Get priority/top-n notifications

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Fetch all notifications (supports `?limit`, `?page`, `?notification_type`) |
| GET | `/api/notifications/:id` | Fetch a single notification |
| PATCH | `/api/notifications/:id/read` | Mark one notification as read |
| PATCH | `/api/notifications/read-all` | Mark all notifications as read |
| DELETE | `/api/notifications/:id` | Delete a notification |
| GET | `/api/notifications/priority` | Get top-n priority notifications |

### Request / Response Structures

**GET /api/notifications**

Query params:
```
?limit=10&page=1&notification_type=Placement
```

Response (200):
```json
{
  "notifications": [
    {
      "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "Type": "Result",
      "Message": "mid-sem",
      "Timestamp": "2026-04-22 17:51:30"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

**PATCH /api/notifications/:id/read**

Response (200):
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Notification Schema

```json
{
  "ID": "string (UUID)",
  "Type": "Event | Result | Placement",
  "Message": "string",
  "Timestamp": "datetime string",
  "isRead": "boolean (tracked client-side or in local state)"
}
```

### Real-Time Notification Mechanism

For real-time delivery, the recommended approach is **Server-Sent Events (SSE)**:

- Server pushes new notifications to connected clients over a persistent HTTP connection
- Client subscribes to `GET /api/notifications/stream`
- Lightweight compared to WebSockets for one-way server-to-client updates
- Falls back gracefully if connection drops (auto-reconnect built into EventSource API)

Alternative: **WebSockets** for bidirectional communication if the platform needs client-to-server events too.

---

## Stage 2 — Database Design & Persistent Storage

### Recommended Database: PostgreSQL

**Why PostgreSQL:**
- Strong support for UUID primary keys
- ENUM types for notification_type
- Excellent indexing capabilities for large datasets
- JSONB support if metadata needs to be stored flexibly
- Mature ecosystem with good ORM support (Prisma, Sequelize)

### DB Schema

```sql
CREATE TYPE notification_type AS ENUM ('Event', 'Result', 'Placement');

CREATE TABLE students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  roll_no     VARCHAR(50) UNIQUE NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type notification_type NOT NULL,
  message           TEXT NOT NULL,
  created_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE student_notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES students(id) ON DELETE CASCADE,
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  is_read         BOOLEAN DEFAULT FALSE,
  read_at         TIMESTAMP,
  UNIQUE(student_id, notification_id)
);
```

### Problems as Data Volume Increases

1. **Full table scans** — querying unread notifications for a student across 5M rows becomes slow
2. **JOIN overhead** — `student_notifications` join with `notifications` gets expensive
3. **Write amplification** — sending to 50,000 students creates 50,000 rows per notification
4. **Index bloat** — too many indexes slow down writes

### Solutions

- Add composite indexes on frequently queried columns
- Partition `notifications` table by month
- Use read replicas for SELECT-heavy workloads
- Archive old notifications to cold storage

### Key Queries

**Fetch unread notifications for a student:**
```sql
SELECT n.id, n.notification_type, n.message, n.created_at
FROM notifications n
JOIN student_notifications sn ON sn.notification_id = n.id
WHERE sn.student_id = $1
  AND sn.is_read = FALSE
ORDER BY n.created_at DESC
LIMIT 20;
```

**Students who got a Placement notification in last 7 days:**
```sql
SELECT DISTINCT s.id, s.name, s.email
FROM students s
JOIN student_notifications sn ON sn.student_id = s.id
JOIN notifications n ON n.id = sn.notification_id
WHERE n.notification_type = 'Placement'
  AND n.created_at >= NOW() - INTERVAL '7 days';
```

---

## Stage 3 — Query Optimization

### Original Query Analysis

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

**Is this query accurate?**
No. Based on the normalised schema, `studentID` and `isRead` belong in the `student_notifications` join table, not directly on `notifications`. The query should join both tables.

**Why is it slow?**
- No index on `studentID` or `isRead` — causes a full table scan
- `SELECT *` fetches all columns including large text fields unnecessarily
- With 5M rows, even a single student's unread scan is O(n)

**Likely computation cost:** O(n) — linear scan across all 5M notification rows.

**Should we add indexes on every column?**
No. Adding indexes on every column is not effective because:
- Indexes slow down INSERT/UPDATE/DELETE operations (write overhead)
- Low-cardinality columns like `isRead` (only true/false) have poor index selectivity
- Composite indexes on `(studentID, isRead, createdAt)` are far more efficient

**Optimised query:**
```sql
SELECT n.id, n.notification_type, n.message, n.created_at
FROM student_notifications sn
JOIN notifications n ON n.id = sn.notification_id
WHERE sn.student_id = 1042
  AND sn.is_read = FALSE
ORDER BY n.created_at ASC;
```

**Recommended index:**
```sql
CREATE INDEX idx_sn_student_unread ON student_notifications(student_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

**Students who got a Placement notification in last 7 days:**
```sql
SELECT DISTINCT s.id, s.name, s.email
FROM students s
JOIN student_notifications sn ON sn.student_id = s.id
JOIN notifications n ON n.id = sn.notification_id
WHERE n.notification_type = 'Placement'
  AND n.created_at >= NOW() - INTERVAL '7 days';
```

---

## Stage 4 — Caching Strategy

### Problem
Notifications are fetched on every page load for every student. With 50,000 students, the DB is overwhelmed.

### Suggested Solutions

#### Option 1: Redis Cache (Recommended)
- Cache the notification list per student with a TTL of 60 seconds
- Key: `notifications:student:{id}`
- On new notification: invalidate affected student caches
- **Tradeoff:** Slight staleness (up to 60s), but massively reduces DB load. Cache invalidation logic adds complexity.

#### Option 2: HTTP Cache Headers
- Set `Cache-Control: max-age=30` on the notifications API response
- Browser/CDN caches the response
- **Tradeoff:** Simple to implement, but all students share the same cache — not suitable for personalised notification lists.

#### Option 3: Pagination + Lazy Loading
- Only fetch the first 10 notifications on load, load more on scroll
- Reduces data transferred per request significantly
- **Tradeoff:** Doesn't reduce DB queries, just reduces payload size.

#### Option 4: Database Read Replicas
- Route all SELECT queries to a read replica
- Primary DB handles only writes
- **Tradeoff:** Slight replication lag, higher infrastructure cost.

### Recommended Approach
Combine **Redis caching** (Option 1) with **pagination** (Option 3):
- Cache paginated results per student
- Invalidate on new notification delivery
- Use a message queue (e.g. BullMQ) to handle cache invalidation asynchronously

---

## Stage 5 — Bulk Notification Reliability

### Proposed Pseudocode (Problematic)

```
function notify_all(student_ids: array, message: string):
  for student_id in student_ids:
    send_email(student_id, message)   # calls Email API
    save_to_db(student_id, message)   # DB insert
    push_to_app(student_id, message)  # real-time push
```

### Shortcomings

1. **Sequential processing** — iterating 50,000 students one by one is extremely slow
2. **No error handling** — if `send_email` fails at student 200, the loop stops; remaining 49,800 students never get notified
3. **Tight coupling** — email, DB save, and push happen together; if any one fails, the others may not execute
4. **No retry mechanism** — transient failures (network timeout, email API rate limit) are not retried
5. **Atomicity issue** — email may be sent but DB save fails, leading to inconsistent state

### Redesigned Approach

**Should saving to DB and sending email happen together?**
No. They should be decoupled. The DB save should happen first (as the source of truth), and the email/push should be triggered asynchronously via a message queue.

### Revised Pseudocode

```
function notify_all(student_ids: array, message: string):
  # Step 1: Save notification to DB once (not per student)
  notification_id = save_notification_to_db(message)

  # Step 2: Create student_notification records in bulk
  bulk_insert_student_notifications(student_ids, notification_id)

  # Step 3: Enqueue delivery jobs (non-blocking)
  for batch in chunk(student_ids, size=500):
    enqueue_job("send_notifications", { batch, notification_id, message })

# Worker processes jobs from queue
function worker_process(job):
  for student_id in job.batch:
    try:
      send_email(student_id, job.message)
      push_to_app(student_id, job.message)
      mark_delivered(student_id, job.notification_id)
    catch error:
      retry_with_backoff(job, student_id)  # exponential backoff
```

### Key Improvements
- **Bulk DB insert** instead of 50,000 individual inserts
- **Message queue** (BullMQ / RabbitMQ) decouples delivery from the main request
- **Batching** — process 500 students per worker job in parallel
- **Retry with backoff** — failed deliveries are retried without blocking others
- **DB is source of truth** — notification exists in DB regardless of email delivery status

---

## Stage 6 — Priority Inbox Algorithm

### Problem
Display the top 'n' most important unread notifications first. Priority is based on:
- **Weight**: Placement (3) > Result (2) > Event (1)
- **Recency**: More recent notifications rank higher within the same weight

### Approach: Max-Heap (Priority Queue)

A max-heap is the most efficient data structure for this problem:
- Insertion: O(log n)
- Extract top-n: O(n log k) where k = top-n count
- Handles streaming new notifications efficiently

### Priority Score Formula

```
score = weight * 1,000,000,000 + unix_timestamp
```

This ensures type weight always dominates, but within the same type, newer notifications rank higher.

### Weight Map

```
Placement → 3
Result    → 2
Event     → 1
```

### Handling New Notifications

When a new notification arrives:
1. Calculate its priority score
2. If heap size < n: push directly
3. If score > heap minimum: replace minimum with new notification
4. This maintains the top-n in O(log n) per insertion

See `priority_inbox.js` for the full implementation.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│         React App (Vite, localhost:3000)                │
│                                                         │
│  ┌──────────────┐    ┌──────────────────────────────┐  │
│  │  All Notifs  │    │     Priority Inbox Page       │  │
│  │  Page        │    │  (Top-n by weight + recency)  │  │
│  │  + Filters   │    │  + Filter by type             │  │
│  └──────────────┘    └──────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP (REST)
              ┌────────────┴────────────┐
              ▼                         ▼
┌──────────────────────┐   ┌────────────────────────────┐
│  Evaluation Server   │   │  Local Express Backend     │
│  /notifications API  │   │  /api/notifications        │
│  (GET with filters)  │   │  (CRUD + logging)          │
└──────────────────────┘   └────────────────────────────┘
                                        │
                           ┌────────────┴────────────┐
                           ▼                         ▼
                  ┌──────────────┐       ┌──────────────────┐
                  │ In-Memory    │       │ Logging Middleware│
                  │ Store        │       │ → Evaluation API  │
                  └──────────────┘       └──────────────────┘
```
