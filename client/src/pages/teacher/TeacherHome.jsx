import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
import Nav from "../../components/Navbar/Nav.jsx";
import withAuth from "../../hoc/withAuth.js";
import ConfirmationModal from "../../components/TeacherView/ConfirmationModal.jsx";
import Loading from "../Loading.jsx";
import { handleSuccess } from "../../utils/toastHandling";
import { formatTime } from "../../utils/dateFormat";
import favoriteIconStar from "../../images/favoriteIconStar.svg";
import unFavIconStar from "../../images/unfavIconStar.svg";
import Button from "../../components/Button.jsx";
import SmallSaveButton from "../../components/SmallSaveButton.jsx";
import Tooltip from "../../components/Tooltip.jsx";

const TeacherHome = () => {
  const { userData, updateUser } = useUser();
  const [classroomsData, setClassroomsData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const modalRefs = useRef({});
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getActiveDays = (bitmask) => {
    return daysOfWeek.filter((day, index) => (bitmask & (1 << index)) !== 0);
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

  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const isRedirectedFromLogin = new URLSearchParams(location.search).get(
      "login"
    );

    const fetchTeacherData = async () => {
      setLoading(true);

      try {
        if (isRedirectedFromLogin) {
          await wait(500);
        }
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
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, [userData]);

  const handleDeleteClassroom = async (classroomId, classroomSubject) => {
    try {
      await deleteClassroom(userData._id, classroomId);
      setClassroomsData((prevData) =>
        prevData.filter((item) => item.classroom._id !== classroomId)
      );
      closeConfirmModal(classroomId);
      handleSuccess(`${classroomSubject} deleted successfully!`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFavorite = (classroomId) => {
    setClassroomsData((prevClassroomsData) => {
      if (!prevClassroomsData) return prevClassroomsData;

      const updatedData = prevClassroomsData.map((item) =>
        item.classroom._id === classroomId
          ? {
              ...item,
              classroom: {
                ...item.classroom,
                isFavorite: !item.classroom.isFavorite,
              },
            }
          : item
      );

      return updatedData;
    });
  };

  const handleEditClick = async () => {
    if (!userData || !classroomsData) return;

    const updatedUserData = {
      ...userData,
      classrooms: classroomsData.map((item) => item.classroom),
    };

    console.log("Submitting updated userData:", updatedUserData);

    try {
      await updateUser(updatedUserData);
      console.log("User data updated successfully!");

      // Clear pending updates after successful submission
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col justify-center">
        <div className="h-screen lg:ml-28">
          <div className="max-w-5xl mx-auto px-4 pb-60 lg:pb-32">
            <header className=" mb-3">
              <Greeting isEditMode={isEditMode} userData={userData} />
            </header>
            <section className="h-[60%] grid">
              {userData && userData.classrooms ? (
                <>
                  {/* Your Classes Today */}
                  <section>
                    <div className="flex justify-between items-center px-10 my-4">
                      <h2 className="text-2xl">Your Classes Today</h2>
                      <p className="text-sm font-bold border-sandwich border-2 p-2 rounded-[1rem]">
                        {todayDate}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-4 max-w-6xl mx-auto">
                      {classroomsData
                        .filter(({ classroom }) => {
                          const today = new Date()
                            .toLocaleString("en-US", { weekday: "short" })
                            .toUpperCase();
                          return getActiveDays(classroom.activeDays).includes(
                            today
                          );
                        })
                        .sort(({ classroom: a }, { classroom: b }) => {
                          // Sort so that favorite classrooms are at the top
                          return b.isFavorite - a.isFavorite; // 1: a isFavorite is false, b isFavorite is true
                        })
                        .map(({ classroom, zorPercentages }, index) => (
                          <div key={index}>
                            {/* TODO: fix height for medium and small screens */}
                            <Link
                              className={`block w-[80%] ml-auto mr-auto my-[1rem] h-[165px] ${
                                isEditMode ? "pointer-events-none" : ""
                              }`}
                              to={
                                isEditMode
                                  ? "#"
                                  : `/classroom/${userData._id}/${classroom._id}`
                              }
                            >
                              <article
                                className={`bg-sandwich p-[0.5rem] rounded-[1rem] ${
                                  !isEditMode
                                    ? "hover:scale-[102%] transition-transform duration-300 ease-in-out hover:border-darkSandwich hover:border-2"
                                    : ""
                                }`}
                              >
                                <header className="flex justify-between items-center w-full my-2">
                                  <div className="flex items-center gap-2">
                                    {/* if in isEditMode and user clicks do opposite */}
                                    {isEditMode ? (
                                      <Tooltip
                                        content="Unmark class as favorite"
                                        tooltipStyling="right-[50px] top-[-10px]"
                                      >
                                        <button
                                          className="pointer-events-auto"
                                          onClick={() => {
                                            console.log("clicked on favorite");
                                            handleToggleFavorite(classroom._id);
                                          }}
                                        >
                                          <img
                                            src={
                                              classroom.isFavorite
                                                ? favoriteIconStar
                                                : unFavIconStar
                                            }
                                            alt="Favorite"
                                            className="cursor-pointer"
                                          />
                                        </button>
                                      </Tooltip>
                                    ) : classroom.isFavorite ? (
                                      <img
                                        src={favoriteIconStar}
                                        alt="is fav"
                                      />
                                    ) : null}
                                    <h2 className="text-header4 font-header2 text-left w-[50%]">
                                      {classroom.classSubject}
                                    </h2>
                                  </div>
                                  <div className="flex flex-row justify-end mr-10 w-[50%] font-[Poppins]">
                                    <p>Location:</p>
                                    <p className="pl-1 font-bold">
                                      {classroom.location}
                                    </p>
                                  </div>
                                  {isEditMode ? (
                                    <Tooltip
                                      content="Delete class"
                                      tooltipStyling="left-[30px] top-[-30px]"
                                    >
                                      <button
                                        className="-mt-[3rem] -mx-[2rem] pointer-events-auto"
                                        onClick={() =>
                                          openConfirmModal(classroom._id)
                                        }
                                      >
                                        <img src={xButton} alt="xButton" />
                                      </button>
                                    </Tooltip>
                                  ) : null}
                                </header>

                                <div className="bg-notebookPaper p-[0.5rem] rounded-[1rem]">
                                  <dl className="flex justify-between mb-[1rem] mx-2">
                                    <div className="flex text-sm font-body items-center">
                                      <dt>Days:</dt>
                                      <dd className="font-semibold pl-1">
                                        {classroom.activeDays !== undefined &&
                                        classroom.activeDays !== null
                                          ? getActiveDays(
                                              classroom.activeDays
                                            ).join(" | ")
                                          : "-"}
                                      </dd>
                                    </div>

                                    {/* TODO: fix styling on large and small screens */}
                                    <div className="flex-col text-sm font-body ">
                                      <div className="flex gap-4">
                                        <dt>Check-in</dt>
                                        <dt>Check-out</dt>
                                      </div>
                                      <div className="flex gap-[4rem] font-semibold">
                                        <dd>
                                          {classroom.checkIn
                                            ? `${formatTime(classroom.checkIn)}`
                                            : "-"}
                                        </dd>
                                        <dd>
                                          {classroom.checkOut
                                            ? `${formatTime(
                                                classroom.checkOut
                                              )}`
                                            : "-"}
                                        </dd>
                                      </div>
                                    </div>
                                  </dl>
                                  <div className="flex justify-between">
                                    <div className="flex w-full bg-sandwich rounded-[1rem] h-[2.5rem]">
                                      {Object.entries(zorPercentages).map(
                                        ([zor, percentage], i, arr) => (
                                          <div
                                            key={zor}
                                            style={{ width: `${percentage}%` }}
                                            className={`bg-${getBackgroundColorClass(
                                              zor
                                            )} ${
                                              i === 0 ? "rounded-l-[1rem]" : ""
                                            } ${
                                              i === arr.length - 1
                                                ? "rounded-r-[1rem]"
                                                : ""
                                            } h-[2.5rem]`}
                                          ></div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <ConfirmationModal
                                  ref={getModalRef(classroom._id)}
                                  closeConfirmModal={() =>
                                    closeConfirmModal(classroom._id)
                                  }
                                  itemFullName={classroom.classSubject}
                                  itemId={classroom._id}
                                  deleteMsg={`Are you sure you want to delete ${classroom.classSubject}? This cannot be undone.`}
                                  removeItemFromSystem={handleDeleteClassroom}
                                  inputNeeded={false}
                                />
                              </article>
                            </Link>
                          </div>
                        ))}
                    </div>
                  </section>

                  {/* Other Classes */}
                  <section>
                    <h2 className="text-2xl px-10 my-4">Other Classes</h2>
                    <div className="flex flex-col space-y-4 max-w-6xl mx-auto">
                      {classroomsData
                        .filter(({ classroom }) => {
                          const today = new Date()
                            .toLocaleString("en-US", { weekday: "short" })
                            .toUpperCase();
                          return !getActiveDays(classroom.activeDays).includes(
                            today
                          );
                        })
                        .sort(({ classroom: a }, { classroom: b }) => {
                          // Sort so that favorite classrooms are at the top
                          return b.isFavorite - a.isFavorite; // 1: a isFavorite is false, b isFavorite is true
                        })
                        .map(({ classroom, zorPercentages }, index) => (
                          <div key={`other-${index}`}>
                            <Link
                              className={`block w-[80%] ml-auto mr-auto my-[1rem] h-[165px] ${
                                isEditMode ? "pointer-events-none" : ""
                              }`}
                              to={
                                isEditMode
                                  ? "#"
                                  : `/classroom/${userData._id}/${classroom._id}`
                              }
                            >
                              <article
                                className={`bg-sandwich p-[0.5rem] rounded-[1rem] ${
                                  !isEditMode
                                    ? "hover:scale-[102%] transition-transform duration-300 ease-in-out hover:border-darkSandwich hover:border-2"
                                    : ""
                                }`}
                              >
                                <header className="flex justify-between items-center w-full my-2">
                                  {/* if in isEditMode and user clicks do opposite */}
                                  {isEditMode ? (
                                    <Tooltip
                                      content="Unmark class as favorite"
                                      tooltipStyling="right-[50px] top-[-10px]"
                                    >
                                      <button
                                        className="pointer-events-auto"
                                        onClick={() => {
                                          console.log("clicked on favorite");
                                          handleToggleFavorite(classroom._id);
                                        }}
                                      >
                                        <img
                                          src={
                                            classroom.isFavorite
                                              ? favoriteIconStar
                                              : unFavIconStar
                                          }
                                          alt="Favorite"
                                          className="cursor-pointer"
                                        />
                                      </button>
                                    </Tooltip>
                                  ) : classroom.isFavorite ? (
                                    <img
                                      className=""
                                      src={favoriteIconStar}
                                      alt="is fav"
                                    />
                                  ) : null}
                                  <h2 className="text-header4 font-header2 text-left w-[50%]">
                                    {classroom.classSubject}
                                  </h2>
                                  <div className="flex flex-row justify-end mr-10 w-[50%] font-[Poppins]">
                                    <p>Location:</p>
                                    <p className="pl-1 font-bold">
                                      {classroom.location}
                                    </p>
                                  </div>
                                  {isEditMode ? (
                                    <Tooltip
                                      content="Delete class"
                                      tooltipStyling="-translate-x-[-20px] translate-y-[30px]"
                                    >
                                      <button
                                        className="-mt-[3rem] -mx-[2rem] pointer-events-auto"
                                        onClick={() =>
                                          openConfirmModal(classroom._id)
                                        }
                                      >
                                        <img src={xButton} alt="xButton" />
                                      </button>
                                    </Tooltip>
                                  ) : null}
                                </header>

                                <div className="bg-notebookPaper p-[0.5rem] rounded-[1rem]">
                                  <dl className="flex justify-between mb-[1rem] mx-2">
                                    <div className="flex text-sm font-body items-center">
                                      <dt>Days:</dt>
                                      <dd className="font-semibold pl-1">
                                        {classroom.activeDays !== undefined &&
                                        classroom.activeDays !== null
                                          ? getActiveDays(
                                              classroom.activeDays
                                            ).join(" | ")
                                          : "-"}
                                      </dd>
                                    </div>

                                    {/* TODO: fix styling on large and small screens */}
                                    <div className="flex-col text-sm font-body ">
                                      <div className="flex gap-4">
                                        <dt>Check-in</dt>
                                        <dt>Check-out</dt>
                                      </div>
                                      <div className="flex gap-[4rem] font-semibold">
                                        <dd>
                                          {classroom.checkIn
                                            ? `${formatTime(classroom.checkIn)}`
                                            : "-"}
                                        </dd>
                                        <dd>
                                          {classroom.checkOut
                                            ? `${formatTime(
                                                classroom.checkOut
                                              )}`
                                            : "-"}
                                        </dd>
                                      </div>
                                    </div>
                                  </dl>
                                  <div className="flex justify-between">
                                    <div className="flex w-full bg-sandwich rounded-[1rem] h-[2.5rem]">
                                      {Object.entries(zorPercentages).map(
                                        ([zor, percentage], i, arr) => (
                                          <div
                                            key={zor}
                                            style={{ width: `${percentage}%` }}
                                            className={`bg-${getBackgroundColorClass(
                                              zor
                                            )} ${
                                              i === 0 ? "rounded-l-[1rem]" : ""
                                            } ${
                                              i === arr.length - 1
                                                ? "rounded-r-[1rem]"
                                                : ""
                                            } h-[2.5rem]`}
                                          ></div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <ConfirmationModal
                                  ref={getModalRef(classroom._id)}
                                  closeConfirmModal={() =>
                                    closeConfirmModal(classroom._id)
                                  }
                                  itemFullName={classroom.classSubject}
                                  itemId={classroom._id}
                                  deleteMsg={`Are you sure you want to delete ${classroom.classSubject}? This cannot be undone.`}
                                  removeItemFromSystem={handleDeleteClassroom}
                                  inputNeeded={false}
                                />
                              </article>
                            </Link>
                          </div>
                        ))}
                    </div>
                  </section>
                </>
              ) : (
                <p>Loading classrooms...</p>
              )}
            </section>
            {/* Save Button on Tablet and Phone screens centered*/}
            {isEditMode && (
              <>
                <div className="lg:hidden flex justify-center items-center ">
                  <div
                    className="lg:hidden fixed bottom-32 xs:bottom-36 flex items-center justify-center "
                    onClick={handleEditClick}
                  >
                    <Button buttonText="Save" />
                  </div>
                </div>
                {/* Small Save button for desktop/large screens to the right */}
                <div>
                  <div
                    className="hidden lg:fixed lg:bottom-36 lg:right-10 lg:flex "
                    onClick={handleEditClick}
                  >
                    <SmallSaveButton />
                  </div>
                </div>
              </>
            )}
          </div>

          <aside className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
            <Nav setIsEditMode={setIsEditMode} teacherId={userData._id} />
          </aside>
        </div>
      </div>
    </>
  );
};

export default withAuth(["teacher"])(TeacherHome);
