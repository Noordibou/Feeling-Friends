import React from "react";
import { useNavigate } from "react-router-dom";
import { useStudentCheckin } from "../../context/CheckInContext";
import Avatar from "../../images/avatar.png";

const RegZone = () => {
  const navigate = useNavigate();
  const { studentCheckinData, updateFormState } = useStudentCheckin();

  const handleZoneClick = (zone) => {
    updateFormState("ZOR", zone);
    navigate("/goalsneeds");
  };

  return (
    <>
    <div className="bg-notebookPaper w-screen h-screen pt-[3.5rem]">
      <div className="w-[33rem] text-center ml-auto mr-auto"><h1 className="font-header1 text-header1 leading-tight">It’s normal to feel anxious.</h1></div>
      <div className="w-[43rem] text-center ml-auto mr-auto pt-[1.5rem]"><h2 className="font-header2 text-header2 leading-tight">Getting to know our emotions can help!</h2></div>

      <div className="ml-auto mr-auto bg-lightOrange w-[46.75rem] pt-[1.5rem] rounded-[2rem] p-[2rem] mt-[4rem] inline-flex">
        <div><h2 className="font-header2 text-header2 leading-tight">What is anxiety?</h2>
        <ul className="font-body text-body leading-relaxed">
            <li className="list-disc mt-[1rem]">It helps alert us to danger.</li>
            <li className="list-disc mt-[1rem]">Some times, their stories about danger are not based in reality!</li>
        </ul>
        </div>
        <div>
          <img src={Avatar} alt="avatar" className=" ml-auto mr-auto mt-[2rem] mb-[1rem]" />
        </div>
      </div>

    <div>
    <h2>Check in with your body- what zone are you in? </h2>
    Drag the slider to that zone.
    </div>

    <div>
        <div onClick={() => handleZoneClick("Low energy/Unmotivated")}>
            Low energy<br/>
            Unmotivated</div>
        <div onClick={() => handleZoneClick("Ready to learn/Wiggly")}>Ready to learn</div>
        <div>Wiggly</div>
        <div onClick={() => handleZoneClick("High energy/Explosive")}>
            High energy<br/>
            Explosive</div>
    </div>

    </div>
    </>
  );
}

export default RegZone;