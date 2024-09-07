import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { logoutUser } from '../api/userApi.js'
import { useUnsavedChanges } from "../context/UnsavedChangesContext";

const Logout = ({ location, btnColor, userData }) => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);

  const { hasUnsavedChanges, openModal } = useUnsavedChanges();

  const redirectToLogin = async () => {
    try {
      removeCookie("token");
      localStorage.removeItem('userData');
      await logoutUser();
      console.log("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Logout Failed: ", error);
    }
  };

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      openModal(redirectToLogin); // Pass redirectToLogin as the callback
    } else {
      redirectToLogin();
    }
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
      <button className={`text-[18px] sm:text-body ${location === 'studentLogout' ? `rounded w-full p-4 font-semibold  bg-${btnColor}` : 'underline font-header3 text-sm lg:text-header3 text-graphite pt-4 md:pt-0'}`} onClick={handleLogout}>
        {getButtonText()}
      </button>
    </div>
  );
};

export default Logout;
