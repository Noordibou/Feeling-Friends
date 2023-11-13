import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import happyWheel from "../../images/happyWheel.png"
import angryImg from '../../images/angry.png'
import proudImg from '../../images/proud.png'
import anxiousImg from '../../images/anxious.png'
import sadImg from '../../images/sad.png'
import happyImg from '../../images/happy.png'
import scaredImg from '../../images/scared.png'
import ProgressBar from "../../components/ProgressBar";

const SubEmotionHappy = () => {
  const navigate = useNavigate();
  const { updateUserDataAccumulated } = useUser();

  const handleEmotionClick = (chosenEmotion) => {
    updateUserDataAccumulated({ emotion: chosenEmotion });
    navigate("/insight", {
      state: {
        emotion: chosenEmotion,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex w-full justify-center -mt-10 mb-10">
          <ProgressBar totalPages="6" currentPage="2"/>
        </div>
      <div className="flex flex-col text-center">
        <div className="font-header2 text-header2">
          <h2>Choose the emotion closest to</h2>
          <span>what you're feeling.</span>
        </div>
        <div className="relative font-header3 -top-20 md:text-header3 text-[1.1rem]">
          <img src={happyWheel} alt="" className="w-[42.375rem] h-[42.375rem] object-fill" />
          <div className="absolute inset-0 flex flex-col items-center justify-center ">
            <div className="flex py-14">
              <div onClick={() => handleEmotionClick("Hopeful")} className="cursor-pointer px-12 hover:font-semibold">Hopeful</div>
              <div onClick={() => handleEmotionClick("Grateful")} className="px-8 cursor-pointer hover:font-semibold">Grateful</div>
            </div>
            <div className="flex gap-10 ">
              <div onClick={() => handleEmotionClick("Secure")} className=" px-4 py-12 cursor-pointer hover:font-semibold">Secure</div>
              <img src={happyImg} alt="" className="w-32 h-32 object-fill " />
              <div onClick={() => handleEmotionClick("Thoughtful")} className=" -ml-4 cursor-pointer py-12 hover:font-semibold">Thoughtful</div>
            </div>
            <div className="flex mb-6 pt-12 ">
              <div onClick={() => handleEmotionClick("Peaceful")} className=" cursor-pointer px-12 hover:font-semibold">Peaceful</div>
              <div onClick={() => handleEmotionClick("Content")} className="cursor-pointer px-8 hover:font-semibold">Content</div>
            </div>
          </div>
        </div>
        <div className="-mt-[30%] justify-center">
          <div className=" px-18 flex justify-between">
            <button className="rounded-full w-18 h-18 bg-yellow p-2" href="/subemotionproud"><img src={proudImg} alt="" className="w-16 h-16 object-fill  " /></button>
            <button className="rounded-full w-18 h-18 bg-lightBlue p-2 " href="/subemotionsad"><img src={sadImg} alt="" className="w-16 h-16 object-fill " /></button>
          </div>

          <div className=" px-32 flex justify-between">
            <button className="rounded-full w-18 h-18 bg-darkTeal p-2" href="/subemotionanxious"><img src={anxiousImg} alt="" className="w-16 h-16 object-fill " /></button>
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

export default SubEmotionHappy;
