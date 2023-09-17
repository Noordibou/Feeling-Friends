import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!email || !password) {
        handleError("Please enter both email and password.");
        return;
      }
    
      try {
        const { data } = await axios.post(
          "http://localhost:3001/login",
          { ...inputValue },
          { withCredentials: true }
        );
    
        console.log("Response from server:", data);
    
        const { success, message, user } = data;
    
        if (success) {
          handleSuccess(message);
    
          if (user) {
            console.log("User role:", user.role);
            if (user.role === "student") {
              navigate("/student-home");
            } else {
              navigate("/teacher-home");
            }
          }
        } else {
          handleError(message);
        }
      } catch (error) {
        console.error(error);
      }
    
      setInputValue({
        ...inputValue,
        email: "",
        password: "",
      });
    };    

  return (
    <div className="form_container">
      <h2>Login Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Submit</button>
        <span>
          Already have an account? <Link to={"/signup"}>Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
