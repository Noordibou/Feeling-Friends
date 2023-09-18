import React from "react";

const StudentHome = () => {
  return (
    <>
    <div>
      <h1>Hello, Name!</h1>
      <h2>Is this a check in or check out?</h2>
      <div>
        <button>Check In</button><br/>
        <button>Check-out</button>
      </div>
      <h2>How are you feeling?</h2>
      <div>
        <div><a href="/subemotionproud">Proud</a></div>
        <div><a href="/subemotionanxious">Anxious</a></div>
        <div><a href="/subemotionsad">Sad</a></div>
        <div><a href="/subemotionhappy">Happy</a></div>
        <div><a href="/subemotionscared">Scared</a></div>
        <div><a href="/subemotionangry">Angry</a></div>
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
//         <button onClick={Logout}>LOGOUT</button>
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default StudentHome;