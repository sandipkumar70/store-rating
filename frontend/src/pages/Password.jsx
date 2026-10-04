import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Password() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleUpdate(e) {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    
    const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
    if (!passwordPattern.test(newPassword)) {
      setMessage("Password must be 8 to 16 characters with 1 uppercase letter and 1 special character");
      return;
    }

    try {
      await api.put("/auth/password", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      setIsSuccess(true);
      setMessage("Password updated");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || "Request failed, status " + err.response.status);
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
        <b>STORE RATING</b>
        <div className="nav-user">
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: "420px", margin: "0 auto" }}>
        <h3>Change Password</h3>

        <form onSubmit={handleUpdate}>
          <label htmlFor="oldPassword">Old Password</label>
          <input
            id="oldPassword"
            type="password"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
          />

          <label htmlFor="newPassword" style={{ display: "block", marginTop: "12px" }}>
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="8 to 16 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ display: "block", width: "100%", boxSizing: "border-box" }}
          />

          <button type="submit" style={{ marginTop: "16px", width: "100%" }}>
            Update Password
          </button>
        </form>

        {message && <p className={isSuccess ? "success" : "error"}>{message}</p>}
      </div>
    </div>
  );
}

export default Password;



