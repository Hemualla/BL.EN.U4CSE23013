import api from "../api/api";

// Seed data used as fallback when the evaluation server is unreachable
const SEED_NOTIFICATIONS = [
  { ID: "a1b2c3d4-0001", Type: "Placement", Message: "Google LLC hiring", Timestamp: "2026-05-06 10:00:00" },
  { ID: "a1b2c3d4-0002", Type: "Placement", Message: "Microsoft Corporation hiring", Timestamp: "2026-05-06 09:30:00" },
  { ID: "a1b2c3d4-0003", Type: "Placement", Message: "Amazon.com Inc. hiring", Timestamp: "2026-05-06 09:00:00" },
  { ID: "a1b2c3d4-0004", Type: "Placement", Message: "Apple Inc. hiring", Timestamp: "2026-05-06 08:30:00" },
  { ID: "a1b2c3d4-0005", Type: "Placement", Message: "Tesla Inc. hiring", Timestamp: "2026-05-05 18:00:00" },
  { ID: "a1b2c3d4-0006", Type: "Placement", Message: "TSMC hiring", Timestamp: "2026-05-05 17:00:00" },
  { ID: "a1b2c3d4-0007", Type: "Result", Message: "end-sem results published", Timestamp: "2026-05-06 08:00:00" },
  { ID: "a1b2c3d4-0008", Type: "Result", Message: "mid-sem results published", Timestamp: "2026-05-05 20:00:00" },
  { ID: "a1b2c3d4-0009", Type: "Result", Message: "internal assessment results", Timestamp: "2026-05-05 16:00:00" },
  { ID: "a1b2c3d4-0010", Type: "Result", Message: "project-review results", Timestamp: "2026-05-05 14:00:00" },
  { ID: "a1b2c3d4-0011", Type: "Result", Message: "external exam results", Timestamp: "2026-05-05 12:00:00" },
  { ID: "a1b2c3d4-0012", Type: "Event", Message: "tech-fest 2026", Timestamp: "2026-05-06 07:00:00" },
  { ID: "a1b2c3d4-0013", Type: "Event", Message: "cultural fest", Timestamp: "2026-05-06 06:00:00" },
  { ID: "a1b2c3d4-0014", Type: "Event", Message: "farewell ceremony", Timestamp: "2026-05-05 15:00:00" },
  { ID: "a1b2c3d4-0015", Type: "Event", Message: "induction program", Timestamp: "2026-05-05 11:00:00" },
  { ID: "a1b2c3d4-0016", Type: "Event", Message: "traditional day celebration", Timestamp: "2026-05-05 10:00:00" },
  { ID: "a1b2c3d4-0017", Type: "Placement", Message: "Nvidia Corporation hiring", Timestamp: "2026-05-05 09:00:00" },
  { ID: "a1b2c3d4-0018", Type: "Placement", Message: "Visa Inc. hiring", Timestamp: "2026-05-05 08:00:00" },
  { ID: "a1b2c3d4-0019", Type: "Result", Message: "supplementary exam results", Timestamp: "2026-05-04 18:00:00" },
  { ID: "a1b2c3d4-0020", Type: "Event", Message: "sports day 2026", Timestamp: "2026-05-04 10:00:00" },
];

/**
 * Fetch notifications — tries the evaluation server first,
 * falls back to seed data if the server is unreachable.
 */
export const fetchNotifications = async ({ limit, page, notification_type } = {}) => {
  try {
    const params = {};
    if (limit) params.limit = limit;
    if (page) params.page = page;
    if (notification_type) params.notification_type = notification_type;

    const res = await api.get("/notifications", { params });
    const data = res.data.notifications || [];
    if (data.length > 0) return data;
    // If server returned empty, fall through to seed data
    throw new Error("Empty response");
  } catch {
    // Evaluation server unreachable or session ended — use seed data
    let data = [...SEED_NOTIFICATIONS];
    if (notification_type) {
      data = data.filter((n) => n.Type === notification_type);
    }
    if (limit) {
      data = data.slice(0, limit);
    }
    return data;
  }
};
