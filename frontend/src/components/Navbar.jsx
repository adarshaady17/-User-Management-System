import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to={user.role === "admin" ? "/admin" : "/profile"}>
            User Management System
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-user-info">
            <span className="user-name">{user.fullName}</span>
            <span className={`user-role role-${user.role}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
          {user.role === "admin" && (
            <Link to="/admin" className="nav-link">
              Dashboard
            </Link>
          )}
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
