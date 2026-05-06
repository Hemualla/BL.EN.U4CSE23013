import React, { useState } from "react";
import Navbar from "../components/Navbar";
import NotificationCard from "../components/NotificationCard";
import useNotifications from "../hooks/useNotifications";

const Home = () => {
  const {
    notifications,
    loading,
    error,
    createNotification,
    deleteNotification,
    markAsRead,
  } = useNotifications();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim() || !formData.message.trim()) {
      setFormError("Title and message are required");
      return;
    }

    const result = await createNotification(formData);
    if (result.success) {
      setFormData({ title: "", message: "", type: "info" });
    } else {
      setFormError(result.message || "Failed to create notification");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      await deleteNotification(id);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <section className="form-section">
          <h2>Create Notification</h2>
          <form onSubmit={handleSubmit} className="notification-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notification title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter notification message"
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            {formError && <p className="error-message">{formError}</p>}

            <button type="submit" className="btn btn-primary">
              Create Notification
            </button>
          </form>
        </section>

        <section className="notifications-section">
          <h2>All Notifications</h2>

          {loading && <p className="loading-text">Loading notifications...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && !error && notifications.length === 0 && (
            <p className="empty-state">No notifications yet. Create one above!</p>
          )}

          <div className="notifications-grid">
            {notifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onDelete={handleDelete}
                onMarkRead={markAsRead}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
