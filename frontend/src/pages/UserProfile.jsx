import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";
import "./Profile.css";

const UserProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toasts, removeToast, showError, showSuccess } = useToast();

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setProfileForm({
      fullName: user.fullName || "",
      email: user.email || "",
    });
  }, [user, navigate]);

  const validateProfile = () => {
    const newErrors = {};

    if (!profileForm.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (profileForm.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!profileForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordError = validatePassword(passwordForm.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    setProfileLoading(true);
    try {
      const res = await api.put("/users/profile", profileForm);
      if (res.data.success) {
        updateUser(res.data.user);
        showSuccess("Profile updated successfully!");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile";
      showError(message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.put("/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (res.data.success) {
        showSuccess("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to change password";
      showError(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="profile-card">
        <div className="profile-header">
          <h1>User Profile</h1>
          <p>Manage your account information and settings</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={`tab ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        {activeTab === "profile" && (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={profileForm.fullName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, fullName: e.target.value })
                }
                className={profileErrors.fullName ? "input-error" : ""}
                disabled={profileLoading}
                autoComplete="name"
              />
              {profileErrors.fullName && (
                <span className="error-message">{profileErrors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                className={profileErrors.email ? "input-error" : ""}
                disabled={profileLoading}
                autoComplete="email"
              />
              {profileErrors.email && (
                <span className="error-message">{profileErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label>Role</label>
              <input type="text" value={user.role} disabled className="input-disabled" />
            </div>

            <div className="form-group">
              <label>Status</label>
              <input type="text" value={user.status} disabled className="input-disabled" />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setProfileForm({
                    fullName: user.fullName || "",
                    email: user.email || "",
                  });
                  setProfileErrors({});
                }}
                disabled={profileLoading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                {profileLoading ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}

        {activeTab === "password" && (
          <form onSubmit={handlePasswordChange} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                className={passwordErrors.currentPassword ? "input-error" : ""}
                disabled={passwordLoading}
                autoComplete="current-password"
              />
              {passwordErrors.currentPassword && (
                <span className="error-message">{passwordErrors.currentPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className={passwordErrors.newPassword ? "input-error" : ""}
                disabled={passwordLoading}
                autoComplete="new-password"
              />
              {passwordErrors.newPassword && (
                <span className="error-message">{passwordErrors.newPassword}</span>
              )}
              {!passwordErrors.newPassword && passwordForm.newPassword && (
                <small className="form-hint">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                className={passwordErrors.confirmPassword ? "input-error" : ""}
                disabled={passwordLoading}
                autoComplete="new-password"
              />
              {passwordErrors.confirmPassword && (
                <span className="error-message">{passwordErrors.confirmPassword}</span>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setPasswordErrors({});
                }}
                disabled={passwordLoading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                {passwordLoading ? (
                  <>
                    <span className="spinner"></span>
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
