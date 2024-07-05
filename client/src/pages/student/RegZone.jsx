import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Slider from "../../components/Slider";
import ProgressBar from "../../components/ProgressBar";
import Wiggly from "../../images/wiggly.png";
import ZorImageRender from "../../components/ZorImageRender";
import withAuth from "../../hoc/withAuth";

const RegZone = () => {
  const navigate = useNavigate();
  const { updateUserDataAccumulated } = useUser();
  const [emotion, setEmotion] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";
  const previousPage = location.state?.previousPage

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
        previousPage: "/regzone"
      },
    });
  };

  useEffect(() => {
    const emotionFromParams = location.state?.emotion;
    if (emotionFromParams) {
      setEmotion(emotionFromParams);
    }
  }, [location.state?.emotion]);

  useEffect(() => {
    if (!previousPage || previousPage !== "/emotion") {
      navigate("/student-home")
    }
  }, [])

  return (
    <>
      <div className="bg-notebookPaper flex flex-col min-w-screen h-screen items-center pt-[18px] sm:pt-[3.5rem]">
        <div className="w-full xl:max-w-[900px] items-center h-full flex flex-col">
          <div className="flex w-full justify-center mt-6 mb-5 sm:mb-10">
            <ProgressBar totalPages="5" currentPage="3" />
          </div>

          <div className="flex flex-col justify-center xl:max-w-[900px] text-center ml-auto mr-auto sm:py-[1rem] font-header2 md:text-[30px] text-header3 h-[45%]">
            <h2 className="flex self-center sm:w-[500px] pt-4 mx-4 ">
              Check in with your body - what zone are you in?
            </h2>
            <ZorImageRender
              sliderValue={sliderValue}
              chosenSubEmotion={emotion}
            />
          </div>

          {/* Reg Zone Container */}
          <div className="absolute bottom-0 flex flex-col justify-end items-center h-[40%] w-full">
            <div className="flex flex-col w-full h-full items-center mx-auto">
              {/* Reg Zone section */}
              <div className="flex flex-row self-center h-full w-full xl:max-w-[900px] ">
                {/* unmotivated */}
                <div className="bg-blue w-[25%] flex flex-col rounded-tl-[2rem] hover:bg-blue/70 text-center pt-10 sm:pt-12">
                  <span className="font-[Poppins] text-[14px] break-words sm:text-[1.1rem] md:text-[1.4rem] text-black">
                    Unmotivated
                  </span>
                  <span className="font-[Poppins] text-black flex h-full items-end sm:self-center mx-3 pb-6 sm:pt-[15rem] ">
                    Low energy
                  </span>
                </div>

                {/* ready to learn */}
                <div className="bg-green w-[25%] flex flex-col hover:bg-green/70 text-center pt-10 sm:pt-12">
                  <span className="font-[Poppins] text-[14px] sm:text-[1.1rem] md:text-[1.4rem] text-black w-full px-3 text-center">
                    Ready to learn
                  </span>
                </div>

                {/* wiggly */}
                <div className="bg-yellow w-[25%] flex flex-col cursor-pointer hover-bg-yellow/60 text-center pt-10 sm:pt-12">
                  <span className="font-[Poppins] text-[14px] sm:text-[1.1rem] md:text-[1.4rem] text-black">
                    Wiggly
                  </span>
                </div>

                {/* explosive */}
                <div className="bg-orange w-[25%] flex flex-col rounded-tr-[2rem] hover-bg-orange/70 text-center pt-10 sm:pt-12">
                  <span className="font-[Poppins] text-[14px] sm:text-[1.1rem] md:text-[1.4rem] text-black">
                    Explosive
                  </span>
                  <span className="font-[Poppins] text-black flex h-full sm:self-center items-end pb-6 sm:pt-[15rem]">
                    High energy
                  </span>
                </div>
              </div>
              {/* slider view */}
              <div className="absolute w-full xl:max-w-[900px] h-full ">
                <Slider updateSliderValue={setSliderValue} />
                <div className="flex justify-center mt-[20px] sm:mt-[3rem]">
                  <button
                    className="bg-themeWhite px-10 py-3 w-[10rem] sm:w-[16rem] p-[1.5rem] font-header2 text-[18px] sm:text-header2 rounded-[1rem]"
                    onClick={handleZoneClick}
                  >
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

export default withAuth(['student'])(RegZone)
