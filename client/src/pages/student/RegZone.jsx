import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Slider from "../../components/Slider";
import ProgressBar from "../../components/ProgressBar";
import Wiggly from "../../images/wiggly.png";
import ZorImageRender from "../../components/ZorImageRender";

const RegZone = () => {
  const navigate = useNavigate();
  const { updateUserDataAccumulated } = useUser();
  const [emotion, setEmotion] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";

  const handleZoneClick = () => {
    let regZone;
    switch (true) {
      case sliderValue <= 23:
        regZone = "Unmotivated";
        break;
      case sliderValue > 23 && sliderValue <= 50:
        regZone = "Ready to Learn";
        break;
      case sliderValue > 50 && sliderValue <= 77:
        regZone = "Wiggly";
        break;
      default:
        regZone = "Explosive";
    }
    const updatedFields = { ZOR: regZone };
    updateUserDataAccumulated(updatedFields);

    navigate("/goalsneeds", {
      state: {
        emotion: emotionFromLocation,
      },
    });
  };

  useEffect(() => {
    const emotionFromParams = location.state?.emotion;
    if (emotionFromParams) {
      setEmotion(emotionFromParams);
      console.log("emotion from location: " + emotionFromParams)
    }
  }, [location.state?.emotion]);

  return (
    <>
      <div className="bg-notebookPaper pt-[3.5rem]">
      <div className="flex w-full justify-center mt-6 mb-10">
          <ProgressBar totalPages="5" currentPage="3"/>
        </div>

        <div className="w-10/12 text-center ml-auto mr-auto md:pt-[2rem] py-[1rem] font-header2 md:text-header2 text-header3 leading-tight">
          <h2 className="mt-[2rem]">Check in with your body - what zone are you in?</h2>
          {/* component goes here */}
          <ZorImageRender sliderValue={sliderValue} chosenSubEmotion={emotion} />
        </div>

        {/* slider view */}
        <div className="fixed inset-x-0 bottom-0">
          <div className="absolute w-full bottom-[7rem]">
            <Slider updateSliderValue={setSliderValue} />
            <div className="flex w-full justify-center mt-[3rem]">
              <button className="bg-themeWhite px-10 py-3 w-[16rem] p-[1.5rem] font-header2 text-header2 rounded-[1rem]" onClick={handleZoneClick}>
                OK
              </button>
            </div>
          </div>

          <div className="mt-[2rem] flex items-end">
            {/* unmotivated */}
            <div className="bg-blue w-1/4 h-[32rem] rounded-tl-[2rem] hover:bg-blue/70 pb-10">
              <span className="block font-body text-white mt-[19rem] ml-[1.5rem] cursor-pointer -mb-6">
                Low energy
              </span>
              <span className="block font-regZone md:text-regZone text-sm text-white  mt-[-18rem] ml-[1.5rem] cursor-pointer">
                Unmotivated
              </span>
            </div>

            {/* ready to learn */}
            <div className="bg-green w-1/4 h-[32rem] cursor-pointer hover-bg-green/70">
              <span className="block font-regZone md:text-regZone text-sm  text-white mt-[2.5rem] text-center">
                Ready to learn
              </span>
            </div>

            {/* wiggly */}
            <div className="bg-yellow w-1/4 h-[32rem] cursor-pointer hover-bg-yellow/60">
              <span className="block font-regZone md:text-regZone text-sm text-white mt-[2.5rem] ml-[3.5rem] -mb-10">
                Wiggly
              </span>
            </div>

            {/* explosive */}
            <div className="bg-orange w-1/4 h-[32rem] cursor-pointer rounded-tr-[2rem] hover-bg-orange/70">
              <span className="block font-body text-white mt-[19rem] ml-[5rem] cursor-pointer -mb-10">
                High energy
              </span>
              <span className="block font-regZone md:text-regZone text-sm text-white mt-[-18rem] ml-[3.5rem] cursor-pointer">
                Explosive
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegZone;
