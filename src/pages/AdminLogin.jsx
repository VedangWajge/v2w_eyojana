import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // State for error or success messages
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    // Client-side validation
    if (!email || !password) {
      setMessage("Email and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If login is successful
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("userEmail", email); // Store the email in localStorage
        setMessage(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful! Redirecting...`);
        
        setIsLoggedIn({ status: true, email: email }); // Update state to store login status and email
        
        setTimeout(() => {
          if (role === "admin") {
            navigate("/adminhome"); // Redirect to the admin page for admins
          } else {
            navigate("/"); // Redirect to homepage for users
          }
        }, 2000);
      } else {
        // Handle specific login errors
        if (data.errors && data.errors.includes("User not found")) {
          setMessage("User not found. Please register before logging in.");
        } else if (data.errors && data.errors.includes("Invalid credentials")) {
          setMessage("Invalid email or password. Please try again.");
        } else {
          setMessage("Login failed. Please try again.");
        }
      }
      
    } catch (error) {
      setMessage("An error occurred while logging in. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes("successful") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <div className="signup-link">
          <p>
            New user? <Link to="/role-selection">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
