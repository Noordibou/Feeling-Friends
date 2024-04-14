import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Exterior from "../images/Exterior.png";
import Classroom from "../images/Classroom.png";
import Goal from "../images/Goal.png";
import Settings from "../images/Settings.png";

export default function TeacherNavbar({ setIsEditMode, teacherId, classroomId }) {
  const [isEditMode, setEditMode] = useState(false);
  // Function to generate tab style based on whether it's active
  const getTabStyle = ({ isActive }) => {
    return `font-poppins text-notebookPaper text-md nav-text-shadow ${isActive ? 'underline' : ''}`;
  };

  const redirectTo = (url) => {
    window.location.href = url;
  };

  const handleEditClick = () => {
    const supportsEditMode = typeof setIsEditMode === 'function';
    const classroomPageUrl = `/classroom/${teacherId}/${classroomId}`;

    // Check if the current page is the classroom page
    if (window.location.pathname === classroomPageUrl) {
      setEditMode(!isEditMode)
      redirectTo(`/edit-seating-chart/${teacherId}/${classroomId}`);
    } else if (supportsEditMode) {
      // Toggle edit mode using the function passed down as a prop
      setEditMode(!isEditMode)
      setIsEditMode((prevEditMode) => !prevEditMode);
    } else {
      setEditMode(!isEditMode)
      // Display a message or perform some other action when edit mode is not supported
      alert("This page does not support edit mode.");
    }
  };

  return (
    <div className="flex w-full">
      
        <div className="bg-sky w-1/4 flex flex-col items-center border-[1rem] border-sky rounded-tl-[1rem] font-semibold">
          <NavLink to="/teacher-home" className={getTabStyle}><div className="flex justify-center items-center"><img src={Exterior} alt="Home Exterior" /></div>
          <div>Dashboard</div></NavLink>
        </div>
      

      
        <div className={`bg-grass w-1/4 flex flex-col items-center border-[1rem] border-grass font-semibold ${isEditMode ? 'edit-mode underline' : ''}`} onClick={handleEditClick}>
        <NavLink className={getTabStyle}>
          <div className="flex justify-center items-center"><img src={Classroom} alt="Classroom" /></div>
          <div>Edit Classes</div>
          </NavLink>
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