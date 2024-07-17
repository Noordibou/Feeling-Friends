import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getTeacherClassroom,
  getAllStudentsClassroom,
  deleteStudentFromClassroom,
  getTeacherById,
} from "../../api/teachersApi";
import "./scrollbar.css";
import ToggleButton from "../../components/ToggleButton.jsx";
import sortByCriteria from "../../utils/sortStudents.js";
import TeacherNavbar from "../../components/Navbar/TeacherNavbar.jsx";
import ClassDetails from "../../components/ClassDetails.jsx";
import classBoxesIcon from "../../images/ClassBoxesIconDark.png";
import listIcon from "../../images/ListIconLight.png";
import StudentInfoBox from "../../components/StudentInfoBox.jsx";
import ButtonView from "../../components/ButtonView.jsx";
import SimpleTopNav from "../../components/SimpleTopNav.jsx";
import Nav from "../../components/Navbar/Nav.jsx";
import withAuth from "../../hoc/withAuth.js";

const ViewClassList = () => {
  const { teacherId, classroomId } = useParams();
  const { userData, updateUser } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    classSubject: '',
    location: '',
    checkIn: '',
    checkOut: '',
  });
  const [isOpen, setIsOpen] = useState(false)

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

  const handleDeleteStudent = async (studentId) => {
    try {
      await deleteStudentFromClassroom(teacherId, classroomId, studentId);
      setStudents((prevData) =>
        prevData.filter((item) => item._id !== studentId)
      );

      const updatedUserData = await getTeacherById(userData._id);
      updateUser(updatedUserData);
    } catch (error) {
      console.error(error);
    }
  };

  const saveClassroomInfo = async () => {
    // finding the index of this classroom needing to be updated
    const classroomIndex = userInfo.classrooms.findIndex(
      (c) => c._id === classroom._id
    );

    // double check that this classroom actually exists
    if (classroomIndex === -1) {
      console.error("Classroom not found");
      return;
    }

    const updatedUserInfo = { ...userInfo };

    // formatting new data from classrooms to the userData copy
    updatedUserInfo.classrooms[classroomIndex] = {
      ...updatedUserInfo.classrooms[classroomIndex],
      classSubject: classroom.classSubject,
      location: classroom.location,
      checkIn: classroom.checkIn,
      checkOut: classroom.checkOut,
    };

    // update teacher from react context
    await updateUser(updatedUserInfo);

    console.log("User updated:", JSON.stringify(updatedUserInfo));
    setIsEditMode(!isEditMode)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassroom({
      ...classroom,
      [name]: value,
    });
  };

  const sortedStudents = sortByCriteria(students);

  return (
    <>
      <div className="flex h-screen min-w-screen justify-center">
        <div className="flex flex-col items-center w-full lg:z-40 mt-8">
          {classroom ? (
            <>
              {isEditMode ? (
                <>
                  {/* Top Nav (on Edit only)*/}
                  <div className="mt-8">
                    <SimpleTopNav
                      pageTitle="Manage Classroom"
                      fontsize="text-[30px]"
                    />
                  </div>

                  {/* Classroom Info (on Edit only) */}
                  <div className="bg-sandwich w-[80%] max-w-[530px] ml-auto mr-auto px-5 rounded-[1rem] my-[1rem] mb-14">
                    <input
                      className="flex w-44 h-10 border-2 border-gray rounded my-3 pl-3 text-[22px]"
                      name="classSubject"
                      placeholder="Subject"
                      value={classroom.classSubject}
                      onChange={handleChange}
                    />
                    <div className="bg-notebookPaper p-[0.3rem] rounded-[1rem]">
                      <div className="flex justify-between mx-2">
                        <div className="flex-col text-sm font-body">
                          <h2>Location:</h2>
                          <input
                            className="border-2 w-56 border-gray rounded pl-3 py-1 text-[18px]"
                            name="location"
                            placeholder="Room 123"
                            value={classroom.location}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="flex-col text-sm font-body ">
                          <div className="flex gap-4">
                            <div>
                              <h2>Check-in:</h2>
                              <input
                                className="flex w-24 border-2 border-gray rounded pl-2 py-1 text-[18px]"
                                name="checkIn"
                                type="time"
                                value={classroom.checkIn}
                                onChange={handleChange}
                              />
                            </div>
                            <div>
                              <h2>Check-out:</h2>
                              <input
                                className="flex w-24 border-2 border-gray rounded pl-2 py-1 text-[18px]"
                                name="checkOut"
                                type="time"
                                value={classroom.checkOut}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center bg-sandwich rounded-[1rem]  py-[0.8rem]">
                      <h2 className="text-header3 font-semibold font-[Poppins] underline">
                        <a
                          href={`/edit-seating-chart/${teacherId}/${classroomId}`}
                        >
                          Edit Seating Chart
                        </a>
                      </h2>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col w-full md:justify-center md:flex-row md:mt-14 px-5 mb-10 xl:gap-8">
                  <div className="flex md:justify-center">
                    <SimpleTopNav
                      pageTitle={classroom?.classSubject}
                      fontsize="text-[22px] md:text-[18px] xl:text-[24px]"
                    />
                  </div>
                  <div className="flex flex-col-reverse md:flex-row xl:gap-8">
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
                        />
                      </div>
                    </div>
                    {/* Room View & List Buttons */}
                    <div className="flex justify-around md:justify-between gap-4 items-center mb-5 md:mb-0">
                      <Link
                        className="flex items-center h-16"
                        to={`/classroom/${userData._id}/${classroomId}`}
                      >
                        <ButtonView
                          buttonText="Room View"
                          defaultBtnImage={classBoxesIcon}
                          isSelected={false}
                          buttonSize="small"
                        />
                      </Link>
                      <ButtonView
                        buttonText="List View"
                        btnImageWhenOpen={listIcon}
                        isSelected={true}
                        buttonSize="small"
                      />
                    </div>
                  </div>
                </div>
              )}

              <ToggleButton students={students} setStudents={setStudents} />
              <div>
                <h2 className="text-header3 font-header2 text-center my-[1rem]">
                  {isEditMode ? (
                    <Link
                      className="underline"
                      to={`/addstudent/${teacherId}/${classroomId}`}
                    >
                      Add new student
                    </Link>
                  ) : (
                    ""
                  )}
                </h2>
              </div>

              {/* Scrollable list of students */}
              <div
                className={`flex w-full justify-center overflow-y-auto custom-scrollbar ${
                  isEditMode ? "h-[35%]" : "h-[55%]"
                } pt-3 `}
                key="list-of-students-1"
              >
                {sortedStudents.length > 0 ? (
                  <div
                    key={`container`}
                    className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6 h-32"
                  >
                    {sortedStudents.map((student, index) => {
                      return (
                        <div
                          key={`student-info-${index}`}
                          className="w-[98%] md:w-[460px]"
                        >
                          <StudentInfoBox
                            student={student}
                            userData={userData}
                            classroomId={classroomId}
                            isEditMode={isEditMode}
                            handleClick={() => handleDeleteStudent(student._id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>No students found.</p>
                )}
              </div>
            </>
          ) : (
            "Loading..."
          )}

          {/* Buttons for Home and save/edit */}
          <div className="flex flex-col w-[70%] mt-[1rem] pb-6">
            <div className="flex justify-between text-body font-body pb-2">
              <a href="/teacher-home">&lt; All Classes</a>
              <div>
                {/* <button onClick={() => setIsEditMode(!isEditMode)}> */}
                <button
                  className={`${
                    isEditMode ? "flex" : "hidden"
                  } px-3 py-2 bg-lightCyan border-lightBlue border-2 rounded-md`}
                  onClick={saveClassroomInfo}
                >
                  {isEditMode ? "Save Changes" : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="fixed bottom-0 w-screen">
        <TeacherNavbar setIsEditMode={setIsEditMode} />
        </div> */}
        <div className="bottom-0 z-40 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
          <Nav
            setIsEditMode={setIsEditMode}
            teacherId={teacherId}
            classroomId={classroomId}
          />
        </div>
      </div>
    </>
  );
}

export default withAuth(['teacher'])(ViewClassList)