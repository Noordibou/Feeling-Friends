import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Button";
import { handleError, handleSuccess } from "../../utils/toastHandling";
import NavLogo from "../../images/NavLogo.svg";
import Divider from "../../images/divider.png";
import Teachers from "../../images/teachers.svg";
import Students from "../../images/students.svg";
import LogoLarge from "../../images/logolarge.svg"

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      handleError("Please enter both email and password.");
      return;
    }

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_URL +"/login",
        { ...inputValue },
        { withCredentials: true }
      );


      const { success, message, redirectPath } = data;

      if (success) {
        handleSuccess(message);

        if (redirectPath) {
          navigate(redirectPath);
        }
        handleLogin(data.user); 
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
    <>
    <div>
      <img src={NavLogo} alt="Logo" className="mt-[25px] ml-[82px] hidden lg:block" />
      <img src={LogoLarge} alt="Logo" className="block lg:hidden w-[90%] ml-auto mr-auto mt-[25px]" />
    </div>
    <div className="h-screen pt-[2rem] flex justify-center">
      <div className="form_container">
        <h1 className="font-karla text-lg lg:text-xl font-semibold text-center lg:text-left">Welcome!</h1>

        <div className="mt-8">
          <span className="pl-[0.8rem] lg:pl-[0rem] font-karla text-md lg:text-lg font-bold">Email Address</span>
          <form onSubmit={handleSubmit}>
            <div className="text-center">
              <input
                className="w-[95%] lg:w-[35rem] mt-[0.2rem] 
                font-poppins text-sm lg:text-md text-graphite p-[0.5rem] border-2 border-graphite rounded-xl"
                type="email"
                name="email"
                value={email}
                placeholder="Email or Student ID"
                onChange={handleOnChange}
              />
            </div>
            <div className="mt-[1rem]">
            <span className="pl-[0.8rem] lg:pl-[0rem] font-karla text-md lg:text-lg font-bold">Password</span>
            </div>
            <div className="text-center">
              <input
                className="w-[95%] lg:w-[35rem] mt-[0.2rem] 
                font-poppins text-sm lg:text-md text-graphite p-[0.5rem] border-2 border-graphite rounded-xl"
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleOnChange}
              />
            </div>

            <div className="mt-[2rem] text-center"> 
              <Button 
                buttonText="Login"
                type="submit"
              />
            </div>

            {/* <button
              className="relative overflow-hidden w-[35rem] h-[4.9375rem] mt-[2rem] text-notebookPaper font-button text-button"
              type="submit"
            >
              <img className=" object-cover w-full" src={Button} />
              <h4 className="absolute text-[23px] font-[Poppins] inset-0 flex items-center justify-center text-white font-bold">Login</h4>
            </button> */}
            <div className="text-center font-input text-lightGray mt-4">
              New to our app?{" "}
              <a className="underline" href="/signup">
                Register
              </a>
              <img src={Divider} className="w-[95%] lg:w-[35rem] mt-10 mb-10 mx-auto" />
            </div>
          </form>
        </div>

        <ToastContainer
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Temporary fix for public to view a demo of both student and teacher views  */}
        {/* Normally, admin or teacher would register, because we want it to be secure */}
        <div className="w-[95%] lg:w-[35rem] mx-auto">
        <h3 className="font-poppins text-input text-center mb-[1rem]">Want to demo the app without registering?</h3>
        <div className="flex justify-between">

          <div className="cursor-pointer border-graphite border-[2px] border-dashed rounded-xl px-[1rem] lg:px-[2.5rem] w-[48%] hover:bg-lightSandwich"
          onClick={ () => {
            setInputValue({
              email: process.env.REACT_APP_DEMO_TEACHER_EMAIL,
              password: process.env.REACT_APP_DEMO_TEACHER_PW,
            })
          }}>
          <h4 className="text-header4 font-header4 text-center mt-[0.5rem]">Teacher View</h4>
          <img src={Teachers} className="ml-auto mr-auto mb-[0.5rem]"/>
          </div>

          <div className="cursor-pointer border-graphite border-[2px] border-dashed rounded-xl px-[1rem] lg:px-[2.5rem] w-[48%] hover:bg-lightSandwich"
          onClick={ () => {
            setInputValue({
              email: process.env.REACT_APP_DEMO_STUDENT_EMAIL,
              password: process.env.REACT_APP_DEMO_STUDENT_PW,
            })
          }}>
            <h4 className="text-header4 font-header4 text-center mb-[0.8rem] mt-[0.5rem]">Student View</h4>
            <img src={Students} className="ml-auto mr-auto" />
         </div>

          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
