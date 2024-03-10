import React, { useState } from "react";
import Exterior from "../images/Exterior.png";
import Classroom from "../images/Classroom.png";
import Goal from "../images/Goal.png";
import Settings from "../images/Settings.png";

export default function TeacherNavbar({ setIsEditMode }) {
  const [isEditMode, setEditMode] = useState(false);

  const redirectTo = (url) => {
    window.location.href = url;
  };

  const handleEditClick = () => {
    const supportsEditMode = typeof setIsEditMode === 'function';

    if (supportsEditMode) {
      // Toggle edit mode using the function passed down as a prop
      setIsEditMode((prevEditMode) => !prevEditMode);
  } else {
    // Display a message or perform some other action when edit mode is not supported
    alert("This page does not support edit mode.");
  }
  };

  return (
    <div className="flex w-full">
      <div className="bg-sky w-1/4 flex flex-col items-center border-[1rem] border-sky rounded-tl-[1rem]" onClick={() => redirectTo("/teacher-home")}>
        <div className="flex justify-center items-center"><img src={Exterior} alt="Home Exterior" /></div>
        <div><span className="font-poppins text-notebookPaper text-md nav-text-shadow">Dashboard</span></div>
      </div>

      <div className={`bg-grass w-1/4 flex flex-col items-center border-[1rem] border-grass ${isEditMode ? 'edit-mode' : ''}`} onClick={handleEditClick}>
        <div className="flex justify-center items-center"><img src={Classroom} alt="Classroom" /></div>
        <div><span className="font-poppins text-notebookPaper text-md nav-text-shadow">Edit</span></div>
      </div>

      <div className="bg-schoolBus w-1/4 flex flex-col items-center border-[1rem] border-schoolBus" onClick={() => redirectTo("/editneedsgoals")}>
        <div className="flex justify-center items-center"><img src={Goal} alt="Goal Target" /></div>
        <div><span className="font-poppins text-notebookPaper text-md nav-text-shadow">Goals/Needs</span></div>
      </div>

      <div className="bg-apple w-1/4 flex flex-col items-center border-[1rem] border-apple rounded-tr-[1rem]" onClick={() => redirectTo("/edit/:teacherId")}>
        <div className="flex justify-center items-center"><img src={Settings} alt="Settings" /></div>
        <div><span className="font-poppins text-notebookPaper text-md nav-text-shadow">Settings</span></div>
      </div>
    </div>
  );
}
