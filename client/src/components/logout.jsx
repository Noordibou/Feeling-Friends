import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {logoutUser} from '../api/userApi.js'

const Logout = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);

  const logout = () => {
    console.log("logging out... on frontend hoome screen")
    logoutUser().then(() => {
      console.log("Logout successful")
    }).catch((error) => {
      console.error("Logout failed: ", error)
    })
    removeCookie("token");
    localStorage.removeItem('userData');
    navigate("/login")
  };

  useEffect(() => {

  }, [cookies, navigate, removeCookie]);
  
  return (
    <>
        <div className="flex w-9/12 max-w-md items-center justify-center">
            <button className="rounded w-full p-2 bg-lightOrange font-semibold text-body" onClick={logout}>Log Out</button>
        </div>
      
    </>
  );
};

export default Logout;
