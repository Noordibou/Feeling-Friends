import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import angryImg from '../images/angry.png'
import proudImg from '../images/proud.png'
import anxiousImg from '../images/anxious.png'
import sadImg from '../images/sad.png'
import happyImg from '../images/happy.png'
import scaredImg from '../images/scared.png'
import { useStudent } from '../context/StudentContext';

const StudentHome = () => {
  const navigate = useNavigate();

  const { studentData, setIsCheckInOrOut } = useStudent();
  const [checkInBtn, setCheckInBtn] = useState("bg-white")
  const [checkOutBtn, setCheckOutBtn] = useState("bg-white")

  const handleClick =(click) => {   

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

  const handleEmotion = (emotion) => {
    navigate(`/subemotion${emotion}`)
  }

useEffect(() => {

  console.log('student data:', studentData);
 

}, [studentData]);

  return (
    <>
    {/* page container */}
    <div className="flex w-screen flex-col items-center bg-notebookPaper">

      {/* Check time Section */}
      <div className="mt-20 flex-col text-center">
        <h1 className="text-header1 font-header1">{studentData ? ("Hello, " + studentData.firstName) : "Hello"}!</h1>
        <h2 className="text-header2 font-header2 mt-12">Is this a check in or check out?</h2>
        <div className="flex flex-row mt-8">
          <button className={`mx-3 border-2 border-lightOrange w-60 py-4 rounded font-body ${checkInBtn}`}onClick={() => handleClick("checkin")}>Check-in</button>
          <button className={`mx-3 border-2 border-lightOrange w-60 py-4 rounded font-body  ${checkOutBtn}`} onClick={() => handleClick("checkout")}>Check-out</button>
        </div>
      </div>

      {/* Emotions Section */}
      <div className="mt-20">
        <h2 className="text-header2 font-header2 text-center">How are you feeling?</h2>
        <div className="">
          {/* first row */}
          <div className="w-screen max-w-lg flex justify-between my-14">
            <button className="rounded-full w-32 h-32 bg-lightYellow" onClick={() => handleEmotion("proud")}><img src={proudImg} /></button>
            <button className="rounded-full w-32 h-32 bg-lightOrange" onClick={() => handleEmotion("anxious")}><img src={anxiousImg} /></button>
            <button className="rounded-full w-32 h-32 bg-lightBlue" onClick={() => handleEmotion("sad")}><img src={sadImg} /></button>
          </div>
          {/* second row */}
          <div className="w-screen max-w-lg flex justify-between my-14">
            <button className="rounded-full w-32 h-32 bg-darkTeal" onClick={() => handleEmotion("happy")}><img src={happyImg} /></button>
            <button className="rounded-full w-32 h-32 bg-lightLavender" onClick={() => handleEmotion("scared")}><img src={scaredImg} /></button>
            <button className="rounded-full w-32 h-32 bg-pink" onClick={() => handleEmotion("angry")}><img src={angryImg} /></button>
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