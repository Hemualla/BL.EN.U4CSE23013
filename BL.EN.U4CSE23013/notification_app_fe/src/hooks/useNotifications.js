import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../services/notificationService";

const useNotifications = (filters = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useCallback stabilises the function reference so it can safely be
  // listed in the useEffect dependency array without causing infinite loops.
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(filters);
      setNotifications(data);
    } catch (err) {
      setError("Failed to load notifications from evaluation server");
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.limit, filters.page, filters.notification_type]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    error,
    reload: loadNotifications,
  };
};

export default useNotifications;
