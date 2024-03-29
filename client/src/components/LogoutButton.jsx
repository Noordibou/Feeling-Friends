import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { logoutUser } from '../api/userApi.js'

const Logout = ({ location, btnColor }) => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);

  const handleLogout = async () => {
    try {
      console.log("logging out... on frontend hoome screen")
      removeCookie("token");
      localStorage.removeItem('userData');
      await logoutUser()
      console.log("Logout successful")

    } catch (error) {
      console.error("Logout Failed: ", error)
    }
    navigate("/login")
  };

  useEffect(() => {

  }, [cookies, navigate, removeCookie]);

  return (
    <>
      <div className={`${location === 'studentLogout' ? 'flex w-9/12 max-w-md items-center justify-center' : location === 'teacherLogout' ? '' : ''}`}>
        <button className={`text-body  ${location === 'studentLogout' ? `rounded w-full p-4 font-semibold  bg-${btnColor}` : location === 'teacherLogout' ? 'underline font-body' : ''}`} onClick={handleLogout}>
          Logout
        </button>
      </div>

    </>
  );
};

export default Logout;
