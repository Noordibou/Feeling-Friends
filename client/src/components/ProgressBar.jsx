import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../images/backarrow.png"

const ProgressBar = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  }
  
  return (
    <>
        <div className="flex w-11/12 max-w-2xl ">
            <img className="ml-5" src={backArrow} onClick={goBack} />
            {/* outer progress bar */}
            <div className="border-4 border-sandwich ml-12 w-3/4 h-8 rounded-2xl flex items-center">
                {/* inner progress bar */}
                <div className="w-full bg-sandwich h-4 mx-1 flex my-auto rounded-2xl" />
            </div>
        </div>
    </>
  );
};

export default ProgressBar;
