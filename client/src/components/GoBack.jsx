import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Back from "../images/go-back.png";



const GoBack = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    const goBack = () => {
        if (location.pathname.includes('/edit-seating-chart')) {
            const parts = location.pathname.split('/');
            const teacherId = parts[2];
            const classroomId = parts[3];
  
            navigate(`/classroom/${teacherId}/${classroomId}`);
        } else {
            navigate('/teacher-home');
        }
    }

    return (
      <button className="flex" onClick={goBack}>
        <svg
          className={``}
          width="70"
          height="70"
          viewBox="25 0 1 100"
          xmlns="http://www.w3.org/2000/svg"
        >
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
  }

export default GoBack;