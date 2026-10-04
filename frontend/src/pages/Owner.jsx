
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Owner() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const navigate = useNavigate();


  let userName = "";
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    userName = JSON.parse(savedUser).name;
  }

  
  async function loadDashboard() {
    try {
      const res = await api.get("/owner/dashboard");
      setData(res.data);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function handleSort(column) {
    if (sort === column) {
      if (order === "asc") {
        setOrder("desc");
      } else {
        setOrder("asc");
      }
    } else {
      setSort(column);
      setOrder("asc");
    }
  }

  
  function arrow(column) {
    if (sort !== column) {
      return "";
    }
    if (order === "asc") {
      return " ▲";
    }
    return " ▼";
  }

  
  let ratings = [];
  if (data) {
    ratings = [...data.ratings];
    ratings.sort((a, b) => {
      let result = 0;
      if (sort === "rating") {
        result = a.rating - b.rating;
      } else {
        result = String(a[sort]).localeCompare(String(b[sort]));
      }
      if (order === "desc") {
        result = -result;
      }
      return result;
    });
  }

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="page">
      <div className="navbar">
        <b>🏪 STORE RATING</b>
        <div className="nav-user">
          <div className="nav-info">
            <b>{userName}</b>
            <small>Store Owner</small>
          </div>
          <button onClick={() => navigate("/password")}>Change Password</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {message && <p className="error">{message}</p>}

      {data && (
        <div>
          <div className="page-header">
            <div className="page-icon">🏪</div>
            <div>
              <h2>{data.storeName}</h2>
              <p>Your store dashboard</p>
            </div>
          </div>

          <div className="cards">
            <div className="stat-card stat-amber">
              <div className="stat-icon">⭐</div>
              <div>
                <p className="stat-label">Average Rating</p>
                <p className="stat-value">★ {data.averageRating}</p>
                <p className="stat-note">Based on all ratings</p>
              </div>
            </div>

            <div className="stat-card stat-blue">
              <div className="stat-icon">💬</div>
              <div>
                <p className="stat-label">Total Ratings</p>
                <p className="stat-value">{data.ratings.length}</p>
                <p className="stat-note">From all users</p>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3>👥 Users who rated your store</h3>
            <p className="panel-sub">
              See all users who have given ratings to your store.
            </p>

            <div className="table-wrap" style={{ marginTop: 0 }}>
              <table className="stack-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort("name")}>
                      Name{arrow("name")}
                    </th>
                    <th className="sortable" onClick={() => handleSort("email")}>
                      Email{arrow("email")}
                    </th>
                    <th className="sortable" onClick={() => handleSort("rating")}>
                      Rating{arrow("rating")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.length === 0 && (
                    <tr>
                      <td colSpan="3" className="empty">
                        <div className="empty-state">
                          <div>📝</div>
                          <b>No ratings yet</b>
                          <p>When users rate your store, they will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {ratings.map((item, index) => (
                    <tr key={index}>
                      <td data-label="Name">{item.name}</td>
                      <td data-label="Email">{item.email}</td>
                      <td data-label="Rating">
                        <span className="stars">★ {item.rating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Owner;


