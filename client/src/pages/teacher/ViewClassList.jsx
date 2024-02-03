import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getTeacherClassroom,
  getAllStudentsClassroom,
  deleteStudentFromClassroom,
} from "../../api/teachersApi";
import { getBackgroundColorClass } from "../../utils/classroomColors.js";
import xButton from "../../images/x-button.png";
import "./scrollbar.css";
import GoBack from "../../components/GoBack.jsx";
import ToggleButton from "../../components/ToggleButton.jsx";
import sortByCriteria from "../../utils/sortStudents.js";
import TeacherNavbar from "../../components/TeacherNavbar.jsx";
import ClassInfoNavbar from "../../components/ClassInfoNavbar.jsx";
import classBoxesIcon from "../../images/ClassBoxesIconDark.png";
import listIcon from "../../images/ListIconLight.png";
import StudentInfoBox from "../../components/StudentInfoBox.jsx";

export default function ViewClassList() {
  const { teacherId, classroomId } = useParams();
  const { userData } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleDeleteStudent = async (studentId) => {
    try {
      await deleteStudentFromClassroom(teacherId, classroomId, studentId);
      setStudents((prevData) =>
        prevData.filter((item) => item._id !== studentId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const sortedStudents = sortByCriteria(students);

  return (
    <>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col h-screen ">
          {classroom ? (
            <>
              {isEditMode ? (
                <>
                  {/* Top Nav (on Edit only)*/}
                  <div className="flex justify-around items-center mt-8">
                    <div className="absolute left-14">
                      <GoBack />
                    </div>
                    <span className="text-header1 w-full text-center font-header1">
                      Manage Classroom
                    </span>
                  </div>

                  {/* Classroom Info (on Edit only) */}
                  <div className="bg-sandwich w-[80%] ml-auto mr-auto px-5 rounded-[1rem] my-[1rem] mb-14">
                    <h2 className="text-header2 font-header2 my-[0.5rem]">
                      {classroom.classSubject}
                    </h2>
                    <div className="bg-notebookPaper p-[0.3rem] rounded-[1rem]">
                      <div className="flex justify-between mx-2">
                        <div className="flex-col text-sm font-body">
                          <h2>Location:</h2>
                          <h2 className="font-semibold">
                            {classroom.location}
                          </h2>
                        </div>

                        <div className="flex-col text-sm font-body ">
                          <div className="flex gap-4">
                            <div>
                              <h2>Check-in:</h2>
                              <h2>
                                {classroom.checkIn
                                  ? `${classroom.checkIn}AM`
                                  : "-"}
                              </h2>
                            </div>
                            <div>
                              <h2>Check-out:</h2>
                              <h2>
                                {classroom.checkOut
                                  ? `${classroom.checkOut}AM`
                                  : "-"}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center bg-sandwich rounded-[1rem]  py-[0.8rem]">
                      <h2 className="text-header3 font-semibold font-[Poppins] underline">
                        <a href={`/edit-seating-chart/${teacherId}/${classroomId}`}>Edit Seating Chart</a>
                      </h2>
                    </div>
                  </div>
                </>
              ) : (
                <ClassInfoNavbar
                  teacherId={teacherId}
                  classroomId={classroomId}
                />
              )}

              <ToggleButton students={students} setStudents={setStudents} />
              <div>
              <h2 className="text-header3 font-header2 text-center my-[1rem]">
              {isEditMode ? (
                  <Link className="underline" to={`/addstudent/${teacherId}/${classroomId}`}>
                  Add new student
                  </Link>
                  ) : (
                      ''
                      )}
                      </h2>
                  </div>

              {/* Scrollable list of students */}
              <div
                className={`flex justify-center overflow-y-auto custom-scrollbar ${
                  isEditMode ? "" : "h-[55%]"
                } pt-3`}
                key="list-of-students"
              >
                {sortedStudents.length > 0 ? (
                  <ul className="w-[70%]">
                    {sortedStudents.map((student, index) => {
                      const lastJournal =
                        student.journalEntries[
                          student.journalEntries.length - 1
                        ];

                      if (lastJournal) {
                        const isCheckout =
                          lastJournal.checkout && lastJournal.checkout.emotion;
                        const lastEmotion = isCheckout
                          ? lastJournal.checkout.emotion
                          : lastJournal.checkin?.emotion;
                        const zor = isCheckout
                          ? lastJournal.checkout.ZOR
                          : lastJournal.checkin?.ZOR;
                        const bgColorClass = getBackgroundColorClass(zor);

                        // Student if they've checked in or out
                        return (
                          <li key={`${student.id}-${index}`}>
                            <div
                              className={`bg-${bgColorClass} my-3 p-4 rounded-lg`}
                            >
                              <div className="pb-2 flex justify-between">
                                <div>
                                  {student.firstName} {student.lastName} is
                                  feeling <b>{lastEmotion}</b>
                                </div>
                                {isEditMode && (
                                  <div className="-mt-8 -mx-8">
                                    <div>
                                      <button
                                        onClick={() =>
                                          handleDeleteStudent(student._id)
                                        }
                                      >
                                        <img src={xButton} alt="xButton" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="bg-notebookPaper px-2 py-2 rounded-md flex justify-between">
                                Goals:{" "}
                                {isCheckout
                                  ? lastJournal.checkout.goal
                                  : lastJournal.checkin?.goal}
                                <br />
                                Needs:{" "}
                                {isCheckout
                                  ? lastJournal.checkout.need
                                  : lastJournal.checkin?.need}
                                <div className="pt-3 mr-2 underline">
                                  <Link
                                    to={`/${userData._id}/${classroomId}/${student._id}`}
                                  >
                                    More &gt;
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      }

                      return (
                        <>
                          {/* FIXME: Trying to get component StudentInfoBox to at least work here */}
                          {/* {isEditMode ? 
                        <div className="-mb-8">
                          <StudentInfoBox student={student} userData={userData} classroomId={classroomId} isEditMode={true} setSelectedStudent={handleDeleteStudent} />
                        </div>
                        :
                        <></>  

                        } */}

                          {/* Student if they haven't checked in or out yet */}
                          <li key={`${student.id}-${index}`}>
                            <div
                              className={`bg-white p-4 my-3 rounded-lg flex justify-between`}
                            >
                              <div className="">
                                {student.firstName} {student.lastName} didn't
                                check in or out yet!
                              </div>
                              <div className="flex justify-end">
                                {isEditMode && (
                                  <div className="-mt-10 -mx-24">
                                    <div>
                                      <button
                                        onClick={() =>
                                          handleDeleteStudent(student._id)
                                        }
                                      >
                                        <img src={xButton} alt="xButton" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                <Link
                                  to={`/${userData._id}/${classroomId}/${student._id}`}
                                  className="mr-4 underline"
                                >
                                  More &gt;
                                </Link>
                              </div>
                            </div>
                          </li>
                        </>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No students found.</p>
                )}
              </div>
            </>
          ) : (
            "Loading..."
          )}

          {/* Buttons for Home and save/edit */}
          <div className="w-[90%] ml-auto mr-auto mt-[1rem] pb-6">
            <div className="flex justify-between text-body font-body pb-2">
              <a href="/teacher-home">&lt; All Classes</a>
              <div>
                <button onClick={() => setIsEditMode(!isEditMode)}>
                  {isEditMode ? "Save Changes" : "Edit Students"}
                </button>
              </div>
            </div>

            {/* Room View & List Buttons */}
            <div className="flex justify-around w-full mt-6 items-center ">
              <div className="">
                <button className="text-body font-body border-[5px]   border-sandwich rounded-xl px-[1rem] flex items-center w-72 justify-center">
                  <Link
                    className="flex items-center px-[1rem] h-16"
                    to={`/classroom/${userData._id}/${classroomId}`}
                  >
                    <h4 className="pr-2">Room View</h4>
                    <img src={classBoxesIcon} alt="Student Room View" />
                  </Link>
                </button>
              </div>
              <div className="">
                <button className="text-body font-body rounded-xl px-[1rem] flex items-center h-20 w-72 border-[5px] border-sandwich bg-sandwich justify-center">
                  <h4 className="pr-5">List View</h4>
                  <img src={listIcon} alt="Student List View" />
                </button>
              </div>
            </div>
          </div>
      <div className="fixed bottom-0 w-screen">
        <TeacherNavbar />
      </div>
        </div>
      </div>
    </>
  );
}
