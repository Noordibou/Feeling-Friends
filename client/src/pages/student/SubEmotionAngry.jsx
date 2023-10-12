import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/StudentProvider";
import angryWheel from "../../images/angryWheel.png"
import angryImg from '../../images/angry.png'
import proudImg from '../../images/proud.png'
import anxiousImg from '../../images/anxious.png'
import sadImg from '../../images/sad.png'
import happyImg from '../../images/happy.png'
import scaredImg from '../../images/scared.png'

const SubEmotionAngry = () => {
  const navigate = useNavigate();

  const { userData, updateUserDataAccumulated } = useUser();

  const handleEmotionClick = (chosenEmotion) => {
    updateUserDataAccumulated({["emotion"]: chosenEmotion});    
    navigate("/regzone", {
      state: {
        emotion: chosenEmotion
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col text-center">
        <div className="font-header2 text-header2">
          <h2>Choose the emotion closest to</h2>
          <span>what you're feeling.</span>
        </div>
        <div className="relative font-header3 -top-20 md:text-header3 text-[1.1rem] ">
          <img src={angryWheel} alt="" className="w-[42.375rem] h-[35.375rem] object-fill" />
          <div className="absolute inset-0 flex flex-col items-center justify-center ">
            <div className="flex py-14">
              <div onClick={() => handleEmotionClick("Grumpy")} className="cursor-pointer px-10 hover:font-semibold">Grumpy</div>
              <div onClick={() => handleEmotionClick("Disgusted")} className="px-6 cursor-pointer hover:font-semibold">Disgusted</div>
            </div>
            <div className="flex gap-10 ">
              <div onClick={() => handleEmotionClick("Jealous")} className=" px-2 py-12 cursor-pointer hover:font-semibold">Jealous</div>
              <img src={angryImg} alt="" className="w-32 h-32 object-fill " />
              <div onClick={() => handleEmotionClick("Frustrated")} className=" -ml-4 cursor-pointer py-12 hover:font-semibold">Frustrated</div>
            </div>
            <div className="flex mb-8 pt-10 ">
              <div onClick={() => handleEmotionClick("Annoyed")} className=" cursor-pointer px-12 hover:font-semibold">Annoyed</div>
              <div onClick={() => handleEmotionClick("Angry")} className="cursor-pointer px-8 hover:font-semibold">Angry</div>
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
          <button className="rounded-full w-18 h-18 bg-pink p-2" href="/subemotionanxious"><img src={anxiousImg} alt="" className="w-16 h-16 object-fill " /></button>
        </div>

        <div className="-mt-12 flex justify-center">
          <button className="rounded-full w-18 h-18 bg-lightLavender p-2" href="/subemotionscared"><img src={scaredImg} alt="" className="w-16 h-16 object-fill " /></button>
        </div>
        </div>
      </div>
    </div>
  );
}


export default SubEmotionAngry;