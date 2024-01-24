import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import URL from '../URL'
import Logout from '../components/LogoutButton.jsx'

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");


  useEffect(() => {
    const verifyCookie = async () => {
      const { data } = await axios.post(
        URL,
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);


  
  return (
    <>
    <div className="flex w-screen items-center justify-center h-screen">
      <div className="home_page">
        
        <div className="w-9/12 text-center ml-auto mr-auto pt-[1.5rem]">
            <h1 className="font-header1 text-header1 leading-tight">
              {username ? ("Thanks " + username) : "Thanks!"} - Have a good day at school!
            </h1>
          </div>
          <div className="flex justify-center mt-24 mb-32">
            <Logout/>
          </div>
      </div>
    </div>
      
    </>
  );
};

export default Home;

