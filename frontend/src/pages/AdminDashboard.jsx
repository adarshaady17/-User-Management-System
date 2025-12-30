import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";
import Modal from "../components/Modal";
import "./Dashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toasts, removeToast, showError, showSuccess } = useToast();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchUsers(1);
  }, [user, navigate]);

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const res = await api.get(`/users?page=${page}&limit=10`);
      if (res.data.success) {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch users";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (userToUpdate, newStatus) => {
    setSelectedUser(userToUpdate);
    setSelectedAction(newStatus);
    setModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUser || !selectedAction) return;

    setActionLoading(selectedUser._id);
    try {
      const res = await api.put(`/users/${selectedUser._id}/status`, {
        status: selectedAction,
      });
      if (res.data.success) {
        showSuccess(`User ${selectedAction === "active" ? "activated" : "deactivated"} successfully`);
        setUsers(users.map((u) => (u._id === selectedUser._id ? res.data.user : u)));
        setModalOpen(false);
        setSelectedUser(null);
        setSelectedAction(null);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update user status";
      showError(message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge status-${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    return (
      <span className={`role-badge role-${role}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="dashboard-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
          setSelectedAction(null);
        }}
        title={`${selectedAction === "active" ? "Activate" : "Deactivate"} User`}
        onConfirm={confirmStatusChange}
        confirmText={actionLoading ? "Processing..." : "Confirm"}
      >
        <p>
          Are you sure you want to {selectedAction === "active" ? "activate" : "deactivate"}{" "}
          <strong>{selectedUser?.fullName}</strong> ({selectedUser?.email})?
        </p>
      </Modal>

      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all users in the system</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.email}</td>
                      <td>{u.fullName}</td>
                      <td>{getRoleBadge(u.role)}</td>
                      <td>{getStatusBadge(u.status)}</td>
                      <td>
                        {u.lastLogin
                          ? new Date(u.lastLogin).toLocaleString()
                          : "Never"}
                      </td>
                      <td>
                        {u.status === "active" ? (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleStatusChange(u, "inactive")}
                            disabled={actionLoading === u._id || u._id === user?._id}
                          >
                            {actionLoading === u._id ? (
                              <>
                                <span className="spinner"></span>
                                Processing...
                              </>
                            ) : (
                              "Deactivate"
                            )}
                          </button>
                        ) : (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusChange(u, "active")}
                            disabled={actionLoading === u._id}
                          >
                            {actionLoading === u._id ? (
                              <>
                                <span className="spinner"></span>
                                Processing...
                              </>
                            ) : (
                              "Activate"
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page === pagination.pages || loading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
