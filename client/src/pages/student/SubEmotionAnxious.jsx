import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import StudentCheckinContext from "../../context/CheckInContext";

const SubEmotionAnxious = () => {

  const navigate = useNavigate();

  const { studentCheckinData, updateFormState } = useContext(StudentCheckinContext);

  const handleEmotionClick = (chosenEmotion) => {
    updateFormState("emotion", chosenEmotion);
    navigate("/regzone", {
      state: {
        emotion: chosenEmotion
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">

      <div className="flex flex-col text-center">

        <div className=" font-header2 ">

          <h2>Choose the emotion closest to what you're feeling.</h2>
        </div>

        <div className="mt-5">
          <div onClick={() => handleEmotionClick("confused")}>Confused</div>
          <div onClick={() => handleEmotionClick("embarrassed")}>Embarrassed</div>
          <div onClick={() => handleEmotionClick("pressured")}>Pressured</div>
          <div onClick={() => handleEmotionClick("overwhelmed")}>Overwhelmed</div>
          <div onClick={() => handleEmotionClick("worried")}>Worried</div>
          <div onClick={() => handleEmotionClick("anxious")}>Anxious</div>
        </div>

        <div className="mt-5">
          <br />
          <a href="/subemotionproud">Proud</a>
          <a href="/subemotionsad">Sad</a> Icons
        </div>

        <div className="mt-5">
          <a href="/subemotionhappy">Happy</a>
          <a href="/subemotionangry">Angry</a> Icons
        </div>

        <div className="mt-5">
          <a href="/subemotionscared">Scared</a> Icon
        </div>

      </div>

    </div>

  );
}

export default SubEmotionAnxious;