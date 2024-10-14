import React, { useState } from "react";
import Exterior from "../../images/Exterior.png";
import Classroom from "../../images/Classroom.png";
import Goal from "../../images/Goal.png";
import Settings from "../../images/Settings.png";
import NavButton from "../../images/NavButton.png";
import NavLogo from "../../images/NavLogo.png";
import { useNavigate } from "react-router-dom";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext";
import { handleError } from "../../utils/toastHandling";
import { ToastContainer } from "react-toastify";

const navs = [
  { url: "/teacher-home", image: Exterior, text: "Dashboard", color:"sky" },
  { url: "/edit-seating-chart", image: Classroom, text: "Edit", color:"grass" },
  { url: "/editneedsgoals/:teacherId/:classroomId", image: Goal, text: "Goals/Needs", color:"schoolBus" },
  { url: "/edit/:teacherId", image: Settings, text: "Settings", color:"apple" }
];

export default function MobileNavbar({ toggle, setIsEditMode, teacherId, classroomId}) {
  const [isEditMode, setEditMode] = useState(false);

  const {hasUnsavedChanges, openModal } = useUnsavedChanges();


  const navigate = useNavigate()
  const redirectTo = (url) => {
    window.location.href = url;
  };

  const handleItemClick = (url) => {
    let finalUrl = url
    if (url.includes(":teacherId")) {
      finalUrl = url.replace(":teacherId", teacherId);
    }
    if (url.includes(":classroomId")) {
      finalUrl = url.replace(":classroomId", classroomId);
    }
    if (hasUnsavedChanges) {
      openModal(() => redirectTo(finalUrl));
    } else {
      redirectTo(finalUrl);
    }
  };

  const handleEditClick = () => {
    const supportsEditMode = typeof setIsEditMode === 'function';
    const classroomPageUrl = `/classroom/${teacherId}/${classroomId}`;

    // Check if the current page is the classroom page
    if (window.location.pathname === classroomPageUrl) {
      redirectTo(`/edit-seating-chart/${teacherId}/${classroomId}`);
    } else if (supportsEditMode) {
      // Toggle edit mode using the function passed down as a prop
      setIsEditMode((prevEditMode) => !prevEditMode);
    } else {
      // Display a message or perform some other action when edit mode is not supported
      handleError("This page does not support edit mode.");
    }
  };

  return (
    <>
    <div className="hidden lg:inline-flex mt-4 ml-2">
    <button
          type="button"
          className="items-center m-3 mt-4"
          onClick={toggle}
        >
          <img src={NavButton} alt="Exterior" width={52} height={48}/>
        </button>
        <button aria-label="Go to teacher home" onClick={() => navigate("/teacher-home")}>
          <img src={NavLogo} alt="Exterior" width={56} height={12} className="w-24 h-12 mt-4" />
        </button>

    </div>
    <div className="flex w-full lg:hidden">
      {navs.map((item, index) => (
        <div
          key={index}
          className={`cursor-pointer bg-${item.color}  w-1/4 flex flex-col items-center border-[1rem] border-${item.color} ${item.text === "Edit" && isEditMode ? 'edit-mode' : ''} ${index === 0 ? 'rounded-tl-3xl' : ''} ${index === navs.length - 1 ? 'rounded-tr-3xl' : ''} `}
          onClick={() => item.text === "Edit" ? handleEditClick() : handleItemClick(item.url)}
        >
          <div className="flex justify-center items-center"><img src={item.image} alt={item.text} /></div>
          <div><span className="font-poppins text-notebookPaper text-md nav-text-shadow">{item.text}</span></div>
        </div>
      ))}
      <ToastContainer />
    </div>
    </>
  );
}