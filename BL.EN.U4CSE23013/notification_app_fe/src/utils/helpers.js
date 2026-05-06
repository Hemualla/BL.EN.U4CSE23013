/**
 * Formats an ISO timestamp into a readable date string.
 * e.g. "May 6, 2026, 10:30 AM"
 */
export const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Returns a CSS class name based on notification type.
 */
export const getTypeClass = (type) => {
  const map = {
    info: "type-info",
    warning: "type-warning",
    error: "type-error",
    success: "type-success",
  };
  return map[type] || "type-info";
};

/**
 * Capitalises the first letter of a string.
 */
export const capitalise = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
