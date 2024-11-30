import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import "./AdminSignUp.css"; // Make sure to create this CSS file or adjust your existing one

const AdminSignUp = () => {
  const [adminname, setAdminname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const navigate = useNavigate();


  const handleAdminSignUp = async (event) => {
    event.preventDefault();

    if (!adminname || !email || !password || !phone_number) {
      console.error("All fields are required.");
      return;
    }

    console.log("Admin sign-up details:", { adminname, email, password, phone_number });

    // Implement sign-up logic for admins, such as an API call
    try {
      const response = await fetch("http://localhost:5000/api/admin/createadmin", { // Use your backend port
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone_number,
          password,
          adminname,
         
        }),
      });
      
   

      const data = await response.json();

      if (response.ok) {
        console.log("admin registered successfully:", data);
        navigate("/login"); // Redirect to login after successful signup
      } else {
        console.error("Sign-up failed:", data.errors);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
    }

  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2>Admin Sign Up</h2>
        <form onSubmit={handleAdminSignUp}>
          <div className="input-group">
            <label htmlFor="adminname">Admin Name</label>
            <input
              type="text"
              id="adminname"
              value={adminname}
              onChange={(e) => setAdminname(e.target.value)}
              required
            />
          </div>
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
          <div className="input-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              value={phone_number}
              onChange={(e) => setPhone_number(e.target.value)}
              required
            />
          </div>
      
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;
