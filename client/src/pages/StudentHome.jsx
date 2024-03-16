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
import subEmotionInfo from "../data/subEmotions";

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
          <ProgressBar totalPages="6" currentPage="1" />
        </div>
        {/* Check time Section */}
        <div className="mt-20 flex-col text-center">
          <h1 className="text-header1 font-header1">
            {userData ? `${greeting}, ` + userData.firstName : "Hello"}!
          </h1>
          <h2 className="text-header2 font-header2 mt-12">
            Is this a check in or check out?
          </h2>
          <div className="flex flex-row mt-8">
            <button
              className={`mx-3 border-2 border-lightOrange w-60 py-4 rounded font-body ${checkInBtn}`}
              onClick={() => handleClick("checkin")}
            >
              Check-in
            </button>
            <button
              className={`mx-3 border-2 border-lightOrange w-60 py-4 rounded font-body  ${checkOutBtn}`}
              onClick={() => handleClick("checkout")}
            >
              Check-out
            </button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-header2 font-header2 text-center">
            How are you feeling?
          </h2>
          <div className="">
            {/* first row */}
            <div className="w-screen max-w-lg flex justify-between my-14">
            <CurvedWords
              emotion="Proud"
              image={proudImg}
              rotationList={subEmotionInfo[0].rotationList}
              translateList={subEmotionInfo[0].translateList}
              handleEmotion={handleEmotion}
            />
            <CurvedWords
              emotion="Nervous"
              image={anxiousImg}
              rotationList={subEmotionInfo[2].rotationList}
              translateList={subEmotionInfo[2].translateList}
              handleEmotion={handleEmotion}
            />
            <CurvedWords
              emotion="Sad"
              image={sadImg}
              rotationList={subEmotionInfo[1].rotationList}
              translateList={subEmotionInfo[1].translateList}
              handleEmotion={handleEmotion}
            />
          </div>
            {/* second row */}
            <div className="w-screen max-w-lg flex justify-between my-14">
            <CurvedWords
              emotion="Happy"
              image={happyImg}
              rotationList={subEmotionInfo[3].rotationList}
              translateList={subEmotionInfo[3].translateList}
              handleEmotion={handleEmotion}
            />
            <CurvedWords
              emotion="Scared"
              image={scaredImg}
              rotationList={subEmotionInfo[4].rotationList}
              translateList={subEmotionInfo[4].translateList}
              handleEmotion={handleEmotion}
            />
            <CurvedWords
              emotion="Angry"
              image={angryImg}
              rotationList={subEmotionInfo[5].rotationList}
              translateList={subEmotionInfo[5].translateList}
              handleEmotion={handleEmotion}
            />
          </div>

            
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