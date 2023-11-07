import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { updateStudent } from "../../api/studentsApi";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar";
import Wiggly from "../../images/wiggly.png";

const GoalsNeeds = () => {
  const navigate = useNavigate();
  const { userData, accumulatedUpdates, updateUserDataAccumulated, clearAccumulatedUpdates, isCheckinOrOut } = useUser();

  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";

  const [inputMode1, setInputMode1] = useState(false);
  const [inputMode2, setInputMode2] = useState(false);

  const [userInput1, setUserInput1] = useState('');
  const [userInput2, setUserInput2] = useState('');

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedNeed, setSelectedNeed] = useState(null);

  const handleInputChange1 = (e) => {
    setUserInput1(e.target.value);
  };

  const handleInputChange2 = (e) => {
    setUserInput2(e.target.value);
  };

  const handleGoalClick = (goal) => {
    if (selectedGoal === goal) {
      setSelectedGoal(null);
    } else {
      setSelectedGoal(goal);
    }
  };

  const handleNeedClick = (need) => {
    if (selectedNeed === need) {
      setSelectedNeed(null);
    } else {
      setSelectedNeed(need);
    }
  };

  const handleSubmit = async () => {
    console.log("handle submit activated");
    await updateStudent(userData._id, accumulatedUpdates, isCheckinOrOut);

    navigate("/summary", {
      state: {
        emotion: emotionFromLocation,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col w-screen items-center bg-notebookPaper">
        <div className="flex w-full justify-center mt-20">
          <ProgressBar totalPages="6" currentPage="5" />
        </div>
        <div className="items-center justify-center mt-20 mb-[2.5rem]">
          <img className="w-[33rem]" src={Wiggly} alt="Wiggly" />
        </div>

        <div className="max-w-lg mt-5">
          <h2 className="text-header2 font-header2">
            What’s your most important goal for the day?
          </h2>

          <div className="w-full">
            <div className="flex flex-row justify-between mt-3">
              <button
                className={`bg-${selectedGoal === "Finish homework during study hall" ? 'lightOrange' : 'themeWhite'} m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange`}
                onClick={() => handleGoalClick("Finish homework during study hall")}
              >
                Finish homework during study hall
              </button>
              <button
                className={`bg-${selectedGoal === "Better manage my energy" ? 'lightOrange' : 'themeWhite'} m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange`}
                onClick={() => handleGoalClick("Better manage my energy")}
              >
                Better manage my energy
              </button>
            </div>

            <div className="flex flex-row justify-between">
              <button
                className={`bg-${selectedGoal === "Do my best in class" ? 'lightOrange' : 'themeWhite'} m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange`}
                onClick={() => handleGoalClick("Do my best in class")}
              >
                Do my best in class
              </button>
              <button
                className={`bg-${selectedGoal === "Be more present" ? 'lightOrange' : 'themeWhite'} m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange`}
                onClick={() => handleGoalClick("Be more present")}
              >
                Be more present
              </button>
            </div>
            <div>
              {inputMode1 ? (
                <div className="p-2">
                  <input
                    type="text"
                    value={userInput1}
                    onChange={handleInputChange1}
                    placeholder="Type your goal here"
                    className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded-[1rem]"
                  />
                  <button
                    onClick={() => {
                      console.log('User input 1:', userInput1);
                      updateUserDataAccumulated({ goal: userInput1 });
                      setSelectedGoal(userInput1);
                      setInputMode1(false);
                      setUserInput1('');
                    }}
                    className={`bg-${selectedGoal === userInput1 ? 'lightOrange' : 'themeWhite'} mt-2 p-4 w-full text-body font-body border-2 border-lightOrange hover:bg-lightOrange/60 rounded-[1rem]`}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="p-2">
                  <button
                    className={`bg-${selectedGoal === "Something else" ? 'lightOrange' : 'themeWhite'} p-4 w-full text-body font-body border-2 border-lightOrange hover:bg-lightOrange`}
                    onClick={() => {
                      setSelectedGoal("Something else");
                      setInputMode1(true);
                    }}
                  >
                    Something else
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-lg mt-5">
          <h2 className="text-header2 font-header2">What do you need from an adult to succeed today?</h2>

          <div className="w-full">
            <div className="flex flex-row justify-between mt-3">
              <button
                className={`bg-${selectedNeed === "Check in with my teacher" ? 'lightOrange' : 'themeWhite'} m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange`}
                onClick={() => handleNeedClick("Check in with my teacher")}
              >
                Check in with my teacher
              </button>
              <button
                className={`bg-${selectedNeed === "Help with homework" ? 'lightOrange' : 'themeWhite'} m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover-bg-lightOrange`}
                onClick={() => handleNeedClick("Help with homework")}
              >
                Help with homework
              </button>
            </div>

            <div className="flex flex-row justify-between">
              <button
                className={`bg-${selectedNeed === "Extra practice" ? 'lightOrange' : 'themeWhite'} m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover-bg-lightOrange`}
                onClick={() => handleNeedClick("Extra practice")}
              >
                Extra practice
              </button>
              <button
                className={`bg-${selectedNeed === "Help with focusing" ? 'lightOrange' : 'themeWhite'} m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange hover-bg-lightOrange rounded-[1rem]`}
                onClick={() => handleNeedClick("Help with focusing")}
              >
                Help with focusing
              </button>
            </div>
            {inputMode2 ? (
              <div className="p-2">
                <input
                  type="text"
                  value={userInput2}
                  onChange={handleInputChange2}
                  placeholder="Enter your custom message"
                  className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded-[1rem]"
                />
                <button
                  onClick={() => {
                    console.log('User input 2:', userInput2);
                    updateUserDataAccumulated({ need: userInput2 });
                    setSelectedNeed(userInput2);
                    setInputMode2(false);
                    setUserInput2('');
                  }}
                  className={`bg-${selectedNeed === userInput2 ? 'lightOrange' : 'themeWhite'} mt-2 p-4 w-full text-body font-body border-2 border-lightOrange hover-bg-lightOrange/60 rounded-[1rem]`}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="p-2">
                <button
                  className={`bg-${selectedNeed === "Something else" ? 'lightOrange' : 'themeWhite'} p-4 w-full text-body font-body border-2 border-lightOrange hover-bg-lightOrange`}
                  onClick={() => {
                    setSelectedNeed("Something else");
                    setInputMode2(true);
                  }}
                >
                  Something else
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center w-full mt-10 mb-20">
          <button
            className={`w-[31rem] rounded-[1rem] py-4 text-body bg-${selectedGoal === "Submit" ? 'lightOrange' : 'lightOrange'} hover-bg-lightOrange/60`}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default GoalsNeeds;
