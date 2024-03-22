import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { logoutUser } from '../api/userApi.js'

const Logout = ({ location, btnColor, userData }) => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);

  const handleLogout = async () => {
    try {
      console.log("logging out... on frontend home screen")
      removeCookie("token");
      localStorage.removeItem('userData');
      await logoutUser();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout Failed: ", error);
    }
    navigate("/login");
  };

  useEffect(() => {
    // Add any necessary side effects
  }, [cookies, navigate, removeCookie]);

  const getButtonText = () => {
    if (location === 'teacherLogout') {
      return `Logged in as ${userData.firstName} ${userData.lastName} - Logout?`;
    } else if (location === 'settings') {
      return `Logout ${userData.firstName} ${userData.lastName}`;
    } else {
      return 'Logout';
    }
  };

  return (
    <div className={`${location === 'studentLogout' ? 'flex w-9/12 max-w-md items-center justify-center' : ''}`}>
      <button className={`text-body ${location === 'studentLogout' ? `rounded w-full p-4 font-semibold  bg-${btnColor}` : 'underline font-header3 text-sm lg:text-header3 text-graphite pt-4 md:pt-0'}`} onClick={handleLogout}>
        {getButtonText()}
      </button>
    </div>
  );
};

export default Logout;
