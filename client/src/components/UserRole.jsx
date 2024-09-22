import React from "react";
import femaleTeacher from "../images/role/female_teacher.png";
import maleTeacher from "../images/role/male_teacher.png";
import femaleStudent from "../images/role/femalestudent.png";
import maleStudent from "../images/role/malestudent.png";

const UserRole = ({ buttonText1, buttonText2, setInputValue, inputValue }) => {
  return (
    <div className="flex gap-3 self-center">
      {/* teacher */}
      <div>
        <button
          className={`w-36 xs:w-40 sm:w-72 h-36 rounded-xl border-2 border-dashed  border-graphite font-bold font-[Poppins] text-[16px] ${
            inputValue.role === "teacher" ? "bg-sandwich" : "bg-notebookPaper"
          }`}
          onClick={() => setInputValue({ ...inputValue, role: "teacher" })}
        >
          <h4 className="flex h-full pt-4 justify-center items-start">
            {buttonText1}
          </h4>
          {/* images */}
          <div className="relative">
            <img
              className="h-14 sm:h-auto absolute -top-24 left-3 sm:-top-28 sm:left-10 z-10"
              src={femaleTeacher}
              alt="teacher"
            />
            <img
              className="h-10 sm:h-auto absolute -top-[65px] left-[65px] sm:-top-[75px] sm:left-32"
              src={maleTeacher}
              alt="teacher"
            />
          </div>
        </button>
      </div>
      {/* student */}
      <div>
        <button
          className={`w-36 xs:w-40 sm:w-72 h-36 rounded-xl border-2 border-dashed border-graphite font-bold font-[Poppins] text-[16px] ${
            inputValue.role === "student" ? "bg-sandwich" : "bg-notebookPaper"
          }`}
          onClick={() => setInputValue({ ...inputValue, role: "student" })}
        >
          <h4 className="flex h-full pt-4 justify-center items-start">
            {buttonText2}
          </h4>
          {/* images */}
          <div className="relative">
            <img
              className="h-12 sm:h-auto absolute -top-[85px] left-[20px] sm:-top-24 sm:left-[75px]"
              src={femaleStudent}
              alt="student"
            />
            <img
              className="h-12 sm:h-auto absolute -top-[70px] left-[60px] sm:-top-[75px] sm:left-[130px]"
              src={maleStudent}
              alt="student"
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default UserRole;
