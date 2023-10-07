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
import { useStudentCheckin } from "../../context/CheckInContext";
import Avatar from "../../images/avatar.png";
import Star from "../../images/star.png";
import deepBreathing from "../../images/RegZoneDeepBreathingCard.png"
import imagineExercise from "../../images/coping skill card_ Overwhelmed.png"
import { useStudent } from "../../context/StudentContext";

// import emotionsExplained from '../../mockData/emotionData.js'

const RegZone = () => {
  const navigate = useNavigate();
  const { studentData, updateStudentDataAccumulated } = useStudent();
  const { studentCheckinData, updateFormState } = useStudentCheckin();
  const [emotion, setEmotion] = useState("");
  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";

  const handleZoneClick = (zone) => {
    const updatedFields = { ZOR: zone }
    updateStudentDataAccumulated(updatedFields);
    navigate("/goalsneeds", {
      state: {
        emotion: emotionFromLocation
      }
    });
  };

  const emotionsExplained = [
    {
      emotion: "Anxious",
      image: {deepBreathing}
    },
    {
      emotion: "Overwhelmed",
      image: {imagineExercise}
    },
  ]

  useEffect(() => {
    console.log("Location state:", location.state);
  console.log("Emotion from location:", location.state?.emotion);
    const emotionFromParams = location.state?.emotion;
    if (emotionFromParams) {
      setEmotion(emotionFromParams);
    }
    console.log("Emotion:", emotion);
  }, [location.state?.emotion]);

  const getEmotionTips = () => {
    const emotionObject = emotionsExplained.find(
      (emotionObject) => emotionObject.emotion.toLowerCase() === emotion.toLowerCase()
    );
    if (emotionObject) {
      console.log("emotion object: " + JSON.stringify(emotionObject))
      return emotionObject.tips;
    } else {
      return [];
    }
  };

  return (
    <>
      <div className="bg-notebookPaper pt-[3.5rem] ">
        <div className="md:w-6/12 w-9/12 text-center ml-auto mr-auto">
          <h1 className="font-header1 md:text-header1 text-header2 leading-tight">
            It’s normal to feel {emotionFromLocation.toLowerCase()}.
          </h1>
        </div>
        <div className="w-11/12 text-center ml-auto mr-auto pt-[1rem]">
          <h2 className="font-header2 md:text-header2 text-header3 leading-tight">
            Getting to know our emotions can help!
          </h2>
        </div>

        {/* emotion explanation */}
        <div className="bg-lightOrange w-11/12 pt-[1.rem] rounded-[2rem] p-2 mt-[2rem] ml-auto mr-auto flex items-center justify-center">
          <div className="">
            {/* <h2 className="font-header2 md:text-header2 text-md leading-tight">
              What is {emotionFromLocation}?
            </h2> */}
                  {emotionFromLocation === "Anxious" ? <img className="h-80 " src={deepBreathing} /> : <img className="h-80 " src={imagineExercise} />}
          </div>
          {/* <div className="mr-auto ml-auto">
            <img src={Avatar} alt="avatar" className=" ml-auto mr-auto" />
          </div> */}
        </div>
        {/* checkin with body text */}
        <div className="w-7/12 text-center ml-auto mr-auto md:pt-[2rem] py-[1rem] font-header2 md:text-header2 text-header3 leading-tight">
      <h2 >Check in with your body- what zone are you in? </h2>
      <h2 >Drag the slider to that zone.</h2>
    </div>


{/* slider view */}
        <div className="fixed
             inset-x-0
             bottom-0">
    <div className="absolute bottom-[7.5rem]">
      <hr className="border-8 w-screen border-white"></hr>
    </div>
    <div className="absolute bottom-[4.5rem] left-[43%]">
      <img src={Star} />
      </div>

    <div className="mt-[2rem] flex items-end ">

      {/* unmotivated */}
        <div className="bg-blue w-1/4 h-[17rem] rounded-tl-[2rem] hover:bg-blue/70 pb-10" onClick={() => handleZoneClick("Low energy/Unmotivated")}>
            <span className="block font-body text-white mt-[5rem] ml-[1.5rem] cursor-pointer -mb-6" >Low energy</span>
            <span className="block font-regZone md:text-regZone text-sm text-white  mt-[8rem] ml-[1.5rem] cursor-pointer">Unmotivated</span></div>

        {/* ready to learn */}
        <div className="bg-green w-1/4 h-[17rem] cursor-pointer hover:bg-green/70" onClick={() => handleZoneClick("Ready to learn")}><span className="block font-regZone md:text-regZone text-sm  text-white mt-[12.9rem] text-center">Ready to learn</span></div>

        {/* wiggly */}
        <div className="bg-yellow w-1/4 h-[17rem] cursor-pointer hover:bg-yellow/60" onClick={() => handleZoneClick("Wiggly")}><span className="block font-regZone md:text-regZone text-sm text-white mt-[12.9rem] ml-[3.5rem] -mb-10">Wiggly</span></div>

        {/* explosive */}
        <div className="bg-orange w-1/4 h-[17rem] cursor-pointer rounded-tr-[2rem] hover:bg-orange/70" onClick={() => handleZoneClick("High energy/Explosive")}>
        <span className="block font-body text-white mt-[5rem] ml-[5rem] cursor-pointer -mb-10">High energy</span>
        <span className="block font-regZone md:text-regZone text-sm text-white md:mt-[9rem] mt-[7rem] ml-[3.5rem] cursor-pointer">Explosive</span></div>
    </div>
</div>
    </div>
    </>
  );
}

export default RegZone;
