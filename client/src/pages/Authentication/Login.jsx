import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Button from "../../images/button.png";
import { useAuth } from "./AuthContext";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  const { handleLogin } = useAuth();

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

    if (!email || !password) {
      handleError("Please enter both email and password.");
      return;
    }

    try {
      const { data } = await axios.post(
        //FIXME: change back to: http://localhost:3001/login or https://mindful-journal-server.vercel.app/login
        "https://mindful-journal-server.vercel.app/login",
        { ...inputValue },
        { withCredentials: true }
      );

      console.log("Response from server:", data);

      const { success, message, redirectPath } = data;

      if (success) {
        handleSuccess(message);

        if (redirectPath) {
          navigate(redirectPath);
        }
        handleLogin(data.user); // Pass the user data from the response
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
    <div className="pt-[10rem]">
      <div className="form_container w-8/12 ml-auto mr-auto">

        {/* Image here */}

        <h2 className="font-header2 text-header2 leading-tight">Login</h2>

        <div>
          <div>
            {/* Image here */}
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <input className="w-[35rem] mt-[3rem] font-input text-lightGray p-[0.5rem]"
                type="email"
                name="email"
                value={email}
                placeholder="Email or Student ID"
                onChange={handleOnChange}
              />
            </div>

            <div>
              <div>
                {/* Image here */}
              </div>
              <input className="w-[35rem] mt-[2rem] font-input text-lightGray p-[0.5rem]"
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleOnChange}
              />
            </div>
            <button className="w-[35rem] h-[4.9375rem] mt-[2rem] text-notebookPaper font-button text-button" style={{ backgroundImage: `url(${Button})` }} type="submit">Login</button><br /><br />
            <div className="text-center font-input text-lightGray">
              New to our app? <a className="underline" href="/">Register</a>
            </div>
          </form>
        </div>


        <ToastContainer
          position="bottom-left"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="custom-toast" // Apply custom CSS classes to toast messages
        />
      </div>
    </div>
  );
};

export default Login;
