import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import StudentCheckinContext from "../../context/CheckInContext";
import orangewheel from "../../images/orangewheel.png"
import angryImg from '../../images/angry.png'
import proudImg from '../../images/proud.png'
import anxiousImg from '../../images/anxious.png'
import sadImg from '../../images/sad.png'
import happyImg from '../../images/happy.png'
import scaredImg from '../../images/scared.png'



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
        <div className="font-header2 text-header2">
          <h2>Choose the emotion closest to</h2>
          <span>what you're feeling.</span>
        </div>
        <div className="relative font-header3 -top-20 md:text-header3 text-[1.1rem]">
          <img src={orangewheel} alt="" className="w-[42.375rem] h-[42.375rem] object-fill" />
          <div className="absolute inset-0 flex flex-col items-center justify-center ">
            <div className="flex py-14">
              <div onClick={() => handleEmotionClick("Confused")} className="cursor-pointer px-12">Confused</div>
              <div onClick={() => handleEmotionClick("Embarrassed")} className="px-8 cursor-pointer">Embarrassed</div>
            </div>
            <div className="flex gap-10 ">
              <div onClick={() => handleEmotionClick("Pressured")} className=" px-6 py-12 cursor-pointer">Pressured</div>
              <img src={anxiousImg} alt="" className="w-32 h-32 object-fill " />
              <div onClick={() => handleEmotionClick("Overwhelmed")} className=" cursor-pointer py-12">Overwhelmed</div>
            </div>
            <div className="flex pt-16 ">
              <div onClick={() => handleEmotionClick("Worried")} className=" cursor-pointer px-12">Worried</div>
              <div onClick={() => handleEmotionClick("Anxious")} className="cursor-pointer px-8">Anxious</div>
            </div>
          </div>
        </div>
<div className="-mt-[30%] justify-center ">
        <div className=" px-18 flex justify-between">
          <button className="rounded-full w-18 h-18 bg-yellow p-2" href="/subemotionproud"><img src={proudImg} alt="" className="w-16 h-16 object-fill  " /></button>
          <button className="rounded-full w-18 h-18 bg-lightBlue p-2 " href="/subemotionsad"><img src={sadImg} alt="" className="w-16 h-16 object-fill " /></button>
        </div>

        <div className=" px-32 flex justify-between">
          <button className="rounded-full w-18 h-18 bg-darkTeal p-2" href="/subemotionhappy"><img src={happyImg} alt="" className="w-16 h-16 object-fill " /></button>
          <button className="rounded-full w-18 h-18 bg-pink p-2" href="/subemotionangry"><img src={angryImg} alt="" className="w-16 h-16 object-fill " /></button>
        </div>

        <div className="-mt-12 flex justify-center">
          <button className="rounded-full w-18 h-18 bg-lightLavender p-2" href="/subemotionscared"><img src={scaredImg} alt="" className="w-16 h-16 object-fill " /></button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default SubEmotionAnxious;
