import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import saveButton from '../../images/button.png'
import BtnRainbow from "../../components/BtnRainbow";
import withAuth from "../../hoc/withAuth";
import SimpleTopNav from "../../components/SimpleTopNav";
import ClassDetails from "../../components/ClassDetails";
import { getTeacherClassroom, getAllStudentsClassroom } from "../../api/teachersApi";
import { useUser } from "../../context/UserContext";

const NeedsGoals = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { teacherId, classroomId } = useParams();
  const { userData, updateUser } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [userInfo, setUserInfo] = useState({
    classSubject: '',
    location: '',
    checkIn: '',
    checkOut: '',
  });

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
        setUserInfo(userData)
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
      <div className="flex h-screen justify-center">
        <div className="flex max-w-[900px] flex-col">
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

          <h4 className="text-body font-body text-center">
            Set preset goal options for your students
          </h4>
          <br />

          <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem]">
            <h2 className="text-header2 font-header2 text-center">
              "What's your most important <u>goal</u> for the day?"
            </h2>

            {/* Divs in place of buttons for this selection probably. Here is one div since they will probably need to be listed from the backend depending on how many choices the teacher has made */}
            <div className="bg-white rounded-[1rem] border-graphite border-[4px] p-[1.5rem] flex justify-between mt-[1rem] mb-[1rem]">
              <div className="text-body font-body">
                Finish homework during study hall
              </div>
              <div className="text-body font-body">
                <a href="/">Edit</a> &nbsp; <a href="/">X</a>
              </div>
            </div>

            {/* Add new goal div */}
            <div className="rounded-[1rem] border-graphite border-[4px] p-[1.5rem] mt-[1rem] mb-[1rem]">
              <h4 className="text-body font-body text-center">
                Add new goal +
              </h4>
            </div>

            <div className="flex justify-between">
              <div>
                <span className="text-body font-body">
                  Allow students to input custom goals?
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

            <div className="mt-5">
              <BtnRainbow
                textColor="text-white"
                btnText="Save"
                handleSave={() =>
                  console.log("Saved! Need actual save function though")
                }
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
            <div className="mt-5">
              <BtnRainbow
                textColor="text-white"
                btnText="Save"
                handleSave={() =>
                  console.log("Saved! Need actual save function though")
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(['teacher'])(NeedsGoals)