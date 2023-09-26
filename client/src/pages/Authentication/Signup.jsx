import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
    role: "student", 
  });
  const { email, password, username, role } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
  toast.error(err, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

const handleSuccess = (msg) =>
  toast.success(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          "https://mindful-journal-server.vercel.app/signup",
          {
            email,
            password,
            username,
            role, 
          },
          { withCredentials: true }
        );
        const { success, message } = data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          handleError(message);
        }
      } catch (error) {
        console.log(error);
      }
      setInputValue({
        email: "",
        password: "",
        username: "",
        role: "student", 
      });
    };
    

  return (
    <div className="form_container flex flex-col min-w-screen min-h-screen items-center">
      <div className="flex flex-col w-8/12 mt-44">
        <h2 className="flex bg-darkTeal font-header2 text-header2 mb-4 ">Sign up</h2>
        <div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col my-2">
            <label className="text-md ml-1" htmlFor="email">Email</label>
            <input
              className="text-md p-1 rounded"
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col my-2">
            <label className="text-md ml-1" htmlFor="username">Username</label>
            <input
              className="text-md p-1 rounded"
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col my-2">
            <label className="text-md ml-1" htmlFor="password">Password</label>
            <input
              className="text-md p-1 rounded"
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col my-2">
            <label className="text-md ml-1" htmlFor="role">Role</label>
            <select
              className="text-md ml-1"
              name="role"
              value={role}
              onChange={handleOnChange}
            >
              <option className="text-md p-1 rounded" value="student">Student</option>
              <option className="text-md p-1 rounded" value="teacher">Teacher</option>
            </select>
          </div>
          <button type="submit">Continue</button>
          <span>
            Already have an account? <Link to={"/login"}>Login</Link>
          </span>
        </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
