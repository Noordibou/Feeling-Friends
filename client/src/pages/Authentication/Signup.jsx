import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Button";
import { useAuth } from "./AuthContext";
import FriendsWaving from "../../images/friendswaving.svg";
import AboutFF from "../../images/aboutFF.svg";
import GitHub from "../../images/githubicon.svg";
import LinkedIn from "../../images/linkedinicon.svg";
import UserRole from "../../components/UserRole"
import NavLogo from "../../images/NavLogo.svg"
import Logo from "../../images/logolarge.svg"
import { handleError, handleSuccess } from "../../utils/toastHandling"

const Signup = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    role: "",
    userDetails: {
      firstName: "",
      lastName: "",
    }
  });
  const { email, password, confirmPassword, username, role, userDetails } = inputValue;

  const [toastShown, setToastShown] = useState(false);
  
  useEffect(() => {
    const storedData = sessionStorage.getItem('teacherDeleteInfo');

    if (storedData) {
      const { success, teacherName } = JSON.parse(storedData);

      if (success && !toastShown) {
        handleSuccess(`${teacherName} deleted successfully!`);
        setToastShown(true);
        // Clear the data from sessionStorage
        sessionStorage.removeItem('teacherDeleteInfo');
      }
    }
  }, [toastShown]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstname" || name === "lastname") {
      setInputValue({
        ...inputValue,
        userDetails: {
          ...inputValue.userDetails,
          [name === "firstname" ? "firstName" : "lastName"]: value,
        },
      });
    } else {
      setInputValue({
        ...inputValue,
        [name]: value,
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      handleError("Please choose a role!");
      return;
    }

    if (password !== confirmPassword) {
      handleError("Passwords do not match!");
      return;
    }

    if (password === "" || confirmPassword === "") {
      handleError("Please enter a password!");
      return;
    }

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_URL + "/signup",
        {
          email,
          password,
          username,
          role,
          userDetails
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);

        handleLogin(data.user);
        setTimeout(() => {
          if (inputValue.role === "student"){
            navigate("/student-home");
          } else {
            navigate("/teacher-home");
          }
          
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
      confirmPassword: "",
      username: "",
      role: "",
      userDetails: {
        firstName: "",
        lastName: "",
      }
    });
  };

  return (
    <div className="form_container flex flex-col min-w-screen min-h-screen items-center justify-center">
      {/* mobile logo */}
      <button aria-label="go to landing page" className="flex md:hidden w-full justify-center pt-[3rem] p-[1.5rem]" onClick={() => navigate("/")}>
        <img src={Logo} alt="logo" />
      </button>
      {/* desktop logo */}
      <button className="w-full" aria-label="go to landing page" onClick={() => navigate("/")}>
        <img
          src={NavLogo}
          alt="Exterior"
          width={56}
          height={12}
          className="hidden md:flex w-32 h-14 mt-6 self-start mx-14"
        />
      </button>
      <div className="flex flex-col w-10/12 sm:w-8/12 max-w-lg mt-10">
        {/* <h2 className="flex font-header2 text-header2 mb-4">Create Account</h2> */}

        <div className="flex flex-col mb-5 ">
          <h3 className="hidden md:flex py-5 text-[22px] font-bold text-center font-[Poppins] justify-center">
            What's your role?
          </h3>
          <UserRole
            buttonText1="I'm a teacher"
            buttonText2="I'm a student"
            setInputValue={setInputValue}
            inputValue={inputValue}
          />
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col my-3">
              <label
                className="text-sm sm:text-md ml-1 my-1 font-bold"
                htmlFor="firstname"
              >
                First Name
              </label>
              <input
                className="text-sm sm:text-md py-2 pl-4 rounded-xl border-[1px] border-graphite"
                type="text"
                name="firstname"
                value={userDetails.firstName}
                placeholder="Enter your first name"
                onChange={handleOnChange}
              />
            </div>
            <div className="flex flex-col my-3">
              <label
                className="text-sm sm:text-md ml-1 my-1 font-bold"
                htmlFor="lastname"
              >
                Last Name
              </label>
              <input
                className="text-sm sm:text-md py-2 pl-4 rounded-xl border-[1px] border-graphite"
                type="text"
                name="lastname"
                value={userDetails.lastName}
                placeholder="Enter your last name"
                onChange={handleOnChange}
              />
            </div>
            <div className="flex flex-col my-3">
              <label
                className="text-sm sm:text-md ml-1 my-1 font-bold"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="text-sm sm:text-md py-2 pl-4 rounded-xl border-[1px] border-graphite"
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={handleOnChange}
              />
            </div>
            <div className="flex flex-col my-3">
              <label
                className="text-sm sm:text-md ml-1 my-1 font-bold"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="text-sm sm:text-md py-2 pl-4 rounded-xl border-[1px] border-graphite"
                type="text"
                name="username"
                value={username}
                placeholder="Enter your username"
                onChange={handleOnChange}
              />
            </div>
            <div className="flex flex-col my-3">
              <label
                className="text-sm sm:text-md ml-1 my-1 font-bold"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="text-sm sm:text-md py-2 pl-4 rounded-xl border-[1px] border-graphite"
                type="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={handleOnChange}
              />
            </div>
            <div className="flex flex-col my-3">
              <label
                className="text-sm sm:text-md ml-1 my-1 font-bold"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="text-sm sm:text-md py-2 pl-4 rounded-xl border-[1px] border-graphite"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={handleOnChange}
              />
            </div>

            <div className="flex flex-col w-full text-center justify-around">
              <button
                className="mt-[1rem] w-full flex justify-center"
                type="submit"
              >
                <Button buttonText="Create Account" />
              </button>
              <span className="text-md pt-10 font-body text-lightGray">
                Already registered?{" "}
                <Link className="underline" to={"/login"}>
                  Log in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />

      {/* Footer - please delete once footer component is made */}
      <div className="flex max-sm:block justify-evenly bg-sandwich w-full mt-[4rem] p-[3rem] max-sm:p-[1.5rem]">
        <div>
          <img
            className="border-b-[0.2rem] border-notebookPaper mb-[1rem]"
            src={AboutFF}
            alt="About Feeling Friends"
          />
          <p className="font-poppins text-sm">
            Feeling Friends was born during a Hackathon in late 2023.
          </p>

          <div className="flex justify-between mt-[3rem]">
            <div>
              <ul>
                <li className="font-poppins font-semibold text-notebookPaper">
                  Software Development
                </li>
                <li className="font-poppins text-sm pt-[0.5rem] max-sm:text-xs">
                  Brianne Camesi{" "}
                  <a href="https://github.com/freckledspider">
                    <img className="inline" src={GitHub} />
                  </a>{" "}
                  <a href="https://www.linkedin.com/in/briannecamesi/">
                    <img className="inline" src={LinkedIn} />
                  </a>
                </li>
                <li className="font-poppins text-sm pt-[0.5rem] max-sm:text-xs">
                  Noor Dibou{" "}
                  <a href="https://github.com/Noordibou">
                    <img className="inline" src={GitHub} />
                  </a>{" "}
                  <a href="https://linkedin.com/in/noordibou/">
                    <img className="inline" src={LinkedIn} />
                  </a>
                </li>
                <li className="font-poppins text-sm pt-[0.5rem] max-sm:text-xs">
                  Alex Grimes{" "}
                  <a href="https://github.com/agrimes23">
                    <img className="inline" src={GitHub} />
                  </a>{" "}
                  <a href="https://www.linkedin.com/in/alex-grimes-dev/">
                    <img className="inline" src={LinkedIn} />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li className="font-poppins font-semibold text-notebookPaper">
                  User Experience Design
                </li>
                <li className="font-poppins text-sm pt-[0.5rem] max-sm:text-xs">
                  Anthony Sudol{" "}
                  <a href="https://github.com/howdytony">
                    <img className="inline" src={GitHub} />
                  </a>{" "}
                  <a href="https://www.linkedin.com/in/anthonysudol">
                    <img className="inline" src={LinkedIn} />
                  </a>
                </li>
                <li className="font-poppins text-sm pt-[0.5rem] max-sm:text-xs">
                  July Choi{" "}
                  <a href="#">
                    <img className="inline" src={LinkedIn} />
                  </a>
                </li>
                <li className="font-poppins text-sm pt-[0.5rem] max-sm:text-xs">
                  Sarah Shatto{" "}
                  <a href="#">
                    <img className="inline" src={LinkedIn} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <img
            className="max-sm:pt-[1rem]"
            src={FriendsWaving}
            alt="Friends Waving"
          />
        </div>
      </div>
      <div className="bg-sandwich w-full pb-[2rem] text-center font-poppins font-semibold text-xs">
        © 2024
      </div>
    </div>
  );
};

export default Signup;
