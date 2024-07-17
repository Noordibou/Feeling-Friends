import React, { useState } from "react";
import { motion } from "framer-motion";
import Exterior from "../../images/Exterior.png";
import Classroom from "../../images/Classroom.png";
import Goal from "../../images/Goal.png";
import Settings from "../../images/Settings.png";

const navs = [
  { url: "/teacher-home", image: Exterior, text: "Dashboard", color: "sky" },
  { url: "/edit-seating-chart", image: Classroom, text: "Edit", color: "grass" },
  { url: "/editneedsgoals/:teacherId/:classroomId", image: Goal, text: "Goals/Needs", color:"schoolBus" },  
  { url: "/edit/:teacherId", image: Settings, text: "Settings", color: "apple" }
];

export default function DesktopNav({ setIsEditMode, teacherId, classroomId, isOpen, toggle }) {
  const [isEditMode, setEditMode] = useState(false);

  const redirectTo = (url) => {
    window.location.href = url;
  };

  const handleItemClick = (url) => {
    if (url.includes(":teacherId")) {
      url = url.replace(":teacherId", teacherId);
    }
    if (url.includes(":classroomId")) {
      url = url.replace(":classroomId", classroomId);
    }
    redirectTo(url);
  };

  const handleEditClick = () => {
    const classroomPageUrl = `/classroom/${teacherId}/${classroomId}`;

    if (window.location.pathname === classroomPageUrl) {
      redirectTo(`/edit-seating-chart/${teacherId}/${classroomId}`);
    } else if (typeof setIsEditMode === 'function') {
      setIsEditMode((prevEditMode) => !prevEditMode);
    } else {
      alert("This page does not support edit mode.");
    }
  };

  return (
    <>
      <div
        className="justify-start lg:grid hidden w-36 h-screen bg-notebookPaper transition-all duration-500 ease-in-out z-10"
        style={{
          opacity: `${isOpen ? "1" : "0"}`,
          top: ` ${isOpen ? "0" : "-100%"}`
        }}
      >
        <button className="absolute left-0 p-2 -mt-16 ml-5 w-14 bg-notebookPaper" onClick={toggle}>
          {/* Close icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={34}
            height={38}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
            />
          </svg>
        </button>
        <div className={`${isOpen ? "" : "hidden"} flex flex-col w-96 mt-20  `}>
          {navs.map((item, index) => (
            <motion.div
              key={index}
              className={`bg-${item.color} w-[30%] h-36 flex flex-col items-center border-[1rem] border-${item.color} rounded-tr-3xl rounded-br-3xl ${item.text === "Edit" && isEditMode ? 'edit-mode' : ''} cursor-pointer`}
              onClick={() => item.text === "Edit" ? handleEditClick() : handleItemClick(item.url)}
              initial={{ x: 0 }}
              whileHover={{ width: '35%',  }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-center items-center"><img src={item.image} alt={item.text} /></div>
              <div><span className="font-poppins text-notebookPaper text-[12px]nav-text-shadow ">{item.text}</span></div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
