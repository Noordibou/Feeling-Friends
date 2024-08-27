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
import Logout from "../../../components/LogoutButton.jsx";
import { useUser } from "../../../context/UserContext";
import SmallSaveButton from "../../../components/SmallSaveButton";
import Button from "../../../components/Button";

const { calculateAge, formatDate } = require("../../../utils/dateFormat");

const StudentProfile = () => {
  const { teacherId, classroomId, studentId } = useParams();
  const [studentProfile, setStudentProfile] = useState(null);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [originalStudentProfile, setOriginalStudentProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editModeNotices, setEditModeNotices] = useState(false);

  const [isMonthView, setIsMonthView] = useState(true);
  const [lastSelectedCheck, setLastSelectedCheck] = useState({});
  const [openStudentInfoModal, setOpenStudentInfoModal] = useState(false);
  const [borderColorClass, setBorderColorClass] = useState("");

  const { userData } = useUser();

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

  // TODO: Add IEP save here too. 
  const handleSaveClick = async (e) => {
    e.preventDefault()
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

    try {
      const updatedStudent = {
        ...studentProfile,
        // Ensure all IEP-related categories are included
        contentAreaNotices: studentProfile.contentAreaNotices || [],
        learningChallenges: studentProfile.learningChallenges || [],
        accomodationsAndAssisstiveTech: studentProfile.accomodationsAndAssisstiveTech || [],
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
      setError("An error occurred while saving IEP data.");
      console.error(error);
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault()
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

  // TODO: merge with handleSaveClick
  // const handleIEPSaveClick = async (category, e) => {
  //   e.preventDefault()
  //   try {
  //     const updatedStudent = {
  //       ...studentProfile,
  //       [category]: studentProfile[category] || [],
  //     };

  //     const updatedProfile = await updateStudent(
  //       teacherId,
  //       classroomId,
  //       studentId,
  //       updatedStudent
  //     );

  //     setStudentProfile(updatedProfile);
  //     setEditModeNotices(false);
  //   } catch (error) {
  //     setError(`Error saving ${category}`);
  //     console.error(error);
  //   }
  // };

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

  return (
    <>
      {/* Page conatainer including bottom nav */}
      <div className="flex flex-col  bg-notebookPaper min-h-screen">
        <div className="hidden md:flex justify-center lg:justify-end underline mt-4 px-2 md:px-5 ">
          <Logout location="teacherLogout" userData={userData} />
        </div>
        {/* Page container (no nav) */}
        <form onSubmit={handleSaveClick}>
        <div className="flex flex-col items-center pb-[4rem] mt-5 md:mt-10">
          {/* top student section */}
          <div className="flex w-full">
            <div className="w-full flex flex-col justify-center">
              <div className="flex self-center flex-row w-full max-w-lg mb-5">
                <Link
                  className="md:text-header1 text-[33px] font-header1"
                  to={`/viewclasslist/${teacherId}/${classroomId}`}
                >
                  <svg
                    className={``}
                    width="70"
                    height="70"
                    viewBox="25 0 1 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="10"
                      y1="50"
                      x2="32"
                      y2="35"
                      stroke="#8D8772"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />

                    <line
                      x1="10"
                      y1="50"
                      x2="32"
                      y2="65"
                      stroke="#8D8772"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
                <div className="">
                  {/* First & Last Name */}
                  <fieldset>
                    {editMode ? (
                      <input
                        type="text"
                        name="firstName"
                        value={studentProfile.firstName}
                        onChange={handleInputChange}
                        className="w-4/12 md:w-1/4 py-2 px-2 mx-3 text-[20px] rounded-md bg-sandwich"
                      />
                    ) : (
                      <span className="md:text-header1 text-[33px] font-header1 px-2">
                        {studentProfile?.firstName}
                      </span>
                    )}
                    {editMode ? (
                      <input
                        type="text"
                        name="lastName"
                        value={studentProfile.lastName}
                        onChange={handleInputChange}
                        className="w-4/12 md:w-1/4 py-2 px-2 text-[20px] rounded-md bg-sandwich"
                      />
                    ) : (
                      <span className="md:text-header1 text-[33px] font-header1">
                        {studentProfile?.lastName}
                      </span>
                    )}
                  </fieldset>
                </div>
              </div>

              {/* Image + Student Info Container + Button */}
              <div>
                {/* Field set section for student info */}
                <fieldset className="flex flex-col md:flex-row items-center justify-center">
                  {/* Image */}
                  <div className="flex flex-col items-center md:self-left md:mr-5">
                    <div
                      className={`flex items-center justify-center w-32 rounded-md mr-4 border-8 border-${borderColorClass.borderColorClass}`}
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
                      <div className="inline-flex text-[12px] self-right mt-2 font-header1 underline w-36 truncate">
                        <FileBase
                          type="file"
                          multiple={false}
                          onDone={({ base64 }) => handleFileUpload({ base64 })}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex justify-center my-5 md:my-0">
                    {/* Student Info Container */}
                    <div className="flex flex-col w-44 md:w-52 ml-3 text-[14px] md:text-[16px]">
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
                          Grade: <span>{studentProfile?.gradeYear}</span>
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
                          Student ID:{" "}
                          <span>{studentProfile?.schoolStudentId}</span>
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
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          {/* TODO: Delete these buttons */}
          {/* Button container */}
          <div className="sm:mt-4 flex items-center text-[14px] md:text-[15px] w-[300px] xs:w-[350px] sm:w-[420px] md:w-full max-w-xs sm:max-w-md md:max-w-lg justify-center">
            {editMode ? (
              <div className="flex gap-4">
                <button
                  type="button"
                  className="px-4 py-2 border-2 border-[#ff9a9a] rounded-md"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="mt-16 sm:mt-8 w-full flex items-center justify-center border-2 rounded-xl border-sandwich">
                <button
                  type="button"
                  className="items-center justify-between rounded-md flex flex-row py-2 px-3 font-[Poppins]"
                  onClick={handleEditClick}
                >
                  edit student info
                  <img className="pl-2 h-4" src={editIcon} alt="edit icon" />
                </button>
              </div>
            )}
          </div>

          <div className="">
            {studentProfile && (
              <div className="mt-10 rounded-2xl border-sandwich border-8 w-[300px] xs:w-[350px] sm:w-[420px] md:w-[530px]">
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
                    className={`week-view ${
                      openStudentInfoModal
                        ? "flex z-20 "
                        : " w-[300px] xs:w-[350px] sm:w-[420px] md:w-[530px]"
                    } `}
                  >
                    <WeekView
                      events={events}
                      handleDateClick={handleDateClick}
                      isMonthView={isMonthView}
                    />
                  </div>
                )}

                <div className="flex px-3 text-[14px] md:text-[15px] gap-3 md:gap-0 flex-row justify-around py-3 rounded-b-2xl items-center bg-notebookPaper">
                  <button
                    className={`${
                      !isMonthView ? "bg-sandwich font-semibold" : ""
                    } border-2 border-sandwich rounded-3xl py-1 w-44 text-center`}
                    onClick={() => setIsMonthView(false)}
                  >
                    <h4 className="font-[Poppins]">Week View</h4>
                  </button>
                  <button
                    className={`${
                      isMonthView ? "bg-sandwich font-semibold " : ""
                    }bg-notebook border-2 border-sandwich rounded-3xl py-1 w-44 text-center`}
                    onClick={() => setIsMonthView(true)}
                  >
                    <h4 className="font-[Poppins]">Month View</h4>
                  </button>
                </div>
              </div>
            )}
            {/* Selected Day Student Info Modal Overlay*/}
            {openStudentInfoModal && (
              <div
                className={`absolute bg-sandwich rounded-2xl bg-opacity-70 top-96 md:top-80 mt-[150px] sm:mt-[130px] md:mt-[120px] my-2 h-[368px] w-[300px] xs:w-[350px] sm:w-[420px] md:w-[530px]`}
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
          </div>
          <div className="mb-20 mt-6 max-w-2xl">
            <div className="flex flex-col gap-4 md:gap-0 mt-6 mb-2 items-center w-full justify-between ">
              <h1 className="text-black text-sm sm:text-md font-bold font-header1">
                Individual Education Program (IEP)
              </h1>
              {/* TODO: delete this save button */}
              {editModeNotices ? (
                <div className="flex px-2 my-2 w-full">
                  <button
                  type="button"
                  className="px-4 py-2 border-2 border-[#ff9a9a] rounded-md"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
                </div>
              ) : (
                <div className="flex my-2 px-2 w-full">
                  <button
                    type="button"
                    className="flex flex-row w-full justify-center items-center text-[14px] md:text-[16px] px-3 py-2 border-2 border-sandwich rounded-2xl font-[Poppins]"
                    onClick={handleEditIEPClick}
                  >
                    edit IEP
                    <img className="pl-2 h-4" src={editIcon} alt="edit icon" />
                  </button>
                </div>
              )}
            </div>

            <fieldset>
            <div className="border-4 bg-sandwich border-sandwich rounded-2xl w-[300px] xs:w-[350px] sm:w-[420px] md:w-[530px] mx-auto">
              <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-2 sm:px-4 py-4 ">
                <h3 className="font-header4">Content Area Notices</h3>
                <h3 className="underline flex justify-end pb-2 text-[14px] md:text-[15px]">
                  Learning Benchmark
                </h3>
                {editModeNotices
                  ? studentProfile?.contentAreaNotices.map(
                      (iepEntry, index) => (
                        <div
                          key={index}
                          className="flex w-full justify-between xs:-mr-3"
                        >
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
                            className="w-full flex rounded-md bg-sandwich text-[14px] md:text-[16px]"
                          />

                          <div className="w-full flex justify-end ">
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
                              className="w-[80px] rounded-md bg-sandwich text-[14px] md:text-[16px]"
                            />
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
                          </div>
                        </div>
                      )
                    )
                  : studentProfile?.contentAreaNotices.map(
                      (iepEntry, index) => (
                        <div
                          key={index}
                          className="flex justify-between font-body text-[14px] md:text-[16px]"
                        >
                          <p className="w-7/12"> {iepEntry.contentArea}</p>
                          <p> {iepEntry.benchmark}</p>
                        </div>
                      )
                    )}
                {((editModeNotices &&
                  studentProfile?.contentAreaNotices.length === 0) ||
                  editModeNotices) && (
                  <button
                    type="button"
                    className="mt-2"
                    onClick={() => handleIEPAddClick("contentAreaNotices")}
                  >
                    Add
                  </button>
                )}
              </div>
              <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-2 sm:px-4 py-4">
                <h3 className="font-header4">Learning Challenges</h3>
                <p className="underline flex justify-end pb-2 text-[14px] md:text-[16px]">
                  Diagnosed
                </p>
                {editModeNotices
                  ? studentProfile?.learningChallenges.map(
                      (iepEntry, index) => (
                        <div key={index} className="flex justify-end">
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
                            className="w-full flex rounded-md bg-sandwich text-[14px] md:text-[16px] "
                          />
                          <div className="w-full flex justify-end ">
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
                              className="w-1/2 md:w-1/4 rounded-md bg-sandwich text-[14px] md:text-[16px]"
                            />

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
                          </div>
                        </div>
                      )
                    )
                  : studentProfile?.learningChallenges.map(
                      (iepEntry, index) => (
                        <div
                          key={index}
                          className="flex justify-between font-body text-[14px] md:text-[16px]"
                        >
                          <p className="w-7/12">{iepEntry.challenge}</p>
                          <p>{formatDate(iepEntry.date)}</p>
                        </div>
                      )
                    )}
                {((editModeNotices &&
                  studentProfile?.learningChallenges.length === 0) ||
                  editModeNotices) && (
                  <button
                    type="button"
                    className="mt-2"
                    onClick={() => handleIEPAddClick("learningChallenges")}
                  >
                    Add
                  </button>
                )}
              </div>
              <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-2 sm:px-4 py-4">
                <h3 className="font-header4">
                  Accommodations & Assistive Tech
                </h3>
                <div className="grid grid-cols-4 gap-1 md:gap-4 pb-2">
                  <div className="col-span-1"></div>
                  <div className="col-span-1"></div>
                  <h3 className="underline col-span-1 text-[14px] md:text-[16px] text-right">
                    Frequency
                  </h3>
                  <h3 className="underline col-span-1 text-[14px] md:text-[16px] text-right">
                    Location
                  </h3>
                </div>
                {editModeNotices
                  ? studentProfile?.accomodationsAndAssisstiveTech.map(
                      (iepEntry, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-4 gap-1 sm:gap-4 items-center"
                        >
                          {/* accomodation list */}
                          <div className="ml-5">
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
                              className="w-[280%] xs:w-[220%] sm:w-[250%] flex pl-2 -ml-4 rounded-md text-[14px] md:text-[17px] bg-sandwich col-span-1"
                            />
                          </div>
                          <div></div>
                          {/* frequency */}
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
                              className="rounded-md bg-sandwich text-[14px] md:text-[17px] w-full col-span-1"
                            >
                              <option value=""></option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="As Needed">As Needed</option>
                            </select>
                          </div>

                          {/* location */}
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
                              className="inline pl-1 w-full text-[14px] md:text-[17px] rounded-md bg-sandwich"
                            />
                            <button
                              className=""
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
                          </div>
                        </div>
                      )
                    )
                  : studentProfile?.accomodationsAndAssisstiveTech.map(
                      (iepEntry, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-4 text-[14px] md:text-[16px] font-body my-3"
                        >
                          <p className="w-[200%]"> {iepEntry.accomodation}</p>
                          <p></p>
                          <p className="text-right"> {iepEntry.frequency}</p>
                          <p className="text-right"> {iepEntry.location}</p>
                        </div>
                      )
                    )}
                {((editModeNotices &&
                  studentProfile?.accomodationsAndAssisstiveTech.length ===
                    0) ||
                  editModeNotices) && (
                  <button
                    type="button"
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
            </fieldset>
          </div>
        </div>
        <div className="lg:hidden flex justify-center">
          <button
            className="lg:hidden fixed bottom-36 flex "
            type="submit"
          >
            <Button buttonText="Save" />
          </button>
        </div>
        <button
            className="hidden lg:fixed lg:bottom-36 lg:right-10 lg:flex "
            type="submit"
          >
            <SmallSaveButton />
          </button>
        </form>
        <div className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
          <Nav teacherId={teacherId} classroomId={classroomId} />
        </div>
      </div>
    </>
  );
};

export default withAuth(["teacher"])(StudentProfile);
