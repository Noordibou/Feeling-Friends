import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import proudWheel from "../../images/proudWheel.png"
import angryImg from '../../images/angry.png'
import proudImg from '../../images/proud.png'
import anxiousImg from '../../images/anxious.png'
import sadImg from '../../images/sad.png'
import happyImg from '../../images/happy.png'
import scaredImg from '../../images/scared.png'
import ProgressBar from "../../components/ProgressBar";
import { useEffect } from "react";
import subEmotionInfo from "../../mockData/subEmotions";


    // have an array of objects for each emotion (6), the associated imgs, and 6 sub emotions
    // loop through each object, and if the param is equal to what the user chose, keep it out from the buttons at the bottom
    // do the find() js method for the main wheel

const SubEmotion = () => {
  const navigate = useNavigate();
  const { updateUserDataAccumulated } = useUser();
  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";

  console.log("emotion from click: " + emotionFromLocation)

  const handleEmotionClick = (chosenEmotion) => {
    updateUserDataAccumulated({ emotion: chosenEmotion });
    navigate("/regzone", {
      state: {
        emotion: chosenEmotion,
      },
    });
  };

  const selectedEmotion = subEmotionInfo.find(emotion => emotion.emotion === emotionFromLocation);
  console.log("selected emotion ooo: " + JSON.stringify(selectedEmotion))
  const { wheelImg, subEmotions, eImage } = selectedEmotion;


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex w-full justify-center -mt-10 mb-10">
          <ProgressBar totalPages="6" currentPage="2"/>
        </div>
      <div className="flex flex-col text-center">
        <div className="font-header2 text-header1">
          <h2>Choose the emotion closest to</h2>
          <span>what you're feeling.</span>
        </div>
        {/* <DisplayEmotions /> */}
        <div className="relative font-header3 -top-20 md:text-header3 text-[1.1rem]">
          <img src={wheelImg} alt="" className="w-[42.375rem] h-[42.375rem] object-fill" />
          <div className="absolute inset-0 flex flex-col items-center justify-center ">
        
            <div className="flex py-14">
              
              <div onClick={() => handleEmotionClick(subEmotions[0])} className="cursor-pointer px-12 hover:font-semibold">{subEmotions[0]}</div>
              
              <div onClick={() => handleEmotionClick(subEmotions[1])} className="px-8 cursor-pointer hover:font-semibold">{subEmotions[1]}</div>

            </div>

            <div className="flex space-between self-center">
              
              <div onClick={() => handleEmotionClick(subEmotions[2])} className=" px-6 py-12 cursor-pointer hover:font-semibold">{subEmotions[2]}</div>
              
              <img src={eImage} alt="" className="w-44 h-32 object-fill " />
              
              <div onClick={() => handleEmotionClick(subEmotions[3])} className=" cursor-pointer py-12 hover:font-semibold">{subEmotions[3]}</div>

            </div>

            <div className="flex mb-6 pt-8">
              
              <div onClick={() => handleEmotionClick(subEmotions[4])} className=" cursor-pointer px-12 hover:font-semibold">{subEmotions[4]}</div>
              
              <div onClick={() => handleEmotionClick(subEmotions[5])} className="cursor-pointer px-8 hover:font-semibold">{subEmotions[5]}</div>

            </div>

          </div>
        </div>
        <div className="-mt-[30%] justify-center ">
          <div className=" px-18 flex justify-between">
            <button className="rounded-full w-18 h-18 bg-yellow p-2" href="/subemotionanxious"><img src={anxiousImg} alt="" className="w-16 h-16 object-fill  " /></button>
            <button className="rounded-full w-18 h-18 bg-lightBlue p-2 " href="/subemotionsad"><img src={sadImg} alt="" className="w-16 h-16 object-fill " /></button>
          </div>

          <div className=" px-32 flex justify-between">
            <button className="rounded-full w-18 h-18 bg-darkTeal p-2" href="/subemotionhappy"><img src={happyImg} alt="" className="w-16 h-16 " /></button>
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

export default SubEmotion;

