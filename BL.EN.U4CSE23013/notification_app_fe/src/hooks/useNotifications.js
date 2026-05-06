import { useState, useEffect } from "react";
import { fetchNotifications } from "../services/notificationService";

const useNotifications = (filters = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
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
  };

  useEffect(() => {
    loadNotifications();
  }, [filters.limit, filters.page, filters.notification_type]);

  return {
    notifications,
    loading,
    error,
    reload: loadNotifications,
  };
};

export default useNotifications;
