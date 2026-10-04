import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Stores() {
  const [stores, setStores] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [ratingValues, setRatingValues] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  
  let userName = "";
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    userName = JSON.parse(savedUser).name;
  }

  
  async function loadStores() {
    try {
      const res = await api.get("/stores", {
        params: { search: search, sort: sort, order: order },
      });
      setStores(res.data);
    } catch (err) {
      setMessage("Could not load stores");
    }
  }

  useEffect(() => {
    loadStores();
  }, [search, sort, order]);


  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchText);
  }

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

  function chooseRating(storeId, value) {
    setRatingValues({ ...ratingValues, [storeId]: value });
  }

  async function submitRating(storeId) {
    const value = ratingValues[storeId];

    if (!value) {
      setMessage("Please select a rating first");
      return;
    }

    try {
      await api.post("/ratings", {
        store_id: storeId,
        rating: Number(value),
      });
      setMessage("Rating saved");
      loadStores();
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
    }
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
          <span>Welcome, <b>{userName}</b></span>
          <button onClick={() => navigate("/password")}>Change Password</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="page-header">
        <div className="page-icon">🏪</div>
        <div>
          <h2>Stores</h2>
          <p>Find and rate your favorite stores.</p>
        </div>
      </div>

      <div className="panel">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search "
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button type="submit">Search</button>
        </form>
      </div>

      {message && (
        <p className={message === "Rating saved" ? "success" : "error"}>
          {message}
        </p>
      )}

      <div className="panel">
        <div className="table-wrap" style={{ marginTop: 0 }}>
           <table className="stack-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort("name")}>
                  Store Name{arrow("name")}
                </th>
                <th className="sortable" onClick={() => handleSort("address")}>
                  Address{arrow("address")}
                </th>
                <th>Overall Rating</th>
                <th>My Rating</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty">
                    No stores found
                  </td>
                </tr>
              )}
              {stores.map((store) => (
                <tr key={store.id}>
                  <td data-label="Store Name">{store.name}</td>
                  <td data-label="Address">{store.address}</td>
                  <td data-label="Overall Rating">
                    <span className="stars">★ {store.overall_rating}</span>
                  </td>
                  <td data-label="My Rating">
                    {store.my_rating ? (
                      <span className="stars">★ {store.my_rating}</span>
                    ) : (
                      <span className="not-rated">Not rated</span>
                    )}
                  </td>
                  <td data-label="Rate">
                    <div className="rate-cell">
                      <select
                        value={ratingValues[store.id] || ""}
                        onChange={(e) => chooseRating(store.id, e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button onClick={() => submitRating(store.id)}>
                        {store.my_rating ? "Update" : "Submit"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Stores;