import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import ProgressBar from "../components/ProgressBar";
import CurvedWords from "../components/CurvedWord";
import subEmotionInfo from "../data/subEmotions";
import withAuth from "../hoc/withAuth";
import { checkTimeOfDay } from '../utils/dailyGreeting'
import { handleError } from "../utils/toastHandling";
import { ToastContainer } from "react-toastify";


const StudentHome = () => {
  const navigate = useNavigate();

  const { userData, setIsCheckInOrOut, isCheckinOrOut } = useUser();
  const [greeting, setGreeting] = useState(checkTimeOfDay());
  const [checkInBtn, setCheckInBtn] = useState("bg-white");
  const [checkOutBtn, setCheckOutBtn] = useState("bg-white");

  const handleClick = (click) => {
    setIsCheckInOrOut(click);
    // for button color:
    if (checkOutBtn === "bg-white" && click === "checkout") {
      setCheckInBtn("bg-white");
      setCheckOutBtn("bg-lightOrange");
    } else if (checkOutBtn === "bg-lightOrange" && click === "checkout") {
      setCheckOutBtn("bg-lightOrange");
      setCheckInBtn("bg-white");
    } else if (checkInBtn === "bg-white" && click === "checkin") {
      setCheckInBtn("bg-lightOrange");
      setCheckOutBtn("bg-white");
    } else {
      setCheckOutBtn("bg-lightOrange");
      setCheckInBtn("bg-white");
    }
  };

  const handleEmotion = (chosenEmotion) => {
    if (!isCheckinOrOut) {
      // temp fix, might create modal or something...?
      handleError("Please choose Check-in or Check-out first!");
    } else {
      navigate(`/emotion`, {
        state: {
          emotion: chosenEmotion,
          previousPage: '/student-home'
        },
      });
    }
  };

  const chunkedData = [];
  const chunkSize = 3;
  for (let i = 0; i < subEmotionInfo.length; i += chunkSize) {
    chunkedData.push(subEmotionInfo.slice(i, i + chunkSize));
  }


  return (
    <>
      {/* page container */}
      <div className="flex w-screen flex-col items-center bg-notebookPaper h-screen flex-grow">
        <div className="flex w-full justify-center mt-10 sm:mt-20">
          <ProgressBar totalPages="5" currentPage="1" />
        </div>
        {/* Check time Section */}
        <div className="flex pt-10 sm:pt-20 justify-center h-[80%] lg:h-auto flex-col text-center">
          <h1 className="text-[Karla] text-[25px] font-semibold sm:text-header1 sm:font-header1">
            {userData ? `${greeting}, ` + userData.firstName : "Hello"}!
          </h1>
          <h2 className="text-[Karla] text-[18px] font-semibold sm:text-header2 sm:font-header2 mt-4 sm:mt-12">
            Is this a check in or check out?
          </h2>
          <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row mt-8 items-center sm:items-baseline">
            <button
              className={`mx-3 border-2 border-lightOrange w-52 sm:w-60 py-2 sm:py-4 rounded text-[14px] font-[Poppins] sm:font-body ${checkInBtn}`}
              onClick={() => handleClick("checkin")}
            >
              Check-in
            </button>
            <button
              className={`mx-3 border-2 border-lightOrange w-52 sm:w-60 py-2 sm:py-4 rounded text-[14px] font-[Poppins] sm:font-body  ${checkOutBtn}`}
              onClick={() => handleClick("checkout")}
            >
              Check-out
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:pt-16 pb-10 h-full items-center">
          <h2 className="font-[Karla] font-semibold text-[18px] sm:text-header2 sm:font-header2 text-center">
            How are you feeling?
          </h2>
          <div className="h-full">
            {chunkedData.map((chunk, index) => (
                <div key={index} className="w-screen max-w-lg flex gap-8 justify-center md:justify-between mt-8 mb-10 md:my-14">
                  {chunk.map((emotionInfo, idx) => (
                    <CurvedWords
                      key={idx}
                      emotion={emotionInfo.emotion}
                      image={emotionInfo.eImage}
                      rotationList={emotionInfo.rotationList}
                      translateList={emotionInfo.translateList}
                      handleEmotion={handleEmotion}
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default withAuth(['student'])(StudentHome);