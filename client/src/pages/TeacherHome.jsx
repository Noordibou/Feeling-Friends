import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import URL from '../URL'

const TeacherHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  // useEffect(() => {
  //   const verifyCookie = async () => {
  //     if (!cookies.token) {
  //       navigate("/login");
  //     }
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
  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };
  return (
    <>
    <div>
      <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[4rem]">Good morning, name!</h1>

      {/* The div below needs to be scrollable but it refuses */}
      <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem] h-[80%] overflow-y-auto">
        <h2 className="text-header2 font-header2 text-center mb-[2rem]">All Classes at a Glance</h2>


      {/* Display one class */}
      <div className="mb-[3rem]">
      <h2 className="text-header2 font-header2 text-left">Class 1</h2>
      <div className="bg-notebookPaper p-[1rem] rounded-[1rem]">
        <div className="flex justify-between mb-[1rem]">
        <div className="text-sm font-body">Room 101</div>
        <div className="text-sm font-body text-sandwich">Check-in: 8AM &nbsp;&nbsp; Check-out: 2PM</div>
        </div>
        <div className="flex justify-between mb-[1rem]">
        <div className="bg-blue w-[80%] h-[2.5rem] rounded-[1rem]"></div><div className="text-body font-body"><a href="/viewclassroom">More &gt;</a></div>
        </div>
      </div>
      </div>
    {/* One Class end */}

    <div className="font-body text-body text-center pt-[2rem]">
    Logged in as <a href="/">Name (Edit)</a>
    </div>

      </div>
    </div>
      {/* <div className="home_page">
        <h4>
          {" "}
          Welcome <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer /> */}
    </>
  );
};

export default TeacherHome;