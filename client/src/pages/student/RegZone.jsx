import React from "react";
import { useNavigate } from "react-router-dom";
import { useStudentCheckin } from "../../context/CheckInContext";

const RegZone = () => {
  const navigate = useNavigate();
  const { studentCheckinData, updateFormState } = useStudentCheckin();

  const handleZoneClick = (zone) => {
    updateFormState("ZOR", zone);
    navigate("/goalsneeds");
  };

  return (
    <>
    <div>
      <h1>It’s normal to feel anxious.</h1>
      <h2>Getting to know our emotions can help!</h2>

      <div>
        <div><h2>What is anxiety?</h2></div>
        <div>
        <ul>
            <li>It helps alert us to danger.</li>
            <li>Some times, their stories about danger are not based in reality!</li>
        </ul>
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