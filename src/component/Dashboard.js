import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../dashboard.css";

const Dashboard = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active-link" : "";

  const dashboardItems = [
    { name: "Products", path: "/dashboard/products", icon: "🛒" },
    { name: "Categories", path: "/dashboard/categories", icon: "📂" },
    { name: "Subcategories", path: "/dashboard/subcategories", icon: "📁" },
    { name: "Orders", path: "/dashboard/orders", icon: "📦" },
    { name: "Users", path: "/dashboard/users", icon: "👤" },
    { name: "Analytics", path: "/dashboard/analytics", icon: "📊" },
    { name: "Messages", path: "/dashboard/messages", icon: "✉️" },
  ];

  return (
    <div className="d-flex vh-100 dashboard-wrapper">
      {/* Sidebar - original style */}
      <aside className="sidebar p-3">
        <div className="mb-4 text-center">
          <Link to="/">
            <img
              src="/images/photo1.jpeg"
              alt="Empire Design Logo"
              style={{
                width: "100px",
                height: "auto",
                borderRadius: "100%",
                marginBottom: "10px",
              }}
            />
          </Link>
          <h5 className="text-white fw-bold">
            <a href="/dashboard" className="text-white text-decoration-none">
              Admin Panel
            </a>
          </h5>
        </div>

        <ul className="nav flex-column">
          {dashboardItems.map((item) => (
            <li className="nav-item mb-2" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link sidebar-link ${isActive(item.path)}`}
              >
                <span className="me-2">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content - upgraded card design */}
      <main className="flex-grow-1 overflow-auto p-4 bg-light">
        {location.pathname === "/dashboard" ? (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {dashboardItems.map((item) => (
              <div className="col" key={item.path}>
                <Link to={item.path} className="text-decoration-none">
                  <div className="card dashboard-card text-white h-100">
                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                      <div className="dashboard-icon">{item.icon}</div>
                      <h5 className="card-title mt-3 text-center">
                        {item.name}
                      </h5>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
