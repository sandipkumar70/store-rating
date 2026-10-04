import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

    
    if (name.length < 20 || name.length > 60) {
      setError("Name must be between 20 and 60 characters");
      return;
    }

    if (address.length > 400) {
      setError("Address cannot be more than 400 characters");
      return;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
    if (!passwordPattern.test(password)) {
      setError("Password must be 8 to 16 characters with 1 uppercase letter and 1 special character");
      return;
    }

    try {
      await api.post("/auth/signup", {
        name: name,
        email: email,
        address: address,
        password: password,
      });

      
      navigate("/login");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>🏪 STORE RATING</h2>
        <p className="login-sub">Create your account</p>

        <form onSubmit={handleSignup}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name (20 to 60 characters)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="8 to 16 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign Up</button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="login-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;