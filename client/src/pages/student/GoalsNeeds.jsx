import React from "react";
import { useStudentCheckin } from "../../context/CheckInContext";
import { updateStudent } from "../../api/studentsApi";

const GoalsNeeds = () => {

  const { studentCheckinData, updateFormState } = useStudentCheckin();

  const handleGoalClick = (goal) => {
    updateFormState("goal", goal);
  };

  const handleNeedClick = (need) => {
    updateFormState("need", need);
  };

  return (
    <>
    <div>
    <h2>What’s your most important goal for the day?</h2>

    <div>
    <div><button onClick={() => handleGoalClick("Finish homework during study hall")}>Finish homework during study hall</button></div>
    <div><button onClick={() => handleGoalClick("Better manage my energy")}>Better manage my energy</button></div>

    <div><button onClick={() => handleGoalClick("Do my best in class")}>Do my best in class</button></div>
    <div><button onClick={() => handleGoalClick("Be more present")}>Be more present</button></div>

    <button onClick={() => handleGoalClick("something else")}>Something else</button>
    </div>

    <h2>What do you need from an adult to succeed today?</h2>

    <div>
    <div><button onClick={() => handleNeedClick("Check in with my teacher")}>Check in with my teacher</button></div>
    <div><button onClick={() => handleNeedClick("Help with homework")}>Help with homework</button></div>

    <div><button onClick={() => handleNeedClick("Extra practice")}>Extra practice</button></div>
    <div><button onClick={() => handleNeedClick("Help with focusing")}>Help with focusing</button></div>

    <button onClick={() => handleNeedClick("something else")}>Something else</button>
    </div>

      <button onClick={async () => await updateStudent()}>Submit</button>
    </div>
    </>
  );
}

export default GoalsNeeds;