import Logo from "../images/logolarge.svg";
import FriendWheel from "../images/friendwheel.png";
import Divider from "../images/divider.png";
import DarkLogo from "../images/darklogo.png";
import FriendsWaving from "../images/friendswaving.svg";
import Teachers from "../images/teachers.svg";
import Students from "../images/students.svg";
import AboutFF from "../images/aboutFF.svg";
import GitHub from "../images/githubicon.svg";
import LinkedIn from "../images/linkedinicon.svg";

import Button from "../components/Button.jsx";
import { motion } from "framer-motion";

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import URL from '../URL'
// import Logout from '../components/LogoutButton.jsx'

const Home = () => {
  // const navigate = useNavigate();
  // const [cookies, removeCookie] = useCookies([]);
  // const [username, setUsername] = useState("");

  // useEffect(() => {
  //   const verifyCookie = async () => {
  //     const { data } = await axios.post(
  //       URL,
  //       {},
  //       { withCredentials: true }
  //     );
  //     const { status, user } = data;
  //     setUsername(user);
  //     return status
  //       ? toast(`Hello ${user}`, {
  //           position: "top-right",
  //         })
  //       : (removeCookie("token"), navigate("/login"));
  //   };
  //   verifyCookie();
  // }, [cookies, navigate, removeCookie]);

  return (
    <>
      <div className="h-full">
        <div className="flex w-full justify-center pt-[7rem] p-[1rem] max-sm:pt-[3rem] max-sm:p-[1.5rem]">
          <img src={Logo} alt="logo" />
        </div>

        <div className="flex max-sm:block w-full justify-center items-center mt-[5rem] max-sm:mt-[1rem] w-[50%]">
          <div className="w-[30%] max-sm:w-[100%] max-sm:p-[1.5rem]">
            <p className="text-header2 font-header2">
              Having big feelings is tough. Feeling Friends can help.
            </p>
            <p className="text-md font-poppins">
              <br />
              Help students get to know their emotions with a daily check-in and
              activity set, while helping teachers better manage their
              classrooms.
            </p>

            <div className="w-full flex justify-center mt-[2rem]">
              <a href="/signup">
                <Button buttonText="Get Started" />
              </a>
            </div>

            <div className="w-full flex justify-center mt-[2rem] text-sm font-poppins text-graphite">
              Already have an account?&ensp;
              <a className="font-semibold underline" href="/login">
                Login
              </a>
            </div>
          </div>
          <motion.div
            className="w-[25%] max-sm:w-[90%] max-sm:mt-[2rem] max-sm:ml-auto max-sm:mr-auto"
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <img
              src={FriendWheel}
              alt="Friend Wheel"
              className="w-[80%] ml-auto mr-auto"
            />
          </motion.div>
        </div>
      </div>

      <div className="mt-[5rem] mb-[5rem] max-sm:mt-[3rem] max-sm:mb-[3rem]">
        <img
          src={Divider}
          alt="divider"
          className="ml-auto mr-auto w-[898px] max-sm:w-[90%]"
        />
      </div>

      <div className="flex max-sm:block justify-center items-center w-full ml-auto mr-auto mt-[4rem] max-sm:mt-[0rem]">
        <div>
          <img className="max-sm:m-auto" src={Teachers} />
        </div>
        <div className="ml-[4rem] max-sm:m-[1.5rem]">
          <p className="text-header2 font-header2">Teacher Toolkit</p>
          <ul className="font-poppins text-sm max-sm:text-xs">
            <li>🔋 Get a sense of classroom energy at a glance</li>
            <li>🪑 Customizable classroom seating chart </li>
            <li>🗒️ Keep student behavior notes and IEPs all in one place</li>
            <li>➕ Easily manage multiple unique classrooms</li>
          </ul>
        </div>
      </div>

      <div className="flex max-sm:block justify-center w-full ml-auto mr-auto mt-[3rem] max-sm:mt-[0rem]">
        <div className="mr-[4rem] max-sm:m-[1.5rem]">
          <p className="text-header2 font-header2">Student Check-In</p>
          <ul className="font-poppins text-sm max-sm:text-xs">
            <li>🔍 Identification of student’s current emotion</li>
            <li>💗 Affirmation and coping strategies</li>
            <li>🧍Body check-in to self determine zone of regulation</li>
            <li>🥅 Student goals and needs self-assessment</li>
            <li>📚 Extra learning</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <img className="max-sm:m-auto max-sm:pt-[1rem]" src={Students} />
        </div>
      </div>

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
                  <a href="#">
                    <img className="inline" src={GitHub} />
                  </a>{" "}
                  <a href="#">
                    <img className="inline" src={LinkedIn} />
                  </a>
                </li>
                <li className="font-poppins text-sm pt-[0.5rem] max-sm:text-xs">
                  Noor Dibou{" "}
                  <a href="#">
                    <img className="inline" src={GitHub} />
                  </a>{" "}
                  <a href="#">
                    <img className="inline" src={LinkedIn} />
                  </a>
                </li>
                <li className="font-poppins text-sm pt-[0.5rem] max-sm:text-xs">
                  Alex Grimes{" "}
                  <a href="#">
                    <img className="inline" src={GitHub} />
                  </a>{" "}
                  <a href="#">
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
                  <a href="#">
                    <img className="inline" src={GitHub} />
                  </a>{" "}
                  <a href="#">
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
          <img className="max-sm:pt-[1rem]" src={FriendsWaving} alt="Friends Waving" />
        </div>
      </div>
      <div className="bg-sandwich w-full pb-[2rem] text-center font-poppins font-semibold text-xs">
      © 2024
      </div>
    </>
  );
};

export default Home;
