import React, { useRef, useEffect, useState, useContext } from "react";
import SummaryPerson from "../../images/SummaryPerson.png";
import { AuthContext } from "../Authentication/AuthContext";
import emotionsExplained from '../../data/emotionData.js';
import { useLocation } from "react-router-dom";
import QuestionFrog from '../../images/Question_Frog.png';
import { useUser } from '../../context/UserContext';
import Logout from '../../components/LogoutButton.jsx'
import ProgressBar from "../../components/ProgressBar";

// TODO: have it say a message based on whether they've selected check-in or check-out (currently line 70)

const Summary = () => {
  const auth = useContext(AuthContext);
  const objectID = auth.user ? auth.user._id : null;
  console.log("User's objectID:", JSON.stringify(objectID));
  const { userData } = useUser();
  const [emotion, setEmotion] = useState("");
  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";
  const bottomContentRef = useRef()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [userData]);
  
  // TODO: need to get it through context
  useEffect(() => {
    const emotionFromParams = location.state?.emotion;
    if (emotionFromParams) {
      setEmotion(emotionFromParams);
    }
    console.log("Emotion:", emotion);
  }, [emotion, location.state]); 

  const getEmotionTips = () => {
    const emotionObject = emotionsExplained.find(
      (emotionObject) => emotionObject.emotion === emotionFromLocation
    );
    if (emotionObject) {
      return emotionObject.tips;
    } else {
      return [];
    }
  };

  return (
    <>
      <div className="pt-[4rem] min-h-screen">
        <div className="flex w-full justify-center mb-20">
          <ProgressBar totalPages="6" currentPage="6"/>
        </div>

        <section>
          <div className="flex items-center justify-center">
            <img className="h-42 w-82" src={SummaryPerson} alt="SummaryPerson"  />
          </div>

          <div className="w-9/12 text-center ml-auto mr-auto pt-[1.5rem]">
            <h1 className="font-header1 text-header1 leading-tight">
              {userData ? ("Thanks " + userData.firstName) : "Thanks!"} - Have a good day at school!
            </h1>
          </div>
          <div className="flex justify-center mt-24 mb-32">
            <Logout/>
          </div>
        </section>

        {/* bottom orange section */}
        <div className=" bg-lightOrange w-full h-8/12 rounded-[2rem] p-[2rem] flex flex-col
             rounded-b">
        
        {/* Learn more */}
          <section className="flex flex-row justify-around mt-2">
              <div className="w-8/12">
                <h2 className="text-[1.75rem] font-semibold font-karla">Getting to know our emotions can help with school success</h2>
                <h2 className="underline text-header2 font-karla font-body font-semibold mt-7"
                onClick={() => {
                  if (bottomContentRef.current) {
                    window.scrollTo({
                      top: bottomContentRef.current.offsetTop,
                      behavior: "smooth",
                    });
                  }
                }}
                >Learn more</h2>
              </div>
              <div className="">
                <img src={QuestionFrog} alt="Avatar" className="w-full h-full" />
              </div>
          </section>

          {/* emotion explanation */}
          <section className="mt-40 mb-20">
            <div className="flex flex-col items-center">
              <h2 className="font-header2 md:text-[2.5rem] text-md px-5">
                Being {emotionFromLocation.toLowerCase()} seems scary, but what is it really?
              </h2>
              <ul ref={bottomContentRef} className="font-body leading-relaxed w-8/12 flex flex-col justify-center mt-5">
                {getEmotionTips().map((tip, index) => (
                  <li className="list-disc text-sm mt-[1rem]" key={index}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Summary;
