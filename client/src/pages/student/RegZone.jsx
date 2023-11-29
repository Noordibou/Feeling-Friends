// import React, {useEffect, useState} from "react";
// import { useNavigate, useLocation  } from "react-router-dom";
// import { useStudentCheckin } from "../../context/CheckInContext";
// import Avatar from "../../images/avatar.png";
// import Star from "../../images/star.png";

// const RegZone = () => {
//   const navigate = useNavigate();
//   const { studentCheckinData, updateFormState } = useStudentCheckin();
//   const [emotion, setEmotion] = useState("");
//   const location = useLocation();
//   const emotionFromLocation = location.state?.emotion || "";

//   const handleZoneClick = (zone) => {
//     updateFormState("ZOR", zone);
//     navigate("/goalsneeds");
//   };

//   useEffect(() => {
//     const emotionFromParams = location.state?.emotion;
//     if (emotionFromParams) {
//       setEmotion(emotionFromParams);
//     }
//   }, []);



//   const emotionsExplained = [
//     {
//       emotion: "Anxiety",
//       tips: [
//         "It helps alert us to danger.",
//         "Some times, their stories about danger are not based in reality!"
//       ]
//     },
//     {
//       emotion: "embarrased",
//       tips: [
//         "It makes us feel good and motivated.",
//         "It can be contagious, so spread it around!"
//       ]
//     },
//   ]

//   const getEmotionTips = () => {
//     const emotionObject = emotionsExplained.find((emotionObject) => emotionObject.emotion === emotion);
//     if (emotionObject) {
//       return emotionObject.tips;
//     } else {
//       return [];
//     }
//   };

//   useEffect(() => {

//   }, []);

//   return (
//     <>
//     <div className="bg-notebookPaper pt-[3.5rem]">
//       <div className="w-6/12 text-center ml-auto mr-auto"><h1 className="font-header1 text-header1 leading-tight">It’s normal to feel {emotionFromLocation}.</h1></div>
//       <div className="w-6/12 text-center ml-auto mr-auto pt-[1.5rem]"><h2 className="font-header2 text-header2 leading-tight">Getting to know our emotions can help!</h2></div>


//       <div className="bg-lightOrange w-11/12 pt-[1.5rem] rounded-[2rem] p-[2rem] mt-[4rem] ml-auto mr-auto flex items-center">
//         <div className="pl-[1rem]">
//           <h2 className="font-header2 text-header2 leading-tight">What is {emotionFromLocation}?</h2>
//         <ul className="font-body text-body leading-relaxed">
//         {/* {getEmotionTips().map((tip) => (
//           <li className="list-disc mt-[1rem]" key={tip}>
//             {tip}
//           </li>
//         ))} */}

//             <li className="list-disc mt-[1rem]">It helps alert us to danger.</li>
//             <li className="list-disc mt-[1rem]">Some times, their stories about danger are not based in reality!</li>
//         </ul>
//         </div>
//         <div className="mr-auto ml-auto">
//           <img src={Avatar} alt="avatar" className=" ml-auto mr-auto" />
//         </div>
//       </div>

//       <div className="w-7/12 text-center ml-auto mr-auto pt-[5rem]">
//       <h2 className="font-header2 text-header2 leading-tight">Check in with your body- what zone are you in? </h2>
//       <h2 className="font-header2 text-header2 leading-tight">Drag the slider to that zone.</h2>
//     </div>

//     <div className="absolute bottom-[7.5rem]">
//       <hr className="border-8 w-screen border-white"></hr>
//     </div>
//     <div className="absolute bottom-[4.5rem] left-[43%]">
//       <img src={Star} />
//       </div>

//     <div className="mt-[2rem] flex items-center">
//         <div className="bg-blue w-1/4 h-[20rem] rounded-tl-[2rem]" onClick={() => handleZoneClick("Low energy/Unmotivated")}>
//             <span className="block font-body text-white mt-[5rem] ml-[1.5rem]">Low energy</span>
//             <span className="block font-regZone text-regZone text-white  mt-[7rem] ml-[1.5rem]">Unmotivated</span></div>


//         <div className="bg-green w-1/4 h-[20rem]" onClick={() => handleZoneClick("Ready to learn/Wiggly")}><span className="block font-regZone text-regZone text-white mt-[13.4rem] ml-[1rem]">Ready to learn</span></div>

//         <div className="bg-yellow w-1/4 h-[20rem]"><span className="block font-regZone text-regZone text-white mt-[13.4rem] ml-[3.5rem]">Wiggly</span></div>

//         <div className="bg-orange w-1/4 h-[20rem] rounded-tr-[2rem]" onClick={() => handleZoneClick("High energy/Explosive")}>
//         <span className="block font-body text-white mt-[5rem] ml-[5rem]">High energy</span>
//         <span className="block font-regZone text-regZone text-white mt-[7rem] ml-[3.5rem]">Explosive</span></div>
//     </div>

//     </div>
//     </>
//   );
// }

// export default RegZone;
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Slider from "../../components/Slider";
import ProgressBar from "../../components/ProgressBar";
import Wiggly from "../../images/wiggly.png";

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
    console.log("regZone::::: " + regZone)
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
    }
  }, [location.state?.emotion]);

  return (
    <>
      <div className="bg-notebookPaper pt-[3.5rem]">
      <div className="flex w-full justify-center mt-6 mb-10">
          <ProgressBar totalPages="6" currentPage="4"/>
        </div>

        <div className="w-7/12 text-center ml-auto mr-auto md:pt-[2rem] py-[1rem] font-header2 md:text-header2 text-header3 leading-tight">
          <img src={Wiggly} alt="wiggly" className="ml-auto mr-auto" />
          <h2 className="mt-[2rem]">Check in with your body - what zone are you in?</h2>
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
