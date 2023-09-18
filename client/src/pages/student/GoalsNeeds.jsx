import React, {useEffect, useState} from "react";
import { useStudentCheckin } from "../../context/CheckInContext";
import { updateStudent } from "../../api/studentsApi";
import anxiousAvatar from "../../images/anxiousAvatar.png"
import studentImg from '../../images/avatar.png'

const GoalsNeeds = () => {

  const { studentCheckinData, updateFormState } = useStudentCheckin();

  const [inputMode1, setInputMode1] = useState(false);
  const [inputMode2, setInputMode2] = useState(false);

  // Initialize state variables for the user's input in each field
  const [userInput1, setUserInput1] = useState('');
  const [userInput2, setUserInput2] = useState('');

  // Function to handle the click event for the "Something else" button for the second field
  const handleNeedClick = (need) => {
    setInputMode2(true);
    updateFormState("need", need);
  };

  // Function to handle input changes for the first field
  const handleInputChange1 = (e) => {
    setUserInput1(e.target.value);
  };

  // Function to handle input changes for the second field
  const handleInputChange2 = (e) => {
    setUserInput2(e.target.value);
  };

  // Function to save the user's input for the second field
  const saveUserInput2 = () => {
    
  };
  return (
    <>
      {/* page container */}
      <div className="flex flex-col w-screen items-center bg-notebookPaper">
        {/* avatar images container */}
        <div className="flex flex-row items-center justify-center mt-20">
          <div>
            <img src={anxiousAvatar} />
          </div>
          <img className="flex-end" src={studentImg} />
        </div>

        {/* goal section */}
        <div className="max-w-lg mt-5">
          <h2 className="text-header2 font-header2">
            What’s your most important goal for the day?
          </h2>

          {/* goal options */}
          <div className="w-full">
            {/* first row */}
            <div className="flex flex-row justify-between mt-3">
                <button
                  className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded"
                  onClick={() =>
                    updateFormState("goal", "Finish homework during study hall")
                  }
                >
                  Finish homework during study hall
                </button>
                <button
                  className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded"
                  onClick={() => updateFormState("goal", "Better manage my energy")}
                >
                  Better manage my energy
                </button>
              </div>

              {/* second row */}
              <div className="flex flex-row justify-between">
                <button className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded" onClick={() => updateFormState("goal", "Do my best in class")}>
                  Do my best in class
                </button>
                <button className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded" onClick={() => updateFormState("goal", "Be more present")}>
                  Be more present
                </button>
              </div>
            <div className="">
              <div>
                {/* Render the input field when inputMode is true */}
                {inputMode1 ? (
                  <div className="p-2">
                    <input
                      type="text"
                      value={userInput1}
                      onChange={handleInputChange1}
                      placeholder="Type your goal here"
                      className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded"
                    />
                    <button
                      onClick={() => {
                        console.log('User input 1:', userInput1);
                        updateFormState("goal", userInput1);
                        setInputMode1(false);
                        setUserInput1('');
                      }}
                      className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="p-2">
                    <button
                      className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded"
                      onClick={() => setInputMode1(true)}
                    >
                      Something else
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>




{/* // ---------------------------------------------------------------// */}

        {/* needs section */}
        <div className="max-w-lg mt-5">
          <h2 className="text-header2 font-header2">What do you need from an adult to succeed today?</h2>

          <div className="w-full">
            {/* first row */}
            <div className="flex flex-row justify-between mt-3">
                <button
                  className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded"
                  onClick={() =>
                    updateFormState("need", "Check in with my teacher")
                  }
                >
                  Check in with my teacher
                </button>
                <button
                  className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded"
                  onClick={() => updateFormState("need", "Help with homework")}
                >
                  Help with homework
                </button>
              </div>

              {/* second row */}
              <div className="flex flex-row justify-between">
                <button className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded" onClick={() => updateFormState("need", "Extra practice")}>
                  Extra practice
                </button>
                <button className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded" onClick={() => updateFormState("need", "Help with focusing")}>
                  Help with focusing
                </button>
              </div>
            {/* Render the input field when inputMode is true */}
            {inputMode2 ? (
              <div className="p-2">
                <input
                  type="text"
                  value={userInput2}
                  onChange={handleInputChange2}
                  placeholder="Enter your custom message 2"
                  className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded"
                />
                <button
                  onClick={() => {
                    console.log('User input 2:', userInput2);
                    updateFormState("need", userInput2)
                    setInputMode2(false);
                    setUserInput2('');
                  }}
                  className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="p-2">
                <button
                  className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded"
                  onClick={() => setInputMode2(true)}
                >
                  Something else
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center w-full mt-10 mb-20">
          <button
            className="w-8/12 rounded py-4 text-body bg-lightOrange"
            onClick={async () =>
              await updateStudent("6506618e9afe8f1c62042982", studentCheckinData)
            }
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default GoalsNeeds;