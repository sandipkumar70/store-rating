import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Admin() {
  const [counts, setCounts] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  
  let userName = "";
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    userName = JSON.parse(savedUser).name;
  }


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");

  
  const [storeSearch, setStoreSearch] = useState("");
  const [storeSort, setStoreSort] = useState("name");
  const [storeOrder, setStoreOrder] = useState("asc");


  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [userMessage, setUserMessage] = useState("");

  
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [storeMessage, setStoreMessage] = useState("");

  async function loadCounts() {
    try {
      const res = await api.get("/admin/dashboard");
      setCounts(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadUsers() {
    try {
      const res = await api.get("/admin/users", {
        params: {
          name: name,
          email: email,
          address: address,
          role: role,
          sort: sort,
          order: order,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadStores() {
    try {
      const res = await api.get("/stores", {
        params: { search: storeSearch },
      });
      setStores(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadCounts();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [name, email, address, role, sort, order]);

  useEffect(() => {
    loadStores();
  }, [storeSearch]);


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

  
  function handleStoreSort(column) {
    if (storeSort === column) {
      if (storeOrder === "asc") {
        setStoreOrder("desc");
      } else {
        setStoreOrder("asc");
      }
    } else {
      setStoreSort(column);
      setStoreOrder("asc");
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
  

  function storeArrow(column) {
    if (storeSort !== column) {
      return "";
    }
    if (storeOrder === "asc") {
      return " ▲";
    }
    return " ▼";
  }

  
  const sortedStores = [...stores];
  sortedStores.sort((a, b) => {
    let result = 0;
    if (storeSort === "overall_rating") {
      result = Number(a.overall_rating) - Number(b.overall_rating);
    } else {
      result = String(a[storeSort]).localeCompare(String(b[storeSort]));
    }
    if (storeOrder === "desc") {
      result = -result;
    }
    return result;
  });

  
  async function viewUser(id) {
    try {
      const res = await api.get("/admin/users/" + id);
      setSelectedUser(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleAddUser(e) {
    e.preventDefault();

    try {
      await api.post("/admin/users", {
        name: newName,
        email: newEmail,
        address: newAddress,
        password: newPassword,
        role: newRole,
      });

      setUserMessage("User added");
      setNewName("");
      setNewEmail("");
      setNewAddress("");
      setNewPassword("");
      loadUsers();
      loadCounts();
    } catch (err) {
      if (err.response) {
        setUserMessage(err.response.data.message);
      } else {
        setUserMessage("Something went wrong");
      }
    }
  }

  async function handleAddStore(e) {
    e.preventDefault();

    
    let owner = null;
    if (ownerId !== "") {
      owner = Number(ownerId);
    }

    try {
      await api.post("/stores", {
        name: storeName,
        email: storeEmail,
        address: storeAddress,
        owner_id: owner,
      });

      setStoreMessage("Store added");
      setStoreName("");
      setStoreEmail("");
      setStoreAddress("");
      setOwnerId("");
      loadStores();
      loadCounts();
    } catch (err) {
      if (err.response) {
        setStoreMessage(err.response.data.message);
      } else {
        setStoreMessage("Something went wrong");
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
          <div className="nav-info">
            <b>{userName}</b>
            <small>Admin</small>
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="page-header">
        <div className="page-icon">📊</div>
        <div>
          <h2>Admin Dashboard</h2>
          <p>Manage users, stores and ratings.</p>
        </div>
      </div>

      <div className="cards">
        <div className="stat-card stat-blue">
          <div className="stat-icon">👥</div>
          <div>
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{counts.totalUsers}</p>
            <p className="stat-note">Registered on the platform</p>
          </div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-icon">🏪</div>
          <div>
            <p className="stat-label">Total Stores</p>
            <p className="stat-value">{counts.totalStores}</p>
            <p className="stat-note">Listed for rating</p>
          </div>
        </div>

        <div className="stat-card stat-amber">
          <div className="stat-icon">⭐</div>
          <div>
            <p className="stat-label">Total Ratings</p>
            <p className="stat-value">{counts.totalRatings}</p>
            <p className="stat-note">Submitted by users</p>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Add User</h3>
        <form className="form-row" onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Name (20 to 60 characters)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="owner">owner</option>
          </select>
          <button type="submit">Add User</button>
        </form>
        {userMessage && (
          <p className={userMessage === "User added" ? "success" : "error"}>
            {userMessage}
          </p>
        )}
      </div>

      <div className="panel">
        <h3>Add Store</h3>
        <form className="form-row" onSubmit={handleAddStore}>
          <input
            type="text"
            placeholder="Store name (20 to 60 characters)"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Store email"
            value={storeEmail}
            onChange={(e) => setStoreEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Store address"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
          />
          <input
            type="number"
            placeholder="Owner user id (optional)"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
          />
          <button type="submit">Add Store</button>
        </form>
        {storeMessage && (
          <p className={storeMessage === "Store added" ? "success" : "error"}>
            {storeMessage}
          </p>
        )}
      </div>

      <div className="panel">
        <h3>🏪 Stores ({stores.length})</h3>
        <p className="panel-sub">Search and sort all registered stores.</p>
        <div className="form-row">
          <input
            className="search-input"
            type="text"
            placeholder="Search stores"
            value={storeSearch}
            onChange={(e) => setStoreSearch(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table className="stack-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleStoreSort("name")}>
                  Name{storeArrow("name")}
                </th>
                <th className="sortable" onClick={() => handleStoreSort("email")}>
                  Email{storeArrow("email")}
                </th>
                <th className="sortable" onClick={() => handleStoreSort("address")}>
                  Address{storeArrow("address")}
                </th>
                <th
                  className="sortable"
                  onClick={() => handleStoreSort("overall_rating")}
                >
                  Rating{storeArrow("overall_rating")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStores.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty">
                    <div className="empty-state">
                      <div>📝</div>
                      <b>No stores found</b>
                      <p>Stores you add will appear here.</p>
                    </div>
                  </td>
                </tr>
              )}
              {sortedStores.map((store) => (
                <tr key={store.id}>
                  <td data-label="Name">{store.name}</td>
                  <td data-label="Email">{store.email}</td>
                  <td data-label="Address">{store.address}</td>
                  <td data-label="Rating">
                    <span className="stars">★ {store.overall_rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="panel">
          <h3>User Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <small>Name</small>
              <b>{selectedUser.name}</b>
            </div>
            <div className="detail-item">
              <small>Email</small>
              <b>{selectedUser.email}</b>
            </div>
            <div className="detail-item">
              <small>Address</small>
              <b>{selectedUser.address}</b>
            </div>
            <div className="detail-item">
              <small>Role</small>
              <b>{selectedUser.role}</b>
            </div>
            {selectedUser.role === "owner" && (
              <div className="detail-item">
                <small>Store Rating</small>
                <b className="stars">★ {selectedUser.rating}</b>
              </div>
            )}
          </div>
          <button onClick={() => setSelectedUser(null)}>Close</button>
        </div>
      )}

      <div className="panel">
        <h3>👥 Users ({users.length})</h3>
        <p className="panel-sub">Filter, sort and view details of all users.</p>
        <div className="form-row">
          <input
            type="text"
            placeholder="Filter by name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
            <option value="owner">owner</option>
          </select>
        </div>

        <div className="table-wrap">
          <table className="stack-table">
            <thead>
              <tr>
                <th>ID</th>
                <th className="sortable" onClick={() => handleSort("name")}>
                  Name{arrow("name")}
                </th>
                <th className="sortable" onClick={() => handleSort("email")}>
                  Email{arrow("email")}
                </th>
                <th className="sortable" onClick={() => handleSort("address")}>
                  Address{arrow("address")}
                </th>
                <th className="sortable" onClick={() => handleSort("role")}>
                  Role{arrow("role")}
                </th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">
                    <div className="empty-state">
                      <div>📝</div>
                      <b>No users found</b>
                      <p>Try changing the filters.</p>
                    </div>
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id}>
                  <td data-label="ID">{user.id}</td>
                  <td data-label="Name">{user.name}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Address">{user.address}</td>
                  <td data-label="Role">
                    <span className={"badge badge-" + user.role}>{user.role}</span>
                  </td>
                  <td data-label="Details">
                    <button className="view-btn" onClick={() => viewUser(user.id)}>
                      View
                    </button>
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

export default Admin;