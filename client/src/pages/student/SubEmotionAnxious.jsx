import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import StudentCheckinContext from "../../context/CheckInContext";
import { useStudent } from "../../context/StudentContext";
import orangewheel from "../../images/orangewheel.png"
import angryImg from '../../images/angry.png'
import proudImg from '../../images/proud.png'
import anxiousImg from '../../images/anxiousNoBg.png'
import sadImg from '../../images/sad.png'
import happyImg from '../../images/happy.png'
import scaredImg from '../../images/scared.png'



const SubEmotionAnxious = () => {
  const navigate = useNavigate();
  const { studentData, updateStudentDataAccumulated } = useStudent();
  const { studentCheckinData, updateFormState } = useContext(StudentCheckinContext);

  const handleEmotionClick = (chosenEmotion) => {
    
    updateStudentDataAccumulated({["emotion"]: chosenEmotion});
    navigate("/regzone", {
      state: {
        emotion: chosenEmotion
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col text-center">
        <div className="font-header2 text-header1">
          <h2>Choose the emotion closest to</h2>
          <span>what you're feeling.</span>
        </div>
        <div className="relative font-header3 -top-20 md:text-header3 text-[1.1rem]">
          <img src={orangewheel} alt="" className="w-[42.375rem] h-[42.375rem] object-fill" />
          <div className="absolute inset-0 flex flex-col items-center justify-center ">
            <div className="flex py-14">
              <div onClick={() => handleEmotionClick("Confused")} className="cursor-pointer px-12 hover:font-semibold">Confused</div>
              <div onClick={() => handleEmotionClick("Embarrassed")} className="px-8 cursor-pointer hover:font-semibold">Embarrassed</div>
            </div>
            <div className="flex gap-10 ">
              <div onClick={() => handleEmotionClick("Pressured")} className=" px-6 py-12 cursor-pointer hover:font-semibold">Pressured</div>
              <img src={anxiousImg} alt="" className="w-44 h-32 object-fill " />
              <div onClick={() => handleEmotionClick("Overwhelmed")} className=" cursor-pointer py-12 hover:font-semibold">Overwhelmed</div>
            </div>
            <div className="flex pt-16 ">
              <div onClick={() => handleEmotionClick("Worried")} className=" cursor-pointer px-12 hover:font-semibold">Worried</div>
              <div onClick={() => handleEmotionClick("Anxious")} className="cursor-pointer px-8 hover:font-semibold">Anxious</div>
            </div>
          </div>
        </div>
<div className="-mt-[30%] justify-center ">
        <div className=" px-18 flex justify-between">
          <button className="rounded-full w-18 h-18 bg-lightYellow " href="/subemotionproud"><img src={proudImg} alt="" className="w-20 h-20 object-fill  " /></button>
          <button className="rounded-full w-18 h-18 bg-lightBlue " href="/subemotionsad"><img src={sadImg} alt="" className="w-20 h-20 object-fill " /></button>
        </div>

        <div className=" px-32 flex justify-between">
          <button className="rounded-full w-18 h-18 bg-darkTeal" href="/subemotionhappy"><img src={happyImg} alt="" className="w-20 h-20 object-fill " /></button>
          <button className="rounded-full w-18 h-18 bg-pink" href="/subemotionangry"><img src={angryImg} alt="" className="w-20 h-20 object-fill " /></button>
        </div>

        <div className="-mt-12 flex justify-center">
          <button className="rounded-full w-18 h-18 bg-lightLavender" href="/subemotionscared"><img src={scaredImg} alt="" className="w-20 h-20 object-fill " /></button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default SubEmotionAnxious;
