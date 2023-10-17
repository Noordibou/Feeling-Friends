import React, { useEffect, useState, useContext } from "react";
import SummaryPerson from "../../images/SummaryPerson.png";
import { AuthContext } from "../Authentication/AuthContext";
import emotionsExplained from '../../mockData/emotionData.js';
import { useLocation } from "react-router-dom";
import QuestionFrog from '../../images/Question_Frog.png';
import { useUser } from '../../context/UserContext';
import Logout from '../../components/LogoutButton.jsx'

// TODO: have it say a message based on whether they've selected check-in or check-out (currently line 70)

const Summary = () => {
  const auth = useContext(AuthContext);
  const objectID = auth.user ? auth.user._id : null;
  console.log("User's objectID:", JSON.stringify(objectID));
  const { userData } = useUser();
  const [emotion, setEmotion] = useState("");
  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";

  useEffect(() => {

  }, [userData]);

  // TODO: need to get it through context
  useEffect(() => {
    console.log("Location state:", location.state);
    console.log("Emotion from location:", location.state?.emotion);
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
      console.log("emotion object: " + JSON.stringify(emotionObject));
      return emotionObject.tips;
    } else {
      return [];
    }
  };

  return (
    <>
      <div className="pt-[8rem] min-h-screen">
        <div className="flex items-center justify-center">
          <img src={SummaryPerson} alt="SummaryPerson" className="h-42" />
        </div>

        <div className="w-9/12 text-center ml-auto mr-auto pt-[1.5rem]">
          <h1 className="font-header1 text-header1 leading-tight">
            {userData ? ("Thanks " + userData.firstName) : "Thanks!"} - Have a good day at school!
          </h1>
        </div>
        <div className="flex justify-center mt-10">
          <Logout/>
        </div>

        {/* bottom orange section */}
        <div className=" bg-lightOrange w-full h-10/12 pt-[1.5rem] rounded-[2rem] p-[2rem] mt-[4rem] flex flex-col
             rounded-b">
        
        {/* Learn more */}
          <div className="flex flex-row justify-around">
              <div>
                <h3 className="text-body">Getting to know our emotions can help with school success</h3>
                <h3 className="underline text-body font-body font-semibold mt-7">Learn more</h3>
              </div>
              <div className="mr-auto ml-auto ">
                <img src={QuestionFrog} alt="Avatar" className=" ml-auto mr-auto" />
              </div>
          </div>

          {/* emotion explanation */}
          <div className="mt-44">
            <div className="pl-[1rem]">
              <h2 className="font-header2 md:text-header2 text-md leading-tight">
                Being {emotionFromLocation.toLowerCase()} seems scary, but what is it really?
              </h2>
              <ul className="font-body leading-relaxed w-10/12">
                {getEmotionTips().map((tip, index) => (
                  <li className="list-disc text-sm mt-[1rem]" key={index}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Summary;
