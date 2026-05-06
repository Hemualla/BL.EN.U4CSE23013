import api from "../api/api";

/**
 * Fetch notifications from the evaluation server.
 * Supports query params: limit, page, notification_type
 */
export const fetchNotifications = async ({ limit, page, notification_type } = {}) => {
  const params = {};
  if (limit) params.limit = limit;
  if (page) params.page = page;
  if (notification_type) params.notification_type = notification_type;

  const res = await api.get("/notifications", { params });
  return res.data.notifications || [];
};
