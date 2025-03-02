import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getTeacherClassroom,
  getAllStudentsClassroom,
  deleteStudentFromClassroom,
  getTeacherById,
} from "../../api/teachersApi";
import "./scrollbar.css";
import Button from "../../components/Button.jsx";
import SmallSaveButton from "../../components/SmallSaveButton.jsx";
import ToggleButton from "../../components/ToggleButton.jsx";
import sortByCriteria from "../../utils/sortStudents.js";
import ClassDetails from "../../components/ClassDetails.jsx";
import classBoxesIcon from "../../images/ClassBoxesIconDark.png";
import listIcon from "../../images/ListIconLight.png";
import StudentInfoBox from "../../components/StudentInfoBox.jsx";
import ButtonView from "../../components/TeacherView/ButtonView.jsx";
import SimpleTopNav from "../../components/SimpleTopNav.jsx";
import MsgModal from "../../components/SeatingChart/MsgModal.jsx";
import Nav from "../../components/Navbar/Nav.jsx";
import withAuth from "../../hoc/withAuth.js";
import Logout from "../../components/LogoutButton.jsx";
import UnsavedChanges from "../../components/TeacherView/UnsavedChanges.jsx";
import ConfirmationModal from "../../components/TeacherView/ConfirmationModal.jsx";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext.js";
import { handleSuccess } from "../../utils/toastHandling";
import Checkbox from "../../components/Checkbox.jsx";

const ViewClassList = () => {
  const { teacherId, classroomId } = useParams();
  const { userData, updateUser } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [userInfo, setUserInfo] = useState({
    classSubject: "",
    location: "",
    checkIn: "",
    checkOut: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const { setHasUnsavedChanges } = useUnsavedChanges();
  const modalRefs = useRef({});
  const [selectedDays, setSelectedDays] = useState([]);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const daysToBitmask = {
    SUN: 1,
    MON: 2,
    TUE: 4,
    WED: 8,
    THU: 16,
    FRI: 32,
    SAT: 64,
  };

  const calculateBitmask = (days) => {
    return days.reduce((bitmask, day) => bitmask | daysToBitmask[day], 0);
  };

  const openConfirmModal = (classroomId) => {
    modalRefs.current[classroomId]?.current?.showModal();
  };

  const closeConfirmModal = (classroomId) => {
    modalRefs.current[classroomId]?.current?.close();
  };

  const getModalRef = (classroomId) => {
    if (!modalRefs.current[classroomId]) {
      modalRefs.current[classroomId] = React.createRef();
    }
    return modalRefs.current[classroomId];
  };

  const bitmaskToDays = (bitmask) => {
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const days = [];

    // Check each bit (from right to left) and add the corresponding day to the array
    daysOfWeek.forEach((day, index) => {
      if (bitmask & (1 << index)) {
        days.push(day); // If the bit is set, add the day to the array
      }
    });

    return days;
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
        setUserInfo(userData);
        const bitmask = classroom.activeDays;
        if (bitmask) {
          const days = bitmaskToDays(bitmask);
          setSelectedDays(days);
        }
      } catch (error) {
        console.log(error);
      }
    };

    window.scrollTo(0, 0);
    fetchData();
  }, [teacherId, classroomId]);

  const handleDayChange = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((selectedDay) => selectedDay !== day);
      } else {
        return [...prev, day];
      }
    });
    setHasUnsavedChanges(true);
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    try {
      await deleteStudentFromClassroom(teacherId, classroomId, studentId);
      setStudents((prevData) =>
        prevData.filter((item) => item._id !== studentId)
      );
      closeConfirmModal(studentId);
      handleSuccess(`${studentName} removed from classroom successfully`);
      const updatedUserData = await getTeacherById(userData._id);
      updateUser(updatedUserData);
    } catch (error) {
      console.error(error);
    }
  };

  const saveClassroomInfo = async () => {
    const bitmask = calculateBitmask(selectedDays);

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
      activeDays: bitmask,
      location: classroom.location,
      checkIn: classroom.checkIn,
      checkOut: classroom.checkOut,
    };

    // update teacher from react context
    await updateUser(updatedUserInfo);

    console.log("User updated:", JSON.stringify(updatedUserInfo));
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    // Show brief save message for 3 secs
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 2500);
  };

  const handleInputChange = (field, value) => {
    setClassroom((prevData) => ({ ...prevData, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const sortedStudents = sortByCriteria(students);

  return (
    <>
      <main className="flex flex-col min-h-screen min-w-screen mb-44 lg:mb-0 lg:pb-0">
        <header className="hidden md:flex justify-center lg:justify-end underline mt-4 px-2 md:px-5">
          <Logout location="teacherLogout" userData={userData} />
        </header>
        <div className="flex flex-col items-center">
          <div className="flex flex-col h-full items-center w-full max-w-5xl lg:z-40 mt-2">
            {classroom ? (
              <>
                {isEditMode ? (
                  <>
                    {/* Top Nav (on Edit only)*/}
                    <header className="flex w-full md:w-[45%] justify-start md:mt-8">
                      <SimpleTopNav
                        pageTitle="Manage Classroom"
                        fontsize="text-[20px] md:text-[30px]"
                      />
                    </header>

                    {/* Classroom Info (on Edit only) */}
                    <div className="bg-sandwich max-w-[40%] min-w-[23rem] ml-auto mr-auto p-[1rem] rounded-[1rem] lg:my-[1rem] sm:my-[0rem]">
                      <h3 className="mb-[0.5rem] ml-[0.5rem] font-poppins font-bold text-sm">
                        Title or Subject
                      </h3>
                      <FormField
                        label="Math"
                        value={classroom?.classSubject || ""}
                        onChange={(e) =>
                          handleInputChange("classSubject", e.target.value)
                        }
                      />

                      <h3 className="mb-[0.5rem] ml-[0.5rem] mt-[1rem] font-poppins font-bold text-sm">
                        Days of the Week
                      </h3>
                      <div className="flex flex-wrap py-[1rem] gap-4 justify-center font-poppins lg:text-md sm:text-xs max-w-[100%]">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="flex gap-2 items-center">
                            {day}{" "}
                            <Checkbox
                              id={day}
                              handleCheckboxChange={() => handleDayChange(day)}
                              isChecked={selectedDays.includes(day)}
                              label={day}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="rounded-[1rem]">
                        <div className="flex-col text-sm font-body">
                          <h3 className="mt-[0.5rem] mb-[0.5rem] ml-[0.5rem] font-poppins font-bold text-sm">
                            Location
                          </h3>
                          <FormField
                            label="Classroom 101"
                            value={classroom?.location || ""}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <div className="flex gap-[8rem]">
                            <div className="w-[50%]">
                              <h3 className="mb-[0.5rem] ml-[0.2rem] mt-[1rem] font-poppins font-bold text-sm">
                                Check-in:
                              </h3>
                              <FormField
                                label="00:00 AM"
                                value={classroom?.checkIn || ""}
                                onChange={(e) =>
                                  handleInputChange("checkIn", e.target.value)
                                }
                                inputType="time"
                              />
                            </div>
                            <div className="w-[50%]">
                              <h3 className="mb-[0.5rem] ml-[0.2rem] mt-[1rem] font-poppins font-bold text-sm">
                                Check-out:
                              </h3>
                              <FormField
                                label="00:00 PM"
                                value={classroom?.checkOut || ""}
                                onChange={(e) =>
                                  handleInputChange("checkOut", e.target.value)
                                }
                                inputType="time"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center bg-sandwich rounded-[1rem] mt-[1rem]">
                        <h2 className="text-sm font-body">
                          <a href="/edit-seating-chart/:teacherId/:classroomId">
                            <u>Edit Seating Chart</u>
                          </a>
                        </h2>
                      </div>
                    </div>
                  </>
                ) : (
                  <section className="flex flex-col w-full md:justify-center md:flex-row md:mt-6 px-5 mb-5 md:mb-0">
                    <header className="flex md:justify-center">
                      <SimpleTopNav
                        pageTitle={classroom?.classSubject}
                        fontsize="text-[25px] xl:text-[24px]"
                      />
                    </header>
                    <div className="flex flex-col-reverse md:flex-row">
                      <div className="flex flex-col px-4 md:flex-row justify-center md:items-center border-t-2 border-b-2 border-sandwich md:border-none">
                        <div
                          className="flex items-center w-full justify-between md:hidden"
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          <h2 className="md:hidden my-5 md:my-0 font-semibold text-[15px] font-[Poppins]">
                            Details
                          </h2>
                          <svg
                            className={`transition-transform duration-500 md:hidden ${
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
                          className={`transition-all duration-700 ease-in-out md:flex overflow-hidden ${
                            isOpen ? "max-h-[500px]" : "max-h-0"
                          } md:max-h-full md:h-auto`}
                        >
                          <ClassDetails
                            teacherId={teacherId}
                            classroomId={classroomId}
                            selectedDays={selectedDays}
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
                            buttonText="Seating Chart"
                            defaultBtnImage={classBoxesIcon}
                            isSelected={false}
                            buttonSize="small"
                          />
                        </Link>
                        <ButtonView
                          buttonText="Class List"
                          btnImageWhenOpen={listIcon}
                          isSelected={true}
                          buttonSize="small"
                        />
                      </div>
                    </div>
                  </section>
                )}

                <ToggleButton students={students} setStudents={setStudents} />
                <div className="w-full max-w-[700px]">
                  {isEditMode ? (
                    <h2 className="text-[16px] md:text-header3 font-header2 text-center my-[1rem]">
                      <div className="flex w-full justify-center items-center">
                        <Link
                          className="underline w-[104%]"
                          to={`/add-student`}
                        >
                          Add new student
                        </Link>
                      </div>
                    </h2>
                  ) : null}
                </div>

                {/* Scrollable list of students */}
                <section
                  className={`px-4 md:px-0 md:mb-0 flex w-full justify-center md:overflow-y-auto md:custom-scrollbar ${
                    isEditMode
                      ? "h-full md:h-[35vh]"
                      : "h-full md:h-[50vh] lg:h-[55vh]"
                  } pt-3 `}
                  key="list-of-students-1"
                >
                  {sortedStudents.length > 0 ? (
                    <div
                      key={`container`}
                      className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6 md:h-32"
                    >
                      {sortedStudents.map((student, index) => {
                        return (
                          <article
                            key={`student-info-${index}`}
                            className="w-[98%] md:w-[460px]"
                          >
                            <StudentInfoBox
                              student={student}
                              userData={userData}
                              classroomId={classroomId}
                              isEditMode={isEditMode}
                              handleClick={() => openConfirmModal(student._id)}
                            />
                            <ConfirmationModal
                              ref={getModalRef(student._id)}
                              closeConfirmModal={() =>
                                closeConfirmModal(student._id)
                              }
                              itemFullName={`${student.firstName} ${student.lastName}`}
                              itemId={student._id}
                              deleteMsg={`Are you sure you want to delete ${student.firstName} ${student.lastName} from the classroom? This cannot be undone.`}
                              removeItemFromSystem={() =>
                                handleDeleteStudent(
                                  student._id,
                                  `${student.firstName} ${student.lastName}`
                                )
                              }
                              inputNeeded={false}
                            />
                          </article>
                        );
                      })}
                      {isEditMode && (
                        <>
                          {/* Save Button on Tablet and Phone screens centered */}
                          <div className="lg:hidden flex justify-center">
                            <div
                              className="fixed bottom-36 flex justify-center"
                              onClick={saveClassroomInfo}
                            >
                              <Button buttonText="Save" />
                            </div>
                          </div>

                          {/* Small Save button for desktop/large screens to the right */}
                          <div className="hidden lg:flex lg:fixed lg:bottom-36 lg:right-10">
                            <div onClick={saveClassroomInfo}>
                              <SmallSaveButton />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <p>No students found.</p>
                  )}
                </section>
              </>
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </main>
      <UnsavedChanges />
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
};

const FormField = ({ label, value, onChange, inputType }) => (
  <div>
    <input
      type={inputType || "text"}
      placeholder={label}
      value={value}
      onChange={onChange}
      className="custom-placeholder custom-input"
    />
  </div>
);

export default withAuth(["teacher"])(ViewClassList);
