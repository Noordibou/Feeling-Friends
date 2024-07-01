import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import saveButton from '../../images/button.png'
import BtnRainbow from "../../components/BtnRainbow";
import withAuth from "../../hoc/withAuth";
import SimpleTopNav from "../../components/SimpleTopNav";
import ClassDetails from "../../components/ClassDetails";
import { getTeacherClassroom, getAllStudentsClassroom } from "../../api/teachersApi";
import { useUser } from "../../context/UserContext";
import MsgModal from "../../components/SeatingChart/MsgModal";
import Button from "../../components/Button"
import Nav from "../../components/Navbar/Nav";
import editButton from '../../images/edit_icon.png'

const NeedsGoals = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { teacherId, classroomId } = useParams();
  const { userData, updateUser } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [students, setStudents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [answers, setAnswers] = useState([""]);
  
  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const addAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const removeAnswer = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    console.log("click save")
    // Show brief save message for 3 secs
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 2500);
  }

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

    console.log("classroom: " + JSON.stringify(classroom))

    window.scrollTo(0, 0);
    fetchData();
  }, [teacherId, classroomId]);

  return (
    <>
      <div className="flex min-h-screen justify-center">
        <div className="flex max-w-[900px] flex-col mb-20">
          <div className="flex flex-col md:flex-row max-w-[900px] justify-start mb-2 mt-8 mx-4 md:ml-5">
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
                className={`transition-max-h md:flex overflow-hidden ${
                  isOpen ? "h-full" : "max-h-0"
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

          <h4 className="font-[Poppins] text-[18px] md:text-[24px] text-center px-2">
            Set preset goal options for your students
          </h4>
          <br />

          <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem]">
            <h2 className="font-[Poppins] text-[18px] md:text-[24px] ">
              "What's your most important <u>goal</u> for the day?"
            </h2>

            {/* Divs in place of buttons for this selection probably. Here is one div since they will probably need to be listed from the backend depending on how many choices the teacher has made */}
            {isEditMode ? (
              <>
                {answers.map((answer, index) => (
                  <div
                    className={`flex bg-white rounded-[1rem] border-graphite border-[4px]  items-center justify-between mt-[1rem] mb-[1rem]`}
                  >
                    <input
                      key={index}
                      value={answer}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="w-full h-full p-3 md:p-5 rounded-[1rem] text-[17px] font-body"
                    />
                    <div className="flex text-body font-body items-center pr-4">
                      <button onClick={() => removeAnswer(index)}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
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
              </>
            ) : (
              <div
                className={`flex p-3 md:p-5 rounded-[1rem] border-graphite border-[4px]  items-center justify-between mt-[1rem] mb-[1rem]`}
              >
                <h3 className="text-[17px] font-body">
                  Finish homework during study hall
                </h3>
              </div>
            )}

            {/* Add new goal div */}
            <div className="rounded-[1rem] border-graphite border-[4px] p-[1.5rem] mt-[1rem] mb-[1rem]">
              <h4
                className="text-[17px] font-[Poppins] text-center"
                role="button"
                onClick={addAnswer}
              >
                Add new goal +
              </h4>
            </div>

            <div className="flex mx-2 gap-5 items-center ">
              <label for="customGoals" className="text-[17px] font-[Poppins]">
                Allow students to input custom goals
              </label>{" "}
              <input
                type="checkbox"
                id="yes"
                name="checkbox"
                value="1"
                className="w-5 h-5 mr-5"
              />
            </div>
          </div>
          <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem] mt-[3rem]">
            <h2 className="text-header2 font-header2 text-center">
              "What do you <u>need</u> from an adult to succeed today?"
            </h2>

            <div className="bg-white rounded-[1rem] border-graphite border-[4px] p-[1.5rem] flex justify-between mt-[1rem] mb-[1rem]">
              <div className="text-body font-body">
                Finish homework during study hall
              </div>
              <div className="text-body font-body">
                <a href="/">Edit</a> &nbsp; <a href="/">X</a>
              </div>
            </div>

            {/* Add new need div */}
            <div className="rounded-[1rem] border-graphite border-[4px] p-[1.5rem] mt-[1rem] mb-[1rem]">
              <h4 className="text-body font-body text-center">
                Add new need +
              </h4>
            </div>

            <div className="flex justify-between">
              <div>
                <span className="text-body font-body">
                  Allow students to input custom needs?
                </span>
              </div>
              <div>
                <label for="customGoals" className="text-body font-body">
                  Yes
                </label>{" "}
                <input
                  type="checkbox"
                  id="yes"
                  name="checkbox"
                  value="1"
                  className="w-5 h-5 mr-[2rem]"
                />
                <label for="customGoals" className="text-body font-body">
                  No
                </label>{" "}
                <input
                  type="checkbox"
                  id="no"
                  name="checkbox"
                  value="1"
                  className="w-5 h-5"
                />
              </div>
            </div>
            {/* Save Button in Bottom Right Corner */}
            <div className="fixed bottom-36 right-10" onClick={handleSubmit}>
              <Button buttonText="Save" />
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
        <Nav
          setIsEditMode={setIsEditMode}
          teacherId={teacherId}
          classroomId={classroomId}
        />
      </div>
    </>
  );
}

export default withAuth(['teacher'])(NeedsGoals)