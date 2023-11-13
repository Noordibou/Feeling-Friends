import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import deepBreathing from "../../images/RegZoneDeepBreathingCard.png";
import imagineExercise from "../../images/coping skill card_ Overwhelmed.png";
import { useUser } from "../../context/UserContext";
import ProgressBar from "../../components/ProgressBar";

const Insight = () => {
    const navigate = useNavigate();
    const { updateUserDataAccumulated } = useUser();
    const [emotion, setEmotion] = useState("");
    const [sliderValue, setSliderValue] = useState(0);
    const location = useLocation();
    const emotionFromLocation = location.state?.emotion || "";
  
    useEffect(() => {
      const emotionFromParams = location.state?.emotion;
      if (emotionFromParams) {
        setEmotion(emotionFromParams);
      }
    }, [location.state?.emotion]);
  
    return (
      <>
        <div className="bg-notebookPaper pt-[3.5rem]">
        <div className="flex w-full justify-center mt-6 mb-10">
            <ProgressBar totalPages="6" currentPage="3"/>
          </div>
          <div className="w-11/12 text-center ml-auto mr-auto pt-[1rem]">
            <h2 className="font-header2 md:text-header2 text-header3 leading-tight mb-[5rem]">
            It’s normal to feel {emotionFromLocation.toLowerCase()}. Here's a coping skill that might help!
            </h2>
          </div>
  
          {/* emotion explanation */}
          <div className="bg-lightOrange w-11/12 pt-[1.rem] rounded-[2rem] p-2 mt-[2rem] ml-auto mr-auto flex items-center justify-center">
            <div className="">
              {emotionFromLocation === "Anxious" ? (
                <img className="h-80" src={deepBreathing} alt="Deep Breathing" />
              ) : (
                <img className="h-80" src={imagineExercise} alt="Imagine Exercise" />
              )}
            </div>
          </div>
  
          {/* Text under tip */}
          <div className="w-7/12 text-center ml-auto mr-auto md:pt-[2rem] py-[1rem] mt-[5rem] font-header2 md:text-header2 text-header3 leading-tight">
            <h2>Spend some time trying this skill and move on when you're ready.</h2>
           <a href="/regzone"><button className="mt-[5rem] rounded-[1rem] p-[1.5rem] bg-lightOrange text-header2 font-header2 w-[16rem]">Next</button></a>
          </div>
        </div>
      </>
    );
  };

export default Insight;
