import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import withAuth from "../../hoc/withAuth";
import SimpleTopNav from "../../components/SimpleTopNav";
import ClassDetails from "../../components/ClassDetails";
import {
  getTeacherClassroom,
  getAllStudentsClassroom,
} from "../../api/teachersApi";
import { useUser } from "../../context/UserContext";
import MsgModal from "../../components/SeatingChart/MsgModal";
import Button from "../../components/Button";
import Nav from "../../components/Navbar/Nav";
import SmallSaveButton from "../../components/SmallSaveButton";
import Logout from "../../components/LogoutButton";
import editIcon from "../../images/edit_icon.png";

const NeedsGoals = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { teacherId, classroomId } = useParams();
  // Not used now but will probably need once backend is updated
  const { userData, updateUser } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  // Not used now but will probably need once backend is updated
  const [students, setStudents] = useState([]);
  const [goalAnswers, setGoalAnswers] = useState([""]);
  const [needAnswers, setNeedAnswers] = useState([""]);
  const [editGoalMode, setEditGoalMode] = useState(Array(goalAnswers.length).fill(false));
  const [editNeedsMode, setEditNeedsMode] = useState(Array(needAnswers.length).fill(false));
  const [goalsSelectedOption, setGoalsSelectedOption] = useState("no");
  const [needsSelectedOption, setNeedsSelectedOption] = useState("no");



  // keeps track of which lines are being edited
  const toggleEditGoalMode = (index) => {
    const updatedEditGoalMode = [...editGoalMode];
    updatedEditGoalMode[index] = !updatedEditGoalMode[index];
    setEditGoalMode(updatedEditGoalMode);
  };
  
  const toggleEditNeedsMode = (index) => {
    const updatedEditNeedsMode = [...editNeedsMode];
    updatedEditNeedsMode[index] = !updatedEditNeedsMode[index];
    setEditNeedsMode(updatedEditNeedsMode);
  };

  const handleGoalsCheckboxChange = (event) => {
    setGoalsSelectedOption(event.target.value);
  };

  const handleNeedsCheckboxChange = (event) => {
    setNeedsSelectedOption(event.target.value);
  };

  // Can update these functions based on how backend is edited for goals and needs change
  const handleInputGoalChange = (index, value) => {
    const newGoalAnswers = [...goalAnswers];
    newGoalAnswers[index] = value;
    setGoalAnswers(newGoalAnswers);
  };

  const handleInputNeedChange = (index, value) => {
    const newNeedAnswers = [...needAnswers];
    newNeedAnswers[index] = value;
    setNeedAnswers(newNeedAnswers);
  };

  const addAnswer = (answerType) => {
    if (answerType === "goal") {
      setGoalAnswers([...goalAnswers, ""]);
    } else if (answerType === "need") {
      setNeedAnswers([...needAnswers, ""]);
    }
  };

  const removeGoalsAnswer = (index) => {
    const newGoalAnswers = goalAnswers.filter((_, i) => i !== index);
    setGoalAnswers(newGoalAnswers);
  };

  const removeNeedsAnswer = (index) => {
    const newNeedAnswers = needAnswers.filter((_, i) => i !== index);
    setNeedAnswers(newNeedAnswers);
  };

  const handleSubmit = () => {
    console.log("click save");
    // Show brief save message for 3 secs
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 2500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classroom = await getTeacherClassroom(teacherId, classroomId);
        setClassroom(classroom);
        const classroomStudents = await getAllStudentsClassroom(
          teacherId,
          classroomId
        );
        setStudents(classroomStudents);
      } catch (error) {
        console.log(error);
      }
    };

    window.scrollTo(0, 0);
    fetchData();
  }, [teacherId, classroomId]);

  return (
    <>
      <div className="flex justify-center lg:justify-end underline lg:mt-8 mt-10 px-5">
        <Logout location="teacherLogout" userData={userData} />
      </div>
      <div className="flex min-h-screen justify-center pb-[250px]">
        <div className="flex max-w-[900px] flex-col">
          <div className="flex flex-col md:flex-row max-w-[900px] justify-start mb-2 lg:mt-0 mt-8 mx-4 md:ml-5">
            <SimpleTopNav
              pageTitle={classroom?.classSubject}
              fontsize="text-[30px] md:text-[30px] xl:text-[24px]"
            />
            <div className="flex flex-col px-4 md:flex-row justify-center md:items-center border-t-2 border-b-2 border-sandwich md:border-none">
              <div
                className="flex items-center w-full justify-between md:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                <h2 className="md:hidden my-5 md:my-0 font-semibold text-[15px] font-[Poppins]">
                  Details
                </h2>
                <svg
                  className={`transition-transform duration-300 md:hidden ${
                    isOpen ? "" : "rotate-180"
                  }`}
                  width="70"
                  height="70"
                  viewBox="0 -25 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="50"
                    y1="10"
                    x2="35"
                    y2="30"
                    stroke="#8D8772"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <line
                    x1="50"
                    y1="10"
                    x2="65"
                    y2="30"
                    stroke="#8D8772"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div
                className={`transition-all duration-500 ease-in-out md:flex overflow-hidden ${
                  isOpen ? "max-h-[500px]" : "max-h-0"
                } md:max-h-full md:h-auto`}
              >
                <ClassDetails
                  teacherId={teacherId}
                  classroomId={classroomId}
                  hasButtons={false}
                />
              </div>
            </div>
          </div>

          <h4 className="font-[Poppins] text-[18px] md:text-[24px] text-center px-2 mt-4">
            Set preset goal options for your students
          </h4>
          <br />

          <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem]">
            <h2 className="font-[Poppins] text-[18px] md:text-[22px] mb-6">
              "What's your most important <u>goal</u> for the day?"
            </h2>

            {/* Divs in place of buttons for this selection probably. Here is one div since they will probably need to be listed from the backend depending on how many choices the teacher has made */}
            {goalAnswers.map((answer, index) => (
              <div
                key={index}
                className={`flex bg-white rounded-[1rem] border-graphite border-[4px]  items-center justify-between mt-[1rem] mb-[1rem]`}
              >
                {editGoalMode[index] ? (
                  <textarea
                    key={index}
                    value={answer}
                    onChange={(e) =>
                      handleInputGoalChange(index, e.target.value)
                    }
                    className="w-10/12 px-3 pt-[15px] md:px-5 rounded-[1rem] text-[17px] font-body "
                  />
                ) : (
                  <div
                    className={`flex rounded-[1rem] items-center justify-between mt-[1rem] mb-[1rem] h-[34px] `}
                  >
                    <h3 className="text-[17px] font-body pl-3">{answer}</h3>
                  </div>
                )}
                <div className="flex flex-col-reverse md:flex-row text-body font-body items-center pr-4">
                  {/* edit button */}
                  <button onClick={() => toggleEditGoalMode(index)}>
                    <img
                      className={` h-5 md:h-7 px-3 ${
                        editGoalMode[index] ? "" : "opacity-50"
                      }`}
                      src={editIcon}
                      alt="edit"
                    />
                  </button>

                  {/* delete "x" button */}
                  <button onClick={() => removeGoalsAnswer(index)}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[18px] sm:w-[24px]"
                    >
                      <line
                        x1="5"
                        y1="5"
                        x2="19"
                        y2="19"
                        stroke="#000"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <line
                        x1="19"
                        y1="5"
                        x2="5"
                        y2="19"
                        stroke="#000"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Add new goal div */}
            <div className="rounded-[1rem] border-graphite border-[4px] py-2 mt-[1rem] mb-[1.5rem]">
              <h4
                className="text-[17px] font-semibold font-[Poppins] text-center"
                role="button"
                onClick={() => addAnswer("goal")}
              >
                Add new goal +
              </h4>
            </div>

            <div className="flex mx-2 gap-5 items-center justify-between">
              <label
                htmlFor="customGoals"
                className="text-[17px] font-[Poppins]"
              >
                Allow students to input custom needs?
              </label>
              <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex items-center">
                <label htmlFor="yes" className="mr-2">
                  Yes
                </label>
                <input
                  type="checkbox"
                  id="yes"
                  name="customGoals"
                  value="yes"
                  checked={goalsSelectedOption === "yes"}
                  onChange={handleGoalsCheckboxChange}
                  className="w-5 h-5"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="no" className="mr-2">
                  No
                </label>
                <input
                  type="checkbox"
                  id="no"
                  name="customGoals"
                  value="no"
                  checked={goalsSelectedOption === "no"}
                  onChange={handleGoalsCheckboxChange}
                  className="w-5 h-5"
                />
              </div>
              </div>
            </div>
          </div>
          <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem] mt-[3rem]">
            <h2 className="font-[Poppins] text-[18px] md:text-[22px] mb-6">
              "What do you <u>need</u> from an adult to succeed today?"
            </h2>

            {needAnswers.map((answer, index) => (
              <div
                key={index}
                className={`flex bg-white rounded-[1rem] border-graphite border-[4px]  items-center justify-between mt-[1rem] mb-[1rem]`}
              >
                {editNeedsMode[index] ? (
                  <textarea
                    key={index}
                    value={answer}
                    onChange={(e) =>
                      handleInputNeedChange(index, e.target.value)
                    }
                    className="w-10/12 px-3 pt-[15px] md:px-5 rounded-[1rem] text-[17px] font-body "
                  />
                ) : (
                  <div
                    className={`flex md:p-5 rounded-[1rem] items-center justify-between mt-[1rem] mb-[1rem] h-[34px] `}
                  >
                    <h3 className="text-[17px] font-body pl-3">{answer}</h3>
                  </div>
                )}

                <div className="flex flex-col-reverse md:flex-row text-body font-body items-center pr-4">
                  {/* edit button */}
                  <button onClick={() => toggleEditNeedsMode(index)}>
                    <img
                      className={` h-5 md:h-7 px-3 ${
                        editNeedsMode[index] ? "" : "opacity-50"
                      }`}
                      src={editIcon}
                      alt="edit"
                    />
                  </button>

                  {/* delete "x" button */}
                  <button onClick={() => removeNeedsAnswer(index)}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[18px] sm:w-[24px]"
                    >
                      <line
                        x1="5"
                        y1="5"
                        x2="19"
                        y2="19"
                        stroke="#000"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <line
                        x1="19"
                        y1="5"
                        x2="5"
                        y2="19"
                        stroke="#000"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Add new need div */}
            <div className="rounded-[1rem] border-graphite border-[4px] py-2 mt-[1rem] mb-[1.5rem]">
              <h4
                className="text-[17px] font-semibold font-[Poppins] text-center"
                role="button"
                onClick={() => addAnswer("need")}
              >
                Add new need +
              </h4>
            </div>

            {/* checkbox options */}
            <div className="flex mx-2 gap-5 items-center justify-between">
              <label
                htmlFor="customGoals"
                className="text-[17px] font-[Poppins]"
              >
                Allow students to input custom needs?
              </label>
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="flex items-center">
                  <label htmlFor="yes" className="mr-2">
                    Yes
                  </label>
                  <input
                    type="checkbox"
                    id="yes"
                    name="customNeeds"
                    value="yes"
                    checked={needsSelectedOption === "yes"}
                    onChange={handleNeedsCheckboxChange}
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex items-center">
                  <label htmlFor="no" className="mr-2">
                    No
                  </label>
                  <input
                    type="checkbox"
                    id="no"
                    name="customNeeds"
                    value="no"
                    checked={needsSelectedOption === "no"}
                    onChange={handleNeedsCheckboxChange}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </div>
            {/* Save Button on Tablet and Phone screens centered*/}
            <div className="lg:hidden flex justify-center">
              <div
                className="lg:hidden fixed bottom-36 flex "
                onClick={handleSubmit}
              >
                <Button buttonText="Save" />
              </div>
            </div>
            {/* Small Save button for desktop/large screens to the right */}
            <div>
              <div
                className="hidden lg:fixed lg:bottom-36 lg:right-10 lg:flex "
                onClick={handleSubmit}
              >
                <SmallSaveButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tells user they have saved the layout */}
      <div className="flex justify-center">
        <MsgModal
          msgText="Save Successful!"
          showMsg={showMsg}
          textColor="text-black"
        />
      </div>

      <div className="bottom-0 z-40 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
        <Nav teacherId={teacherId} classroomId={classroomId} />
      </div>
    </>
  );
};

export default withAuth(["teacher"])(NeedsGoals);
