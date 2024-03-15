import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import angryImg from '../images/angry.png'
import proudImg from '../images/proud.png'
import anxiousImg from '../images/anxious.png'
import sadImg from '../images/sad.png'
import happyImg from '../images/happy.png'
import scaredImg from '../images/scared.png'
import { useUser } from '../context/UserContext';
import ProgressBar from "../components/ProgressBar";
import CurvedWords from "../components/CurvedWord";

const StudentHome = () => {
  const navigate = useNavigate();

  const { userData, setIsCheckInOrOut, isCheckinOrOut } = useUser();
  const [greeting, setGreeting] = useState("")
  const [checkInBtn, setCheckInBtn] = useState("bg-white")
  const [checkOutBtn, setCheckOutBtn] = useState("bg-white")

  const handleClick = (click) => {

    setIsCheckInOrOut(click)
    // for button color:
    if (checkOutBtn === "bg-bg-white" && click === "checkout") {
      setCheckInBtn("bg-white")
      setCheckOutBtn("bg-lightOrange")
    } else if (checkOutBtn === "bg-lightOrange" && click === "checkout") {
      setCheckOutBtn("bg-lightOrange")
      setCheckInBtn("bg-white")
    } else if (checkInBtn === 'bg-white' && click === "checkin") {
      setCheckInBtn("bg-lightOrange")
      setCheckOutBtn("bg-white")
    } else {
      setCheckOutBtn("bg-lightOrange")
      setCheckInBtn("bg-white")
    }
  }

  const handleEmotion = (chosenEmotion) => {
    if (!isCheckinOrOut) {
      // temp fix, might create modal or something...?
      alert("Please choose checkin or checkout before choosing your feeling!")
    } else {
      navigate(`/emotion`, {
        state: {
          emotion: chosenEmotion,
        },
      })
    }
  }

  const checkTimeOfDay = () => {
    let date = new Date();
    let hour = date.getHours()

    if (hour < 12) {
      setGreeting("Good Morning")
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
  }

  useEffect(() => {
    checkTimeOfDay();
    console.log('student data:', userData);
  }, [userData]);

  return (
    <>
      {/* page container */}
      <div className="flex w-screen flex-col items-center bg-notebookPaper h-screen">
      <div className="flex w-full justify-center mt-20">
          <ProgressBar totalPages="6" currentPage="1"/>
        </div>
        {/* Check time Section */}
        <div className="mt-20 flex-col text-center">
          <h1 className="text-header1 font-header1">{userData ? (`${greeting}, ` + userData.firstName) : "Hello"}!</h1>
          <h2 className="text-header2 font-header2 mt-12">Is this a check in or check out?</h2>
          <div className="flex flex-row mt-8">
            <button className={`mx-3 border-2 border-lightOrange w-60 py-4 rounded font-body ${checkInBtn}`} onClick={() => handleClick("checkin")}>Check-in</button>
            <button className={`mx-3 border-2 border-lightOrange w-60 py-4 rounded font-body  ${checkOutBtn}`} onClick={() => handleClick("checkout")}>Check-out</button>
          </div>
        </div>
 
        <div className="mt-16">
          <h2 className="text-header2 font-header2 text-center">How are you feeling?</h2>
          <div className="">
            {/* first row */}
            <div className="w-screen max-w-lg flex justify-between my-14">
              <button className="rounded-full w-32 h-32 bg-lightYellow" onClick={() => handleEmotion("Proud")}>
                <img src={proudImg} alt="Proud Emoji" />
                <div className="flex flex-row justify-center">
                  <h3 className="text-[1.8rem] font-header2 rotate-[18deg] -translate-y-[0.5rem] tracking-[0.2rem]  ">P</h3>
                  <h3 className="text-[1.8rem] font-header2 rotate-[8deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">r</h3>
                  <h3 className="text-[1.8rem] font-header2 -translate-y-[0.1rem] tracking-[0.2rem]  ">o</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[8deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">u</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[18deg] -translate-y-[0.5rem] tracking-[0.2rem]  ">d</h3>
                </div>
              </button>
              <button className="rounded-full w-32 h-32 bg-lightOrange" onClick={() => handleEmotion("Nervous")}>
                <img src={anxiousImg} alt="Anxious Emoji" />
                <div className="flex flex-row justify-center">
                  <h3 className="text-[1.8rem] font-header2 rotate-[28deg] -translate-y-[1.1rem] tracking-[0.2rem]  ">N</h3>
                  <h3 className="text-[1.8rem] font-header2 rotate-[18deg] -translate-y-[0.5rem] tracking-[0.2rem]  ">e</h3>
                  <h3 className="text-[1.8rem] font-header2 rotate-[8deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">r</h3>
                  <h3 className="text-[1.8rem] font-header2 -translate-y-[0.1rem] tracking-[0.2rem] ">v</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[8deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">o</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[18deg] -translate-y-[0.5rem] tracking-[0.2rem]  ">u</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[28deg] -translate-y-[1.1rem] tracking-[0.2rem]  ">s</h3>
                </div>

              </button>
              <button className="rounded-full w-32 h-32 bg-lightBlue" onClick={() => handleEmotion("Sad")}>
                <img src={sadImg} alt="Sad Emoji" />
                <div className="flex flex-row justify-center">
                  <h3 className="text-[1.8rem] font-header2 rotate-[8deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">S</h3>
                  <h3 className="text-[1.8rem] font-header2 -translate-y-[0.1rem] tracking-[0.2rem] ">a</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[8deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">d</h3>
                </div>
              </button>
            </div>
            {/* second row */}
            <div className="w-screen max-w-lg flex justify-between my-14">
              <button className="rounded-full w-32 h-32 bg-darkTeal" onClick={() => handleEmotion("Happy")}>
                <img src={happyImg} alt="Happy Emoji" />
                <div className="flex flex-row justify-center">
                  <h3 className="text-[1.8rem] font-header2 rotate-[18deg] -translate-y-[0.5rem] tracking-[0.2rem]  ">H</h3>
                  <h3 className="text-[1.8rem] font-header2 rotate-[8deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">a</h3>
                  <h3 className="text-[1.8rem] font-header2 -translate-y-[0.1rem] tracking-[0.2rem]  ">p</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[8deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">p</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[18deg] -translate-y-[0.5rem] tracking-[0.2rem]  ">y</h3>
                </div>
              </button>
              <button className="rounded-full w-32 h-32 bg-lightLavender" onClick={() => handleEmotion("Scared")}>
                <img src={scaredImg} alt="Scared Emoji" />
                <div className="flex flex-row justify-center">
                  <h3 className="text-[1.8rem] font-header2 rotate-[28deg] -translate-y-[0.5rem] tracking-[0.2rem]  ">S</h3>
                  <h3 className="text-[1.8rem] font-header2 rotate-[18deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">c</h3>
                  <h3 className="text-[1.8rem] font-header2 rotate-[8deg] tracking-[0.2rem]  ">a</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[8deg] tracking-[0.2rem]  ">r</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[18deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">e</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[28deg] -translate-y-[0.5rem] tracking-[0.2rem]  ">d</h3>
                </div>
              </button>
              <button className="rounded-full w-32 h-32 bg-pink" onClick={() => handleEmotion("Angry")}>
                <img src={angryImg} alt="Angry Emoji" />
                <div className="flex flex-row justify-center">
                  <h3 className="text-[1.8rem] font-header2 rotate-[18deg] -translate-y-[0.5rem] tracking-[0.2rem]  ">A</h3>
                  <h3 className="text-[1.8rem] font-header2 rotate-[8deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">n</h3>
                  <h3 className="text-[1.8rem] font-header2 rotate-[0deg] tracking-[0.2rem]  ">g</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[8deg] -translate-y-[0.2rem] tracking-[0.2rem]  ">r</h3>
                  <h3 className="text-[1.8rem] font-header2 -rotate-[18deg] -translate-y-[0.5rem] tracking-[0.2rem]  ">y</h3>
                </div>
              </button>
            </div>
            <CurvedWords handleEmotion={handleEmotion}/>
          </div>
        </div>
      </div>
      </>
      );
}

      export default StudentHome;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";

// const StudentHome = () => {
//   const navigate = useNavigate();
//   const [cookies, removeCookie] = useCookies([]);
//   const [username, setUsername] = useState("");
//   // useEffect(() => {
//   //   const verifyCookie = async () => {
//   //     if (!cookies.token) {
//   //       navigate("/login");
//   //     }
//   //     const { data } = await axios.post(
//   //       "http://localhost:3001",
//   //       {},
//   //       { withCredentials: true }
//   //     );
//   //     const { status, user } = data;
//   //     setUsername(user);
//   //     return status
//   //       ? toast(`Hello ${user}`, {
//   //           position: "top-right",
//   //         })
//   //       : (removeCookie("token"), navigate("/login"));
//   //   };
//   //   verifyCookie();
//   // }, [cookies, navigate, removeCookie]);
//   const Logout = () => {
//     removeCookie("token");
//     navigate("/login");
//   };
//   return (
//     <>
//       <div className="home_page">
//         <h4>
//           {" "}
//           Welcome <span>{username}</span>
//         </h4>
//         <button onClick={}>LOGOUT</button>
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default StudentHome;