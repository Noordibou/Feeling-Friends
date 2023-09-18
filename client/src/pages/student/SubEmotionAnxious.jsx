import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import StudentCheckinContext from "../../context/CheckInContext";

const SubEmotionAnxious = () => {

  const navigate = useNavigate();

  const { studentCheckinData, updateFormState } = useContext(StudentCheckinContext);

  const handleEmotionClick = (emotion) => {
    updateFormState("emotion", emotion);
    navigate("/regzone");
  };

  return (
    <div className="flex items-center justify-center h-screen">

      <div className="flex flex-col text-center">

        <div className=" font-header2 ">

          <h2>Choose the emotion closest to</h2><span>what you're feeling.</span>
        </div>

        <div className="mt-5 font-header3">
          <div onClick={() => handleEmotionClick("Confused")}>Confused</div>
          <div onClick={() => handleEmotionClick("Embarrassed")}>Embarrassed</div>
          <div onClick={() => handleEmotionClick("Pressured")}>Pressured</div>
          <div onClick={() => handleEmotionClick("Overwhelmed")}>Overwhelmed</div>
          <div onClick={() => handleEmotionClick("Worried")}>Worried</div>
          <div onClick={() => handleEmotionClick("Anxious")}>Anxious</div>
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