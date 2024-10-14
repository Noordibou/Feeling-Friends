import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUnsavedChanges } from "../context/UnsavedChangesContext";

const GoBack = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasUnsavedChanges, openModal } = useUnsavedChanges();

  const redirectTo = (url) => {
    navigate(url);
  };

  const goBack = () => {
    let url;

    if (location.pathname.includes("/edit-seating-chart")) {
      const parts = location.pathname.split("/");
      const teacherId = parts[2];
      const classroomId = parts[3];
      url = `/classroom/${teacherId}/${classroomId}`;
    } else if (location.pathname.includes("/add-student")) {
      url = "/createclass";
    } else {
      url = "/teacher-home";
    }
    console.log("unsaved changes?? " + JSON.stringify(hasUnsavedChanges));
    if (hasUnsavedChanges) {
      openModal(() => redirectTo(url));
    } else {
      redirectTo(url);
    }
  };

  return (
    <button
      className="flex"
      onClick={goBack}
      aria-label="Go back"
      title="Go back"
    >
      <svg
        className={``}
        width="70"
        height="70"
        viewBox="25 0 1 100"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <title>Arrow pointing left to go back</title>
        <line
          x1="10"
          y1="50"
          x2="32"
          y2="35"
          stroke="#8D8772"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <line
          x1="10"
          y1="50"
          x2="32"
          y2="65"
          stroke="#8D8772"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};

export default GoBack;
