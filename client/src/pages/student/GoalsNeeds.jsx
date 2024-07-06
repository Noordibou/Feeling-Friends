import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { updateStudent } from "../../api/studentsApi";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar";
import Wiggly from "../../images/wiggly.png";
import { getEmotionColor } from "../../utils/classroomColors";
import withAuth from "../../hoc/withAuth";

const GoalsNeeds = () => {
  const navigate = useNavigate();
  const { userData, accumulatedUpdates, updateUserDataAccumulated, clearAccumulatedUpdates, isCheckinOrOut } = useUser();

  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";
  const previousPage = location.state?.previousPage
  const [inputMode1, setInputMode1] = useState(false);
  const [inputMode2, setInputMode2] = useState(false);

  const [userInput1, setUserInput1] = useState('');
  const [userInput2, setUserInput2] = useState('');

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedNeed, setSelectedNeed] = useState(null);

  const [emotionColor, setEmotionColor] = useState("")

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
      updateUserDataAccumulated({goal: goal})
    }
  };

  const handleNeedClick = (need) => {
    if (selectedNeed === need) {
      setSelectedNeed(null);
    } else {
      setSelectedNeed(need);
      updateUserDataAccumulated({need: need})

    }
  };

  const handleSubmit = async () => {
    await updateStudent(userData._id, accumulatedUpdates, isCheckinOrOut);

    navigate("/summary", {
      state: {
        emotion: emotionFromLocation,
        previousPage: "/goalsneeds"
      },
    });
  };

  useEffect(() => {
    if (emotionFromLocation) {
      setEmotionColor(getEmotionColor(emotionFromLocation))
    }
    if (!previousPage || previousPage !== "/regzone") {
      navigate("/student-home")
    }
  }, [])

  return (
    <>
      <div className="flex flex-col w-screen items-center bg-notebookPaper">
        <div className="flex w-full justify-center mt-10 sm:mt-20">
          <ProgressBar totalPages="5" currentPage="4" />
        </div>
        
        <div className="max-w-lg mt-8 sm:mt-16">
          <h2 className="text-[22px] sm:text-header2 text-center font-header2 mx-4">
            What’s your most important goal for the day?
          </h2>

          <div className="w-full px-6 sm:px-0">
            <div className="flex flex-row justify-between mt-3">
              <button
                className={`bg-${selectedGoal === "Finish homework during study hall" ? emotionColor : 'themeWhite'} m-2 p-4 w-1/2 text-[16px] sm:text-body font-body border-2 border-${emotionColor} rounded-[1rem] hover:bg-${emotionColor}`}
                onClick={() => handleGoalClick("Finish homework during study hall")}
              >
                Finish homework during study hall
              </button>
              <button
                className={`bg-${selectedGoal === "Better manage my energy" ? emotionColor : 'themeWhite'} m-2 p-4 w-1/2 text-[16px] sm:text-body font-body border-2 border-${emotionColor} rounded-[1rem] hover:bg-${emotionColor}`}
                onClick={() => handleGoalClick("Better manage my energy")}
              >
                Better manage my energy
              </button>
            </div>

            <div className="flex flex-row justify-between">
              <button
                className={`bg-${selectedGoal === "Do my best in class" ? emotionColor : 'themeWhite'} m-2 p-4 w-1/2 text-[16px] sm:text-body font-body border-2 border-${emotionColor} rounded-[1rem] hover:bg-${emotionColor}`}
                onClick={() => handleGoalClick("Do my best in class")}
              >
                Do my best in class
              </button>
              <button
                className={`bg-${selectedGoal === "Be more present" ? emotionColor : 'themeWhite'} m-2 p-4 w-1/2 text-[16px] sm:text-body font-body border-2 border-${emotionColor} rounded-[1rem] hover:bg-${emotionColor}`}
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
                    className={`bg-themeWhite p-4 w-full text-[16px] sm:text-body font-body border-2 border-${emotionColor} rounded-[1rem]`}
                  />
                  <button
                    onClick={() => {
                      console.log('User input 1:', userInput1);
                      updateUserDataAccumulated({ goal: userInput1 });
                      setSelectedGoal(userInput1);
                      setInputMode1(false);
                      setUserInput1('');
                    }}
                    className={`bg-${selectedGoal === userInput1 ? emotionColor : 'themeWhite'} mt-2 p-4 w-full text-[16px] sm:text-body font-body border-2 border-${emotionColor} hover:bg-${emotionColor}/60 rounded-[1rem]`}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="p-2">
                  <button
                    className={`bg-${selectedGoal === "Something else" ? emotionColor : 'themeWhite'} rounded-xl p-4 w-full text-[16px] sm:text-body font-body border-2 border-${emotionColor} hover:bg-${emotionColor}`}
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
          <h2 className="text-[22px] sm:text-header2 font-header2 text-center mx-4">What do you need from an adult to succeed today?</h2>

          <div className="w-full px-6 sm:px-0">
            <div className="flex flex-row justify-between mt-3">
              <button
                className={`bg-${selectedNeed === "Check in with my teacher" ? emotionColor : 'themeWhite'} m-2 p-4 w-1/2 text-[16px] sm:text-body font-body border-2 border-${emotionColor} rounded-[1rem] hover:bg-${emotionColor}`}
                onClick={() => handleNeedClick("Check in with my teacher")}
              >
                Check in with my teacher
              </button>
              <button
                className={`bg-${selectedNeed === "Help with homework" ? emotionColor : 'themeWhite'} m-2 p-4 w-1/2 text-[16px] sm:text-body font-body border-2 border-${emotionColor} rounded-[1rem] hover-bg-${emotionColor}`}
                onClick={() => handleNeedClick("Help with homework")}
              >
                Help with homework
              </button>
            </div>

            <div className="flex flex-row justify-between">
              <button
                className={`bg-${selectedNeed === "Extra practice" ? emotionColor : 'themeWhite'} m-2 p-4 w-1/2 text-[16px] sm:text-body font-body border-2 border-${emotionColor} rounded-[1rem] hover-bg-${emotionColor}`}
                onClick={() => handleNeedClick("Extra practice")}
              >
                Extra practice
              </button>
              <button
                className={`bg-${selectedNeed === "Help with focusing" ? emotionColor : 'themeWhite'} m-2 p-4 w-1/2 text-[16px] sm:text-body font-body border-2 border-${emotionColor} hover-bg-${emotionColor} rounded-[1rem]`}
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
                  className={`bg-themeWhite p-4 w-full text-[16px] sm:text-body font-body border-2 border-${emotionColor} rounded-[1rem]`}
                />
                <button
                  onClick={() => {
                    console.log('User input 2:', userInput2);
                    updateUserDataAccumulated({ need: userInput2 });
                    setSelectedNeed(userInput2);
                    setInputMode2(false);
                    setUserInput2('');
                  }}
                  className={`bg-${selectedNeed === userInput2 ? emotionColor : 'themeWhite'} mt-2 p-4 w-full text-[16px] sm:text-body font-body border-2 border-${emotionColor} hover-bg-${emotionColor}/60 rounded-[1rem]`}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="p-2">
                <button
                  className={`bg-${selectedNeed === "Something else" ? emotionColor : 'themeWhite'} rounded-xl p-4 w-full text-[16px] sm:text-body font-body border-2 border-${emotionColor} hover-bg-${emotionColor}`}
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
        <div className="flex justify-center w-full mt-10 mb-20 px-8 sm:px-0">
          <button
            className={`w-full sm:w-[31rem] rounded-[1rem] py-4 text-[20px] sm:text-body bg-${emotionColor} hover-bg-${emotionColor}/60`}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default withAuth(['student'])(GoalsNeeds)
