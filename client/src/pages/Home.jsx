import Logo from "../images/logo.png";
import FriendWheel from "../images/friendwheel.png";
import Divider from "../images/divider.png";
import DarkLogo from "../images/darklogo.png";
import FriendFooter from "../images/friendfooter.png";
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
      <div className="flex h-screen">
        <div className="absolute top-0 pt-[4rem] pl-[4rem]">
          <img src={Logo} alt="logo" 
          className="w-[350px]" width={350} />
        </div>

        <div className="flex w-full justify-center items-center mt-[12rem]">
          <div className="w-[40%]">
            <p className="text-header1 font-header1">
              Having big feelings is tough. Feeling Friends can help.
            </p>
            <p className="text-lg font-poppins">
              <br />
              Help students get to know their emotions with a daily check-in and
              activity set, while helping teachers better manage their
              classrooms.
            </p>

            <div className="w-full flex justify-center mt-[2rem]">
            <a href="/signup"><Button buttonText="Get Started" /></a>
            </div>
            <p className="font-poppins text-md text-graphite flex justify-center mt-[2rem]">Already have an account?&nbsp;<a className="font-semibold underline" href="/login">Login</a></p>

          </div>
          <motion.div className="w-[35%]"
          animate={{ rotate: [0, 360] }}
          transition={{ 
          duration: 10, repeat: Infinity,  ease: "linear"}}
          >
            <img
              src={FriendWheel}
              alt="Friend Wheel"
              className="w-[60%] ml-auto mr-auto"
            />
          </motion.div>
        </div>
      </div>

      <div className="mb-[4rem]">
        <img src={Divider} alt="divider" className="ml-auto mr-auto" />
      </div>

      <div className="flex justify-center w-full ml-auto mr-auto">
        <div className="w-[20%] text-header2 font-header2">Student Check-In</div>
        <div className="w-[35%]">
          <ul className="font-poppins text-md">
            <li>🔍 Identification of student’s current emotion</li>
            <li>💗 Affirmation and coping strategies</li>
            <li>🧍Body check-in to self determine zone of regulation</li>
            <li>🥅 Student goals and needs self-assessment</li>
            <li>📚 Extra learning</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center w-full ml-auto mr-auto mt-[4rem]">
        <div className="w-[20%] text-header2 font-header2">Teacher Toolkit</div>
        <div className="w-[35%]">
          <ul className="font-poppins text-md">
            <li>🔋 Get a sense of classroom energy at a glance</li>
            <li>🪑 Customizable classroom seating chart </li>
            <li>🗒️ Keep student behavior notes and IEPs all in one place</li>
            <li>➕ Easily manage multiple unique classrooms</li>
          </ul>
        </div>
      </div>

      <div className="relative bg-sandwich w-full mt-[4rem] p-[2rem]">
      
      <img src={DarkLogo} alt="Dark Logo" />
      <p className="font-poppins text-md"><br/>
      <a href="/" className="underline">About</a> &nbsp;&nbsp;&nbsp;&nbsp; <a href="/" className="underline">Contact</a> &nbsp;&nbsp;&nbsp;&nbsp; <a href="/" className="underline">Team</a>
      </p>

       <div className="absolute bottom-0 right-[4rem]">
      <img src={FriendFooter} alt="Friend Footer" /></div>
      </div>
     
    </>
  );
};

export default Home;
