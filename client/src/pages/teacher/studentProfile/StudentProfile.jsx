import TeacherNavbar from "../../../components/Navbar/TeacherNavbar.jsx";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentProfile, updateStudent } from "../../../api/teachersApi";
import { getBackgroundColorClass } from "../../../utils/classroomColors";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import youngStudent from "../../../images/young-student.png";
import "./StudentProfile.css";
import xButton from "../../../images/x-button.png";
import FileBase from "react-file-base64";
import WeekView from "../../../components/WeekView.jsx";
import StudentProfileBoxInfo from "../../../components/StudentProfileBoxInfo.jsx";
import editIcon from "../../../images/edit_icon.png";
import { getLastJournalInfo } from "../../../utils/editSeatChartUtil.js";
import Nav from "../../../components/Navbar/Nav.jsx";
import withAuth from "../../../hoc/withAuth.js";
const { calculateAge, formatDate } = require("../../../utils/dateFormat");

const StudentProfile = () => {
  const { teacherId, classroomId, studentId } = useParams();
  const [studentProfile, setStudentProfile] = useState(null);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [originalStudentProfile, setOriginalStudentProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editModeNotices, setEditModeNotices] = useState(false);

  const [isMonthView, setIsMonthView] = useState(true);
  const [lastSelectedCheck, setLastSelectedCheck] = useState({});
  const [openStudentInfoModal, setOpenStudentInfoModal] = useState(false);
  const [borderColorClass, setBorderColorClass] = useState("");

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const profile = await getStudentProfile(
          teacherId,
          classroomId,
          studentId
        );
        setStudentProfile(profile);
        setBorderColorClass(getLastJournalInfo(profile));

        const studentEvents = profile.journalEntries.map((entry) => ({
          title: "",
          date: new Date(entry.date),
          className: getBackgroundColorClass(
            entry.checkout?.ZOR || entry.checkin?.ZOR
          ),
        }));
        setEvents(studentEvents);
      } catch (error) {
        setError("An error occurred while fetching the student profile.");
        console.error(error);
      }
    };
    fetchStudentProfile();
    window.scrollTo(0, 0);
  }, [teacherId, classroomId, studentId]);

  const handleDateClick = (date) => {
    setSelectedDate(date);

    const selectedEntries = studentProfile.journalEntries.filter(
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    );

    // -------- for the Student Box modal on calendar --------- //
    const lastEntry = selectedEntries[selectedEntries.length - 1];

    let lastCheck;
    if (lastEntry) {
      if (lastEntry.checkout) {
        lastCheck = { ...lastEntry.checkout, date: lastEntry.date };
      } else if (lastEntry.checkin) {
        lastCheck = { ...lastEntry.checkin, date: lastEntry.date };
      }
    } else {
      lastCheck = null;
    }
    setLastSelectedCheck(lastCheck);
    setOpenStudentInfoModal(true);
    // -------------------------------------------------------- //

    setSelectedEntries(selectedEntries);
  };

  const handleEditClick = () => {
    setOriginalStudentProfile(studentProfile);
    setEditMode(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudentProfile({
      ...studentProfile,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    try {
      const updatedProfile = await updateStudent(
        teacherId,
        classroomId,
        studentId,
        studentProfile
      );
      setStudentProfile(updatedProfile);
      setEditMode(false);
    } catch (error) {
      setError("An error occurred while saving the student profile.");
      console.error(error);
    }
  };

  const handleCancelClick = () => {
    setStudentProfile(originalStudentProfile);
    setEditMode(false);
    // seteditModeNotices(false);
  };

  const handleEditIEPClick = () => {
    setOriginalStudentProfile(studentProfile);
    setEditModeNotices(true);

    if (!studentProfile.contentAreaNotices) {
      setStudentProfile((prevProfile) => ({
        ...prevProfile,
        contentAreaNotices: [],
      }));
    }

    if (!studentProfile.learningChallenges) {
      setStudentProfile((prevProfile) => ({
        ...prevProfile,
        learningChallenges: [],
      }));
    }

    if (!studentProfile.accomodationsAndAssisstiveTech) {
      setStudentProfile((prevProfile) => ({
        ...prevProfile,
        accomodationsAndAssisstiveTech: [],
      }));
    }
  };

  const handleIEPChange = (event, index, field, category) => {
    const updatedItems = [...studentProfile[category]];

    updatedItems[index][field] = event.target.value;

    setStudentProfile({
      ...studentProfile,
      [category]: updatedItems,
    });
  };

  const handleIEPSaveClick = async (category) => {
    try {
      const updatedStudent = {
        ...studentProfile,
        [category]: studentProfile[category] || [],
      };

      const updatedProfile = await updateStudent(
        teacherId,
        classroomId,
        studentId,
        updatedStudent
      );

      setStudentProfile(updatedProfile);
      setEditModeNotices(false);
    } catch (error) {
      setError(`Error saving ${category}`);
      console.error(error);
    }
  };

  const handleIEPDeleteClick = (index, category) => {
    const updatedItems = [...studentProfile[category]];
    updatedItems.splice(index, 1);

    setStudentProfile({
      ...studentProfile,
      [category]: updatedItems,
    });
  };

  const handleIEPAddClick = (category) => {
    const newItem = getNewItemForCategory(category);

    setStudentProfile((prevProfile) => ({
      ...prevProfile,
      [category]: [...prevProfile[category], newItem],
    }));
  };

  const getNewItemForCategory = (category) => {
    switch (category) {
      case "contentAreaNotices":
        return {
          contentArea: "",
          benchmark: "",
        };
      case "learningChallenges":
        return {
          challenge: "",
          date: formatDate(new Date()),
        };
      case "accomodationsAndAssisstiveTech":
        return {
          accomodation: "",
          frequency: "",
          location: "",
        };
      default:
        return {};
    }
  };

  const handleFileUpload = (file) => {
    setStudentProfile({
      ...studentProfile,
      avatarImg: file.base64,
    });
  };

  // not working yet
  //    const handleIEPCancelClick = () => {
  //     setStudentProfile(originalStudentProfile);
  //     seteditModeNotices(false);
  //   };

  return (
    <>
      <div className="flex flex-col items-center bg-notebookPaper min-h-screen">
        <div className="flex flex-col items-center pb-[4rem] lg:z-40 ">
          <div className="flex items-center h-72">
            <div className="pt-[1.5rem]">
              <div className="flex flex-row w-full mb-5 ml-3">
                <Link
                  className="text-header1 font-header1"
                  to={`/viewclasslist/${teacherId}/${classroomId}`}
                >
                  &lt;
                </Link>
                <div className="text-center w-full">
                  {editMode ? (
                    <input
                      type="text"
                      name="firstName"
                      value={studentProfile.firstName}
                      onChange={handleInputChange}
                      className="w-1/4 py-2 px-2 mx-3 rounded-md bg-sandwich"
                    />
                  ) : (
                    <span className="text-header1 font-header1 px-2">
                      {studentProfile?.firstName}
                    </span>
                  )}
                  {editMode ? (
                    <input
                      type="text"
                      name="lastName"
                      value={studentProfile.lastName}
                      onChange={handleInputChange}
                      className="w-1/4 py-2 px-2 rounded-md bg-sandwich"
                    />
                  ) : (
                    <span className="text-header1 font-header1">
                      {studentProfile?.lastName}
                    </span>
                  )}
                </div>
              </div>

              {/* Image + Student Info Container + Button */}
              <div className="flex flex-row justify-center">
                {/* Image */}
                <div className="mr-5 w-1/4">
                  <div
                    className={`w-32 rounded-md mr-4 border-8 border-${borderColorClass.borderColorClass}`}
                  >
                    <img
                      src={
                        studentProfile?.avatarImg === "none"
                          ? youngStudent
                          : studentProfile?.avatarImg
                      }
                      alt="student"
                      className="rounded-md object-fill w-32"
                    />
                  </div>
                  {editMode ? (
                    <div className="inline-flex text-[12px] mt-2 font-header1 underline">
                      <FileBase
                        type="file"
                        multiple={false}
                        onDone={({ base64 }) => handleFileUpload({ base64 })}
                      />
                    </div>
                  ) : null}
                </div>

                {/* Student Info Container */}
                <div className="flex flex-col w-52 ml-3">
                  <p>Age: {calculateAge(studentProfile?.birthday)}</p>
                  {editMode ? (
                    <div>
                      <label>Grade: </label>
                      <input
                        type="text"
                        name="gradeYear"
                        value={studentProfile.gradeYear}
                        onChange={handleInputChange}
                        className="rounded-md bg-sandwich w-8/12 px-2 my-1"
                      />
                    </div>
                  ) : (
                    <p>
                      Grade: <span>{studentProfile?.gradeYear}th</span>
                    </p>
                  )}
                  {editMode ? (
                    <div>
                      <label>Student ID: </label>
                      <input
                        type="text"
                        name="schoolStudentId"
                        value={studentProfile.schoolStudentId}
                        onChange={handleInputChange}
                        className="rounded-md bg-sandwich w-7/12 px-2 my-1"
                      />
                    </div>
                  ) : (
                    <p>
                      Student ID: <span>{studentProfile?.schoolStudentId}</span>
                    </p>
                  )}
                  {editMode ? (
                    <div>
                      <label>Birthday: </label>
                      <input
                        type="text"
                        name="birthday"
                        value={studentProfile.birthday}
                        onChange={handleInputChange}
                        className="rounded-md bg-sandwich w-8/12 px-2 my-1"
                      />
                    </div>
                  ) : (
                    <p>
                      Birthday: <span>{studentProfile?.birthday}</span>
                    </p>
                  )}
                  {editMode ? (
                    <div>
                      <label>IEP: </label>
                      <select
                        value={studentProfile.iepStatus}
                        onChange={(e) =>
                          setStudentProfile({
                            ...studentProfile,
                            iepStatus: e.target.value,
                          })
                        }
                        className="rounded-md bg-sandwich px-2 my-1"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  ) : (
                    <p>
                      IEP: <span>{studentProfile?.iepStatus}</span>
                    </p>
                  )}
                </div>

                {/* Button container */}
                <div className="flex items-center border-l-4 border-sandwich pl-5">
                  {editMode ? (
                    <div className="flex flex-col">
                      <button
                        className="mt-2 px-4 py-2 bg-lightCyan border-lightBlue border-2 rounded-md"
                        onClick={handleSaveClick}
                      >
                        Save
                      </button>
                      <button
                        className="mt-2 px-4 py-2 border-2 border-[#ff9a9a] rounded-md"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="items-center justify-between rounded-md flex flex-row py-2 px-3 bg-lightOrange"
                        onClick={handleEditClick}
                      >
                        Edit
                        <img
                          className="pl-2 h-4"
                          src={editIcon}
                          alt="edit icon"
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="">
            {studentProfile && (
              <div className="bg-white mt-10 rounded-2xl border-sandwich border-8 w-[530px]">
                {/* Calendar View Container */}

                {/* REACT CALENDAR - MONTH VIEW */}
                {isMonthView && (
                  <Calendar
                    className="react-calendar"
                    tileClassName={({ date }) => {
                      const event = events.find(
                        (event) =>
                          event.date.toDateString() === date.toDateString()
                      );
                      if (event) {
                        return `${event.className} `;
                      }
                      return "";
                    }}
                    onClickDay={isMonthView ? handleDateClick : null}
                  />
                )}
                {/* REACT CALENDAR - WEEK VIEW */}

                {!isMonthView && (
                  <div
                    className={`${openStudentInfoModal ? "flex z-20" : ""} `}
                  >
                    <WeekView
                      events={events}
                      handleDateClick={handleDateClick}
                      isMonthView={isMonthView}
                    />
                  </div>
                )}

                <div className="flex justify-around py-3 rounded-b-2xl ">
                  <button
                    className={`${
                      !isMonthView ? "bg-sandwich underline font-semibold" : ""
                    } border-2 border-sandwich rounded-lg py-3 px-16`}
                    onClick={() => setIsMonthView(false)}
                  >
                    <h4 className="font-[Poppins]">Week View</h4>
                  </button>
                  <button
                    className={`${
                      isMonthView ? "bg-sandwich underline font-semibold " : ""
                    }bg-notebook border-2 border-sandwich rounded-lg py-3 px-16`}
                    onClick={() => setIsMonthView(true)}
                  >
                    <h4 className="font-[Poppins]">Month View</h4>
                  </button>
                </div>
              </div>
            )}
            {/* Selected Day Student Info Modal */}
            {openStudentInfoModal && (
              <div
                className={`absolute bg-sandwich rounded-2xl bg-opacity-70 ${
                  isMonthView
                    ? "top-72 mt-12 h-96 w-[530px]"
                    : "top-72 mt-12 h-[245px] w-[530px]"
                }`}
              >
                <div className={`flex h-full justify-center items-center`}>
                  <StudentProfileBoxInfo
                    student={studentProfile}
                    selectedEntry={lastSelectedCheck}
                    setOpenStudentInfoModal={setOpenStudentInfoModal}
                  />
                </div>
              </div>
            )}
            <div>
              {/* {selectedDate && (
                <div className="my-4 p-4 border-8 border-sandwich rounded-2xl ">
                  <h4>
                    <strong>
                      Journal Entries for {selectedDate.toDateString()}:
                    </strong>
                  </h4>
                  {selectedEntries.length > 0 ? (
                    selectedEntries.map((entry) => (
                      <div key={entry._id}>
                        <p>
                          Zone of Regulation:{" "}
                          {entry.checkin?.ZOR || entry.checkout?.ZOR}
                        </p>
                        <p>
                          Feelings:{" "}
                          {entry.checkin?.emotion || entry.checkout?.emotion}
                        </p>
                        <p>
                          Needs: {entry.checkin?.need || entry.checkout?.need}
                        </p>
                        <p>
                          Goal: {entry.checkin?.goal || entry.checkout?.goal}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No journal entries for this date.</p>
                  )}
                </div>
              )} */}
            </div>
          </div>
          <div className="mb-20 mt-10 max-w-2xl">
            <div className="flex mt-6 mb-2 items-center w-full justify-between">
              <h1 className="text-black text-4xl font-bold font-header1">
                Individual Education Program (IEP)
              </h1>
              {editModeNotices ? (
                <div className="flex px-2 ">
                  <button
                    className="px-3 py-2 bg-lightCyan border-lightBlue border-2 rounded-md"
                    onClick={handleIEPSaveClick}
                  >
                    Save IEP
                  </button>
                  {/* <button onClick={handleIEPCancelClick}>Cancel</button> */}
                </div>
              ) : (
                <div className="flex px-2 ">
                  <button
                    className="flex flex-row items-center px-3 py-2 bg-lightOrange rounded-md"
                    onClick={handleEditIEPClick}
                  >
                    Edit IEP
                    <img className="pl-2 h-4" src={editIcon} alt="edit icon" />
                  </button>
                </div>
              )}
            </div>
            <div className="border-4 bg-sandwich border-sandwich rounded-2xl w-[530px]">
              <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4 ">
                <h3 className="font-header4">Content Area Notices</h3>
                <h3 className="underline flex justify-end pb-2">
                  Learning Benchmark
                </h3>
                {editModeNotices
                  ? studentProfile?.contentAreaNotices.map(
                      (iepEntry, index) => (
                        <div key={index} className="flex justify-end -mr-3">
                          <input
                            type="text"
                            value={iepEntry.contentArea}
                            onChange={(event) =>
                              handleIEPChange(
                                event,
                                index,
                                "contentArea",
                                "contentAreaNotices"
                              )
                            }
                            className="mr-20 pl-2 rounded-md bg-sandwich"
                          />
                          <input
                            type="text"
                            value={iepEntry.benchmark}
                            onChange={(event) =>
                              handleIEPChange(
                                event,
                                index,
                                "benchmark",
                                "contentAreaNotices"
                              )
                            }
                            className="ml-10 pl-2 w-1/3 rounded-md bg-sandwich"
                          />
                          {editModeNotices ? (
                            <button
                              className="ml-1"
                              onClick={() =>
                                handleIEPDeleteClick(
                                  index,
                                  "contentAreaNotices"
                                )
                              }
                            >
                              <img
                                src={xButton}
                                alt="xButton"
                                className="w-4"
                              />
                            </button>
                          ) : null}
                        </div>
                      )
                    )
                  : studentProfile?.contentAreaNotices.map(
                      (iepEntry, index) => (
                        <div
                          key={index}
                          className="flex justify-between font-body"
                        >
                          <p> {iepEntry.contentArea}</p>
                          <p> {iepEntry.benchmark}</p>
                        </div>
                      )
                    )}
                {((editModeNotices &&
                  studentProfile?.contentAreaNotices.length === 0) ||
                  editModeNotices) && (
                  <button
                    className="mt-2"
                    onClick={() => handleIEPAddClick("contentAreaNotices")}
                  >
                    Add
                  </button>
                )}
              </div>
              <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4">
                <h3 className="font-header4">Learning Challenges</h3>
                <p className="underline flex justify-end pb-2">Diagnosed</p>
                {editModeNotices
                  ? studentProfile?.learningChallenges.map(
                      (iepEntry, index) => (
                        <div key={index} className="flex justify-end -mr-3">
                          <input
                            type="text"
                            value={iepEntry.challenge}
                            onChange={(event) =>
                              handleIEPChange(
                                event,
                                index,
                                "challenge",
                                "learningChallenges"
                              )
                            }
                            className="mr-14 pl-2 rounded-md bg-sandwich "
                          />
                          <input
                            type="text"
                            defaultValue={formatDate(iepEntry.date)}
                            onChange={(event) =>
                              handleIEPChange(
                                event,
                                index,
                                "date",
                                "learningChallenges"
                              )
                            }
                            className="ml-24 pl-4 w-1/4 rounded-md bg-sandwich"
                          />
                          {editModeNotices ? (
                            <button
                              className="ml-1"
                              onClick={() =>
                                handleIEPDeleteClick(
                                  index,
                                  "learningChallenges"
                                )
                              }
                            >
                              <img
                                src={xButton}
                                alt="xButton"
                                className="w-4"
                              />
                            </button>
                          ) : null}
                        </div>
                      )
                    )
                  : studentProfile?.learningChallenges.map(
                      (iepEntry, index) => (
                        <div
                          key={index}
                          className="flex justify-between font-body"
                        >
                          <p>{iepEntry.challenge}</p>
                          <p>{formatDate(iepEntry.date)}</p>
                        </div>
                      )
                    )}
                {((editModeNotices &&
                  studentProfile?.learningChallenges.length === 0) ||
                  editModeNotices) && (
                  <button
                    className="mt-2"
                    onClick={() => handleIEPAddClick("learningChallenges")}
                  >
                    Add
                  </button>
                )}
              </div>
              <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4">
                <h3 className="font-header4">
                  Accommodations & Assistive Tech
                </h3>
                <div className="flex flex-row gap-4 justify-end pb-2">
                  <h3 className="underline">Frequency</h3>
                  <h3 className="underline">Location</h3>
                </div>
                {editModeNotices
                  ? studentProfile?.accomodationsAndAssisstiveTech.map(
                      (iepEntry, index) => (
                        <div key={index} className="flex flex-row justify-end ">
                          <div className="mr-24">
                            <input
                              type="text"
                              value={iepEntry.accomodation}
                              onChange={(event) =>
                                handleIEPChange(
                                  event,
                                  index,
                                  "accomodation",
                                  "accomodationsAndAssisstiveTech"
                                )
                              }
                              className="pl-2 -ml-4 rounded-md bg-sandwich"
                            />
                          </div>
                          <div className="inline px-1">
                            <select
                              value={iepEntry.frequency}
                              onChange={(event) =>
                                handleIEPChange(
                                  event,
                                  index,
                                  "frequency",
                                  "accomodationsAndAssisstiveTech"
                                )
                              }
                              className="rounded-md bg-sandwich w-20"
                            >
                              <option value=""></option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="As Needed">As Needed</option>
                            </select>
                          </div>
                          <div className="flex flex-row justify-end ">
                            <input
                              type="text"
                              value={iepEntry.location}
                              onChange={(event) =>
                                handleIEPChange(
                                  event,
                                  index,
                                  "location",
                                  "accomodationsAndAssisstiveTech"
                                )
                              }
                              className="inline pl-1 w-20 rounded-md bg-sandwich"
                            />
                            {editModeNotices ? (
                              <button
                                className="-mr-2"
                                onClick={() =>
                                  handleIEPDeleteClick(
                                    index,
                                    "accomodationsAndAssisstiveTech"
                                  )
                                }
                              >
                                <img
                                  src={xButton}
                                  alt="xButton"
                                  className="w-4 ml-1 "
                                />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      )
                    )
                  : studentProfile?.accomodationsAndAssisstiveTech.map(
                      (iepEntry, index) => (
                        <div
                          key={index}
                          className="flex justify-between font-body"
                        >
                          <p> {iepEntry.accomodation}</p>
                          <p className="ml-28"> {iepEntry.frequency}</p>
                          <p> {iepEntry.location}</p>
                        </div>
                      )
                    )}
                {((editModeNotices &&
                  studentProfile?.accomodationsAndAssisstiveTech.length ===
                    0) ||
                  editModeNotices) && (
                  <button
                    className="mt-2"
                    onClick={() =>
                      handleIEPAddClick("accomodationsAndAssisstiveTech")
                    }
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
         {/* <div className="fixed bottom-0 w-screen">
      <TeacherNavbar />
    </div> */}
    <div className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
          <Nav  teacherId={teacherId} classroomId={classroomId}/>
        </div>
      </div>
    </>
  );
}

export default withAuth(['teacher'])(StudentProfile)