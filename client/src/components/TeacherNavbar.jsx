import React from 'react';
import { NavLink } from 'react-router-dom';
import Exterior from "../images/Exterior.png";
import Classroom from "../images/Classroom.png";
import Goal from "../images/Goal.png";
import Settings from "../images/Settings.png";

export default function TeacherNavbar() {
  // Function to generate tab style based on whether it's active
  const getTabStyle = ({ isActive }) => {
    return `font-poppins text-notebookPaper text-md nav-text-shadow ${isActive ? 'underline' : ''}`;
  };

  return (
    <div className="flex w-full">
      
        <div className="bg-sky w-1/4 flex flex-col items-center border-[1rem] border-sky rounded-tl-[1rem] font-semibold">
          <NavLink to="/teacher-home" className={getTabStyle}><div className="flex justify-center items-center"><img src={Exterior} alt="Home Exterior" /></div>
          <div>Dashboard</div></NavLink>
        </div>
      

      
        <div className="bg-grass w-1/4 flex flex-col items-center border-[1rem] border-grass font-semibold">
          <NavLink to="/teacher-home" className={getTabStyle}><div className="flex justify-center items-center"><img src={Classroom} alt="Classroom" /></div>
          <div>Edit Classes</div></NavLink>
        </div>
      

     
        <div className="bg-schoolBus w-1/4 flex flex-col items-center border-[1rem] border-schoolBus font-semibold">
           <NavLink to="/editneedsgoals" className={getTabStyle}><div className="flex justify-center items-center"><img src={Goal} alt="Goal Target" /></div>
          <div>Goals/Needs</div></NavLink>
        </div>
      

      
        <div className="bg-apple w-1/4 flex flex-col items-center border-[1rem] border-apple rounded-tr-[1rem] font-semibold">
          <NavLink to="/edit/:teacherId" className={getTabStyle}><div className="flex justify-center items-center"><img src={Settings} alt="Settings" /></div>
          <div>Settings</div></NavLink>
        </div>
      
    </div>
  );
};
