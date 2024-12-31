import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext.js";
import {
  getTeacherById,
  getAllStudentsClassroom,
  deleteClassroom,
} from "../../api/teachersApi.js";
import {
  getBackgroundColorClass,
  calculateZorPercentage,
} from "../../utils/classroomColors.js";
import xButton from "../../images/x-button.png";
import Greeting from "../../components/TGreeting.jsx";
import "tailwind-scrollbar";
import "./scrollbar.css";
import TeacherNavbar from "../../components/Navbar/TeacherNavbar.jsx";
import Nav from "../../components/Navbar/Nav.jsx";
import withAuth from "../../hoc/withAuth.js";
import ConfirmationModal from "../../components/TeacherView/ConfirmationModal.jsx";

const TeacherHome = () => {
  const { userData } = useUser();
  const [classroomsData, setClassroomsData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const confirmRef = useRef(null);

  const openConfirmModal = () => {
    confirmRef.current?.showModal();
  };

  const closeConfirmModal = () => {
    confirmRef.current?.close();
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await getTeacherById(userData._id);
        const studentsPromises = response.classrooms.map(async (classroom) => {
          const students = await getAllStudentsClassroom(
            userData._id,
            classroom._id
          );
          const zorPercentages = calculateZorPercentage({ students });
          return { classroom, students, zorPercentages };
        });

        const classroomsWithStudents = await Promise.all(studentsPromises);
        setClassroomsData(classroomsWithStudents);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTeacherData();
  }, [userData]);

  const handleDeleteClassroom = async (classroomId) => {
    try {
      await deleteClassroom(userData._id, classroomId);
      setClassroomsData((prevData) =>
        prevData.filter((item) => item.classroom._id !== classroomId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    setSelectedClassroom(userData._id);
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <div className="h-screen lg:ml-28">
          <header className=" mb-3">
            <Greeting isEditMode={isEditMode} userData={userData} />
          </header>
          <section className="custom-scrollbar h-[60%] grid">
            {userData && userData.classrooms ? (
              classroomsData.map(({ classroom, zorPercentages }, index) => (
                <article
                  key={index}
                  className="bg-sandwich w-[80%] ml-auto mr-auto p-[0.5rem] rounded-[1rem] my-[1rem]"
                >
                  <header className="flex justify-between">
                    <h2 className="text-header4 font-header2 text-left">
                      {classroom.classSubject}
                    </h2>
                    {isEditMode ? (
                      <button
                        className="-mt-[3rem] -mx-[2rem]"
                        onClick={openConfirmModal}
                      >
                        <img src={xButton} alt="xButton" />
                      </button>
                    ) : null}
                  </header>

                  <div className="bg-notebookPaper p-[0.5rem] rounded-[1rem]">
                    <dl className="flex justify-between mb-[1rem] mx-2">
                      <div className="flex-col text-sm font-body">
                        <dt>Location:</dt>
                        <dd className="font-semibold">{classroom.location}</dd>
                      </div>

                      <div className="flex-col text-sm font-body ">
                        <div className="flex gap-4">
                          <dt>Check-in</dt>
                          <dt>Check-out</dt>
                        </div>
                        <div className="flex gap-[4rem] font-semibold">
                          <dd>
                            {classroom.checkIn ? `${classroom.checkIn}` : "-"}
                          </dd>
                          <dd>
                            {classroom.checkOut ? `${classroom.checkOut}` : "-"}
                          </dd>
                        </div>
                      </div>
                    </dl>
                    <div className="flex justify-between">
                      <div className="flex w-[80%] bg-sandwich rounded-[1rem] h-[2.5rem]">
                        {Object.entries(zorPercentages).map(
                          ([zor, percentage], i, arr) => (
                            <div
                              key={zor}
                              style={{ width: `${percentage}%` }}
                              className={`bg-${getBackgroundColorClass(zor)} ${
                                i === 0 ? "rounded-l-[1rem]" : ""
                              } ${
                                i === arr.length - 1 ? "rounded-r-[1rem]" : ""
                              } h-[2.5rem]`}
                            ></div>
                          )
                        )}
                      </div>
                      <div className="flex items-center ">
                        <h2 className="font-semibold underline p-2">
                          <Link
                            to={`/classroom/${userData._id}/${classroom._id}`}
                          >
                            {" "}
                            Details{">"}
                          </Link>
                        </h2>
                      </div>
                    </div>
                  </div>

                  <ConfirmationModal
                    ref={confirmRef}
                    closeConfirmModal={closeConfirmModal}
                    itemFullName={classroom.classSubject}
                    itemId={classroom._id}
                    deleteMsg={
                      "Are you sure you want to delete this classroom? This cannot be undone."
                    }
                    removeItemFromSystem={handleDeleteClassroom}
                    inputNeeded={false}
                  />
                </article>
              ))
            ) : (
              <p>Loading classrooms...</p>
            )}
          </section>
          <div className="flex justify-center pt-2">
            <button
              className="text-header2 font-header2 underline"
              onClick={handleEditClick}
            >
              {isEditMode ? "Done" : ""}
            </button>
          </div>
        </div>

        {/* <div className="w-[35%] lg:order-first"> */}
        <aside className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
          <Nav setIsEditMode={setIsEditMode} teacherId={userData._id} />
        </aside>
      </div>
    </>
  );
};

export default withAuth(["teacher"])(TeacherHome);
