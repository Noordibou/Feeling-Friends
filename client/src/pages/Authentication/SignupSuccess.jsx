import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../images/button.png";

const StudentHome = () => {
  const navigate = useNavigate();


  return (
    <>
        {/* page container */}
        <div className="flex flex-col min-w-screen">
            <h1>Success!</h1>
            <div className="flex flex-col h-96 text-center justify-around">
                <button className="w-full text-center rounded h-20 mt-[2rem] text-notebookPaper font-button text-button bg-no-repeat bg-contain" type="submit" style={{ backgroundImage: `url(${Button})` }}>Continue</button>
            </div>
        </div>
    </>
  );
}

export default StudentHome;