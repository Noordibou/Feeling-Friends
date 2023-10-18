import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../images/backarrow.png"

const ProgressBar = ({ totalPages, currentPage }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  }

  const progressBarWidth = (currentPage / totalPages) * 100 + "%";
  
  return (
    <>
        <div className="flex w-11/12 max-w-2xl ">
            <img className="ml-5 w-[25px] h-[34px]" alt="back arrow" src={backArrow} onClick={goBack} />
            {/* outer progress bar */}
            <div className="border-4 border-sandwich ml-12 w-3/4 h-8 rounded-2xl flex items-center">
                {/* inner progress bar */}
                <div className=" bg-sandwich h-4 mx-1 flex my-auto rounded-2xl" 
                style={{ width: progressBarWidth }}
                />
            </div>
        </div>
    </>
  );
};

export default ProgressBar;
