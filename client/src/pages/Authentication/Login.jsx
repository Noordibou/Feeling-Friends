import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Button from "../../images/button.png";
import { useAuth } from "./AuthContext";
import "react-toastify/dist/ReactToastify.css";
import URL from '../../URL'

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
        URL+"/login",
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
    <div className="h-screen w-screen pt-[10rem] flex justify-center">
      <div className="form_container ">
        {/* Image here */}

        <h2 className="font-header2 text-header2 leading-tight">Login</h2>

        <div>
          <div>{/* Image here */}</div>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                className="w-[35rem] mt-[3rem] font-input text-black p-[0.5rem] border-2 border-black rounded"
                type="email"
                name="email"
                value={email}
                placeholder="Email or Student ID"
                onChange={handleOnChange}
              />
            </div>

            <div>
              <div>{/* Image here */}</div>
              <input
                className="w-[35rem] mt-[2rem] font-input text-lightGray p-[0.5rem] border-2 border-black text-black rounded"
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleOnChange}
              />
            </div>

            <button
              className="relative overflow-hidden w-[35rem] h-[4.9375rem] mt-[2rem] text-notebookPaper font-button text-button"
              type="submit"
            >
              <img className=" object-cover w-full" src={Button} />
              <h4 className="absolute text-[23px] font-[Poppins] inset-0 flex items-center justify-center text-white font-bold">Login</h4>
            </button>
            <div className="text-center font-input text-lightGray mt-4">
              New to our app?{" "}
              <a className="underline" href="/">
                Register
              </a>
            </div>
          </form>
        </div>

        {/* <ToastContainer
          position="bottom-left"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="custom-toast" // Apply custom CSS classes to toast messages
        /> */}

        {/* Temporary fix for public to view a demo of both student and teacher views  */}
        {/* Normally, admin or teacher would register, because we want it to be secure */}
        <div className="h-2/5 w-full flex justify-center items-center flex-col mt-10 border-4 border-lightGray rounded shadow-2xl bg-sandwich">
          <button className=" bg-lightOrange w-9/12 py-5 my-5 font-[Poppins] text-[25px] rounded shadow-lg"
          onClick={ () => {
            setInputValue({
              email: process.env.REACT_APP_DEMO_STUDENT_EMAIL,
              password: process.env.REACT_APP_DEMO_STUDENT_PW,
            })
          }}
          >
            <h4>See demo for Student View</h4>
          </button>
          <button className=" bg-darkTeal w-9/12 py-5 my-5 font-[Poppins] text-[25px] text-white rounded shadow-lg"
          onClick={ () => {
            setInputValue({
              email: process.env.REACT_APP_DEMO_TEACHER_EMAIL,
              password: process.env.REACT_APP_DEMO_TEACHER_PW,
            })
          }}>
            <h4>See demo for Teacher View</h4>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
