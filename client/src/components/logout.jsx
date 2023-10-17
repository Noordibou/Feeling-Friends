import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import {logoutUser} from '../api/userApi.js'

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");

  const Logout = () => {
    console.log("logging out... on frontend hoome screen")
    logoutUser().then(() => {
      console.log("Logout successful")
    }).catch((error) => {
      console.error("Logout failed: ", error)
    })
    removeCookie("token");
    localStorage.removeItem('userData');
  };


  useEffect(() => {

  }, [cookies, navigate, removeCookie]);


  
  return (
    <>
        <div className="flex w-screen items-center justify-center h-screen">
      
        </div>
      
    </>
  );
};

export default Home;
