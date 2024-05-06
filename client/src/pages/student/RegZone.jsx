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
      <div className="bg-notebookPaper flex flex-col min-w-full h-screen items-center pt-[3.5rem]">
      <div className="w-full xl:max-w-[900px] items-center h-full flex flex-col">
      <div className="flex w-full justify-center mt-6 mb-10">
          <ProgressBar totalPages="5" currentPage="3"/>
        </div>

        <div className="flex flex-col justify-center w-10/12 xl:max-w-[900px] text-center ml-auto mr-auto py-[1rem] font-header2 md:text-header1 text-header3 leading-tight h-[36%] ">
          <h2 className="self-center w-[500px] pt-4">Check in with your body - what zone are you in?</h2>
          {/* component goes here */}
          <ZorImageRender sliderValue={sliderValue} chosenSubEmotion={emotion} />
        </div>



        {/* Reg Zone Container */}
        <div className="absolute bottom-0 flex flex-col justify-end items-center h-[49%] w-full">
      <div className="flex flex-col w-full h-full items-center mx-auto">
          {/* Reg Zone section */}
          <div className="pt-[2rem] flex flex-row self-center h-full w-full xl:max-w-[900px] ">
            {/* unmotivated */}
            <div className="bg-blue w-[25%] flex flex-col rounded-tl-[2rem] hover:bg-blue/70 text-center pt-12">
              <span className="font-[Poppins] text-[1.1rem] md:text-[1.4rem] text-black">
                Unmotivated
              </span>
              <span className="font-[Poppins] text-black pt-[15rem] ">
                Low energy
              </span>
            </div>

            {/* ready to learn */}
            <div className="bg-green w-[25%] flex flex-col hover:bg-green/70 text-center pt-12">
              <span className="font-[Poppins] text-[1.1rem] md:text-[1.4rem] text-black w-full px-3 text-center">
                Ready to learn
              </span>
            </div>

            {/* wiggly */}
            <div className="bg-yellow w-[25%] h-full flex flex-col cursor-pointer hover-bg-yellow/60 text-center pt-12">
              <span className="font-[Poppins] text-[1.1rem] md:text-[1.4rem] text-black">
                Wiggly
              </span>
            </div>

            {/* explosive */}
            <div className="bg-orange w-[25%] flex flex-col rounded-tr-[2rem] hover-bg-orange/70 text-center pt-12">
              <span className="font-[Poppins] text-[1.1rem] md:text-[1.4rem] text-black">
                Explosive
              </span>
              <span className="font-[Poppins] text-black pt-[15rem]">
                High energy
              </span>
            </div>
          </div>
                  {/* slider view */}
        <div className="absolute w-full xl:max-w-[900px] h-full">

            <Slider updateSliderValue={setSliderValue} />
            <div className="flex justify-center mt-[3rem]">
              <button className="bg-themeWhite px-10 py-3 w-[16rem] p-[1.5rem] font-header2 text-header2 rounded-[1rem]" onClick={handleZoneClick}>
                OK
              </button>
            </div>


          </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default RegZone;
