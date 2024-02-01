import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getTeacherClassroom,
  getAllStudentsClassroom,
  deleteStudentFromClassroom,
  getTeacherById,
  getAllStudents,
  addStudentToClassroom,
} from "../../api/teachersApi";
import { getBackgroundColorClass } from "../../components/ClassRoomColors";
import xButton from "../../images/x-button.png";
import "./scrollbar.css";
import GoBack from "../../components/GoBack.jsx";

export default function ViewClassList() {
  const { teacherId, classroomId } = useParams();
  const { userData } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("zor");
  const [sortDirection, setSortDirection] = useState("asc");
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

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const sortStudents = () => {
    const zorOrder = ["Unmotivated", "Wiggly", "Ready to Learn", "Explosive"];

    const sortedStudents = [...students].sort((a, b) => {
      if (sortCriteria === "lastName") {
        return sortDirection === "desc"
          ? a.lastName.localeCompare(b.lastName)
          : b.lastName.localeCompare(a.lastName);
      } else if (sortCriteria === "zor") {
        const zorA =
          a.journalEntries[a.journalEntries.length - 1]?.checkout?.ZOR ||
          a.journalEntries[a.journalEntries.length - 1]?.checkin?.ZOR;
        const zorB =
          b.journalEntries[b.journalEntries.length - 1]?.checkout?.ZOR ||
          b.journalEntries[b.journalEntries.length - 1]?.checkin?.ZOR;

        const indexA = zorOrder.indexOf(zorA);
        const indexB = zorOrder.indexOf(zorB);

        if (indexA === -1 && indexB === -1) {
          return 0;
        } else if (indexA === -1) {
          return 1;
        } else if (indexB === -1) {
          return -1;
        } else {
          return indexA - indexB;
        }
      }

      return 0;
    });

    if (sortCriteria === "zor" && sortDirection === "desc") {
      sortedStudents.reverse();
    }

    return sortedStudents;
  };

  const sortedStudents = sortStudents();

  return (
    <>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col justify-center h-screen pt-[4rem]">
          {classroom ? (
            <>
              <div className="flex justify-center gap-[8rem] mb-[0.5rem] ">
                <div className="flex items-center ">
                  <GoBack />
                  <h2 className="text-header4 font-header2 ml-[2rem] ">
                    {classroom.classSubject}
                  </h2>
                </div>
                <div className="flex-col text-sm font-body">
                  <h2>Location:</h2>
                  <h2 className="font-semibold">{classroom.location}</h2>
                </div>

                <div className="flex-col text-sm font-body ">
                  <div className="flex gap-4">
                    <h2>Check-in</h2>
                    <h2>Check-out</h2>
                  </div>
                  <div className="flex gap-[4rem] font-semibold">
                    <h2>
                      {classroom.checkIn ? `${classroom.checkIn}AM` : "-"}
                    </h2>
                    <h2>
                      {classroom.checkOut ? `${classroom.checkOut}PM` : "-"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="flex justify-center w-[70%] mr-auto ml-auto">
                <div className="flex">
                  <div className="pr-[0.5rem]">
                    <button
                      className={`md:text-body font-body rounded-[0.7rem] ${
                        sortCriteria === "zor"
                          ? "border-sandwich border-[4px] bg-sandwich"
                          : "border-[4px] border-sandwich"
                      } pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] md:w-[20rem] w-[16rem]`}
                      onClick={() => {
                        setSortCriteria("zor");
                        toggleSortDirection();
                      }}
                    >
                      Sort by Regulatory Zone
                    </button>
                  </div>
                  <div className="pl-[0.5rem]">
                    <button
                      className={`md:text-body font-body rounded-[0.7rem] ${
                        sortCriteria === "lastName"
                          ? "border-sandwich border-[4px] bg-sandwich"
                          : "border-[4px] border-sandwich"
                      } pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] md:w-[20rem] w-[16rem] `}
                      onClick={() => {
                        setSortCriteria("lastName");
                        toggleSortDirection();
                      }}
                    >
                      Sort by Last Name
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-header2 font-header2 text-center my-[1rem]">
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
              <div className="flex justify-center overflow-y-auto custom-scrollbar">
                {sortedStudents.length > 0 ? (
                  <ul className="w-[70%] ">
                    {sortedStudents.map((student, index) => {
                      const lastJournal =
                        student.journalEntries[
                          student.journalEntries.length - 1
                        ];
                      if (lastJournal) {
                        const lastCheckin = lastJournal.checkin;
                        const lastCheckout = lastJournal.checkout;
                        if (lastCheckout && lastCheckout.emotion) {
                          const lastEmotion = lastCheckout.emotion;
                          const zor = lastCheckout.ZOR;
                          const bgColorClass = getBackgroundColorClass(zor);
                          return (
                            <li key={`${student.id}-${index}`}>
                              <div
                                className={`bg-${bgColorClass} my-3 p-4 rounded-lg`}
                              >
                                {/* <div>
                                    {student.avatarImg && (
                                        <img
                                            src={student.avatarImg}
                                            alt={`Avatar for ${student.firstName} ${student.lastName}`}
                                            className="w-10 h-10 rounded-full mr-4"
                                        />
                                    )}
                                </div> */}
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
                                  Goals: {lastCheckout.goal}
                                  <br />
                                  Needs: {lastCheckout.need}
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
                        } else if (lastCheckin && lastCheckin.emotion) {
                          const lastEmotion = lastCheckin.emotion;
                          const zor = lastCheckin.ZOR;
                          const bgColorClass = getBackgroundColorClass(zor);
                          return (
                            <li key={`${student.id}-${index}`}>
                              <div
                                className={`bg-${bgColorClass} my-3 p-4 rounded-lg`}
                              >
                                <div className="flex justify-between">
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
                                  Goals: {lastCheckin.goal}
                                  <br />
                                  Needs: {lastCheckin.need}
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
                      }
                      return (
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

          <div className="w-[90%] ml-auto mr-auto mt-[1rem] pb-6">
            <div className="flex justify-between text-body font-body">
              <a href="/teacher-home">&lt; All Classes</a>
              <div>
                <button onClick={() => setIsEditMode(!isEditMode)}>
                  {isEditMode ? "Save Changes" : "Edit Students"}
                </button>
              </div>
            </div>

            <div className="flex rounded-[1rem] border-sandwich border-[8px] w-[25%] ml-auto mr-auto ">
              <div className="text-body font-body p-[1rem] bg-sandwich">
                <Link to={`/classroom/${userData._id}/${classroomId}`}>
                  Room
                </Link>
              </div>
              <div className="text-body font-body p-[1rem]">List</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
