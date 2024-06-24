import React, { useEffect, useState, useContext } from "react";
import SummaryPerson from "../../images/SummaryPerson.png";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Logout from "../../components/LogoutButton.jsx";
import ProgressBar from "../../components/ProgressBar";
import { getEmotionColor } from "../../utils/classroomColors.js";
import CopingSkillCard from "../../components/CopingSkillCard.jsx";
import withAuth from "../../hoc/withAuth.js";

const Summary = () => {
  const { userData } = useUser();
  const location = useLocation();
  const emotionFromParams = location.state?.emotion || "";
  const [emotionColor, setEmotionColor] = useState("")

  useEffect(() => {
    window.scrollTo(0, 0);
    if(emotionFromParams) {
      const color = getEmotionColor(emotionFromParams)
      setEmotionColor(color)
      console.log("emotion color: " + JSON.stringify(color))
    }
  }, [userData, emotionFromParams]);

  return (
    <>
      <div className="pt-[4rem] flex flex-col items-center min-h-screen">
        <div className="max-w-[1200px] ">
        <div className="flex w-full justify-center mb-20">
          <ProgressBar totalPages="5" currentPage="5" />
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

        <CopingSkillCard emotion={emotionFromParams.toLowerCase()} emotionColor={emotionColor}/>
        </div>
      </div>
    </>
  );
};

export default withAuth(['student'])(Summary)
