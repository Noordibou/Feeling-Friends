import React, { useRef, useEffect, useState, useContext } from "react";
import SummaryPerson from "../../images/SummaryPerson.png";
import emotionsExplained from "../../data/emotionData.js";
import { useLocation } from "react-router-dom";
import QuestionFrog from "../../images/Question_Frog.png";
import { useUser } from "../../context/UserContext";
import Logout from "../../components/LogoutButton.jsx";
import ProgressBar from "../../components/ProgressBar";
import { getEmotionColor } from "../../utils/classroomColors.js";
import CopingSkillCard from "../../components/CopingSkillCard.jsx";

const Summary = () => {
  const { userData } = useUser();
  const location = useLocation();
  const emotionFromParams = location.state?.emotion || "";
  const bottomContentRef = useRef();
  const [emotionColor, setEmotionColor] = useState("")

  useEffect(() => {
    window.scrollTo(0, 0);
    if(emotionFromParams) {
      setEmotionColor(getEmotionColor(emotionFromParams))
    }
  }, [userData]);

  return (
    <>
      <div className="pt-[4rem] min-h-screen">
        <div className="flex w-full justify-center mb-20">
          <ProgressBar totalPages="6" currentPage="6" />
        </div>

        <section>
          <div className="flex items-center justify-center">
            <img
              className="h-42 w-82"
              src={SummaryPerson}
              alt="SummaryPerson"
            />
          </div>

          <div className="w-9/12 text-center ml-auto mr-auto pt-[1.5rem]">
            <h1 className="font-header1 text-header1 leading-tight">
              {userData ? "Thanks " + userData.firstName : "Thanks!"} - Have a
              good day at school!
            </h1>
          </div>
          <div className="flex justify-center mt-24 mb-28">
            <Logout location="studentLogout" btnColor={emotionColor} />
          </div>
        </section>

        {/* bottom section */}

        <CopingSkillCard emotion={emotionFromParams.toLowerCase()} emotionColor={emotionColor} emotionFromParams={emotionFromParams}/>
        
      </div>
    </>
  );
};

export default Summary;
