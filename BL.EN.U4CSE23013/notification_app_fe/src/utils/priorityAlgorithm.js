/**
 * Priority calculation for notifications.
 * Weight: Placement (3) > Result (2) > Event (1)
 * Score = weight * 1,000,000,000 + timestamp
 */

const WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export const calculateScore = (notification) => {
  const weight = WEIGHTS[notification.Type] || 1;
  const timestamp = new Date(notification.Timestamp).getTime();
  return weight * 1_000_000_000 + timestamp;
};

export const getTopNPriority = (notifications, n = 10) => {
  return notifications
    .map((notif) => ({
      ...notif,
      score: calculateScore(notif),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
};
