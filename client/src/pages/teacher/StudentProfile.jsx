import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentProfile, updateStudent } from "../../api/teachersApi";
import { getBackgroundColorClass } from "../../components/classRoomColors";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import youngStudent from "../../images/young-student.png";
import "./StudentProfile.css";
import xButton from '../../images/x-button.png';
const { calculateAge, formatDate } = require("../../components/dateFormat");
const axios = require("axios");

export default function StudentProfile() {
  const { teacherId, classroomId, studentId } = useParams();
  const [studentProfile, setStudentProfile] = useState(null);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [originalStudentProfile, setOriginalStudentProfile] = useState(null);
  const [editModeIEP, setEditModeIEP] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editModeNotices, setEditModeNotices] = useState(false);


  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const profile = await getStudentProfile(
          teacherId,
          classroomId,
          studentId
        );
        setStudentProfile(profile);

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
  }, [teacherId, classroomId, studentId]);

  const handleDateClick = (date) => {
    setSelectedDate(date);

    const selectedEntries = studentProfile.journalEntries.filter(
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    );
    setSelectedEntries(selectedEntries);
  };

  const handleEditClick = () => {
    setOriginalStudentProfile(studentProfile);
    setEditMode(true);
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudentProfile({
      ...studentProfile,
      [name]: value,
    });
  };

  const handleCancelClick = () => {
    setStudentProfile(originalStudentProfile);
    setEditMode(false);
    setEditModeIEP(false);
  };

  const handleEditNoticesClick = () => {
    setOriginalStudentProfile(studentProfile);
    setEditModeNotices(!editModeNotices);
  
    if (!studentProfile.contentAreaNotices || studentProfile.contentAreaNotices.length === 0) {
      setStudentProfile(prevProfile => ({
        ...prevProfile,
        contentAreaNotices: [
          {
            contentArea: '',
            benchmark: ''
          }
        ]
      }));
    }
  };
  
  const handleNoticesChange = (event, index, field) => {
    const updatedNotices = [...studentProfile.contentAreaNotices];
  
    updatedNotices[index][field] = event.target.value;
  
    setStudentProfile({
      ...studentProfile,
      contentAreaNotices: updatedNotices
    });
  };
  
  
  const handleNoticesSaveClick = async () => {

    try {
  
      const updatedStudent = {
        ...studentProfile,
        contentAreaNotices: studentProfile.contentAreaNotices  
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
      setError('Error saving notices');
      console.error(error);
    }
  
  };
  
  
  const handleNoticesDeleteClick = index => {
    const updatedNotices = [...studentProfile.contentAreaNotices];
    updatedNotices.splice(index, 1);
    
    setStudentProfile({
      ...studentProfile,
      contentAreaNotices: updatedNotices  
    });
  };

  // not working yet
  //    const handleIEPCancelClick = () => {
  //     setStudentProfile(originalStudentProfile);
  //     setEditModeIEP(false);
  //   };

  return (
    <div className="flex flex-col items-center bg-notebookPaper h-full">
      <div>
        <div className="flex items-center">
          <div
            className={`w-32 rounded-md mr-4 border-8 border-${getBackgroundColorClass(
              studentProfile?.journalEntries[
                studentProfile?.journalEntries.length - 1
              ]?.checkout?.ZOR ||
                studentProfile?.journalEntries[
                  studentProfile?.journalEntries.length - 1
                ]?.checkin?.ZOR
            )}`}
          >
            {studentProfile && <img src={youngStudent} alt="Student Avatar" />}
          </div>
          <div>
            <h2 className="pt-[4rem]">
              <div className="flex flex-row ">
                <Link
                  className="text-header1 font-header1"
                  to={`/viewclasslist/${teacherId}/${classroomId}`}
                >
                  &lt;
                </Link>
                {editMode ? (
                  <input
                    type="text"
                    name="firstName"
                    value={studentProfile.firstName}
                    onChange={handleInputChange}
                    className="w-1/4 px-2 mx-3 rounded-md bg-sandwich"
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
                    className="w-1/4 px-2 rounded-md bg-sandwich"
                  />
                ) : (
                  <span className="text-header1 font-header1">
                    {studentProfile?.lastName}
                  </span>
                )}
              </div>
            </h2>

            <p>Age: {calculateAge(studentProfile?.birthday)}</p>
            {editMode ? (
              <div>
                <label>Grade: </label>
                <input
                  type="text"
                  name="gradeYear"
                  value={studentProfile.gradeYear}
                  onChange={handleInputChange}
                  className="rounded-md bg-sandwich w-1/3 px-2"
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
                  className="rounded-md bg-sandwich w-1/3 px-2"
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
                  className="rounded-md bg-sandwich w-1/3 px-2"
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
                  onChange={handleInputChange}
                  className="rounded-md bg-sandwich px-2"
                >
                  <option value="Yes">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            ) : (
              <p>
                IEP: <span>{studentProfile?.iepStatus}</span>
              </p>
            )}
            {editMode ? (
              <div>
                <button className="mt-2 underline" onClick={handleSaveClick}>
                  Save
                </button>
                <button
                  className="mt-2 ml-2 underline"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <button className="mt-2 underline" onClick={handleEditClick}>
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="">
          {studentProfile && (
            <div className=" mt-12 rounded-2xl ">
              <Calendar
                className="react-calendar"
                tileClassName={({ date }) => {
                  const event = events.find(
                    (event) => event.date.toDateString() === date.toDateString()
                  );
                  if (event) {
                    return `${event.className} `;
                  }
                  return "";
                }}
                onClickDay={handleDateClick}
              />
            </div>
          )}
          <div>
            {selectedDate && (
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
                      <p>Goal: {entry.checkin?.goal || entry.checkout?.goal}</p>
                    </div>
                  ))
                ) : (
                  <p>No journal entries for this date.</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mb-20 max-w-lg">
          <div className="mt-6 mb-2">
            <h1 className="text-black text-4xl font-bold font-header1">
              Individual Education Program (IEP)
            </h1>
            {/* {editModeIEP ? (
              <button className="underline" onClick={handleIEPAddClick}>
                Add IEP Entry
              </button>
            ) : null} */}
          </div>
          <div className="border-4 bg-sandwich border-sandwich rounded-2xl ">
            <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4 ">
              <h3 className="font-header4">Content Area Notices</h3>
              <h3 className="underline flex justify-end pb-2">
                Learning Benchmark
              </h3>
              {editModeNotices
                ? studentProfile?.contentAreaNotices.map((iepEntry, index) => (
                    <div key={index} className="flex justify-end -mr-3">
                      <input
                        type="text"
                        value={iepEntry.contentArea}
                        onChange={(event) =>
                          handleNoticesChange(
                            event,
                            index,
                            "contentArea"
                          )
                        }
                        className="mr-20 pl-2 rounded-md bg-sandwich"
                      />
                      <input
                        type="text"
                        value={iepEntry.benchmark}
                        onChange={(event) =>
                          handleNoticesChange(
                            event,
                            index,
                            "benchmark"
                          )
                        }
                        className="ml-10 pl-2 w-1/3 rounded-md bg-sandwich"
                      />
                      {editModeNotices ? (
                        <button
                            className="ml-1"
                          onClick={() =>
                            handleNoticesDeleteClick(
                              index,
                              "contentAreaNotices"
                            )
                          }
                        >
                         <img src={xButton} alt="xButton" className="w-4" />
                        </button>
                      ) : null}
                    </div>
                  ))
                : studentProfile?.contentAreaNotices.map((iepEntry, index) => (
                    <div key={index} className="flex justify-between font-body">
                      <p> {iepEntry.contentArea}</p>
                      <p> {iepEntry.benchmark}</p>
                    </div>
                  ))}
            </div>
            {/* <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4">
              <h3 className="font-header4">Learning Challenges</h3>
              <p className="underline flex justify-end pb-2">Diagnosed</p>
              {editModeIEP
                ? studentProfile?.iep.map((iepEntry, index) => (
                    <div key={index} className="flex justify-end -mr-3">
                      <input
                        type="text"
                        value={iepEntry.learningChallenges.challenge}
                        onChange={(event) =>
                          handleIEPChange(
                            event,
                            index,
                            "learningChallenges",
                            "challenge"
                          )
                        }
                        className="mr-14 pl-2 rounded-md bg-sandwich "
                      />
                      <input
                        type="text"
                        defaultValue={formatDate(
                          iepEntry.learningChallenges.date
                        )}
                        onChange={(event) =>
                          handleIEPChange(
                            event,
                            index,
                            "learningChallenges",
                            "date"
                          )
                        }
                        className="ml-24 pl-4 w-1/4 rounded-md bg-sandwich"
                      />
                      {editModeIEP ? (
                        <button
                            className="ml-1"
                          onClick={() =>
                            handleIEPDeleteClick(
                              index,
                              "learningChallenges"
                            )
                          }
                        >
                         <img src={xButton} alt="xButton" className="w-4" />
                        </button>
                      ) : null}
                    </div>
                  ))
                : studentProfile?.iep.map((iepEntry, index) => (
                    <div key={index} className="flex justify-between font-body">
                      <p>{iepEntry.learningChallenges.challenge}</p>
                      <p>{formatDate(iepEntry.learningChallenges.date)}</p>
                    </div>
                  ))}
            </div>
            <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4">
              <h3 className="font-header4">Accommodations & Assistive Tech</h3>
              <div className="flex flex-row gap-4 justify-end pb-2">
                <h3 className="underline">Frequency</h3>
                <h3 className="underline">Location</h3>
              </div>
              {editModeIEP
                ? studentProfile?.iep.map((iepEntry, index) => (
                    <div key={index} className="flex flex-row justify-end ">
                      <div className="mr-24">
                        <input
                          type="text"
                          value={
                            iepEntry.accomodationsAndAssisstiveTech.accomodation
                          }
                          onChange={(event) =>
                            handleIEPChange(
                              event,
                              index,
                              "accomodationsAndAssisstiveTech",
                              "accomodation"
                            )
                          }
                          className="pl-2 -ml-4 rounded-md bg-sandwich"
                        />
                      </div>
                      <div className="inline px-1">
                        <select
                          value={
                            iepEntry.accomodationsAndAssisstiveTech.frequency
                          }
                          onChange={(event) =>
                            handleIEPChange(
                              event,
                              index,
                              "accomodationsAndAssisstiveTech",
                              "frequency"
                            )
                          }
                          className="rounded-md bg-sandwich w-20"
                        >
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="As Needed">As Needed</option>
                        </select>
                      </div>
                      <div className="flex flex-row justify-end ">
                        <input
                          type="text"
                          value={
                            iepEntry.accomodationsAndAssisstiveTech.location
                          }
                          onChange={(event) =>
                            handleIEPChange(
                              event,
                              index,
                              "accomodationsAndAssisstiveTech",
                              "location"
                            )
                          }
                          className="inline pl-1 w-20 rounded-md bg-sandwich"
                        />
                         {editModeIEP ? (
                        <button
                            className="-mr-3 "
                          onClick={() =>
                            handleIEPDeleteClick(
                              index,
                              "accomodationsAndAssisstiveTech"
                            )
                          }
                        >
                         <img src={xButton} alt="xButton" className="w-4 ml-1 " />
                        </button>
                      ) : null}
                      </div>
                    </div>
                  ))
                : studentProfile?.iep.map((iepEntry, index) => (
                    <div key={index} className="flex justify-between font-body">
                      <p>
                        {" "}
                        {iepEntry.accomodationsAndAssisstiveTech.accomodation}
                      </p>
                      <p className="ml-28">
                        {" "}
                        {iepEntry.accomodationsAndAssisstiveTech.frequency}
                      </p>
                      <p> {iepEntry.accomodationsAndAssisstiveTech.location}</p>
                    </div>
                  ))}
            </div> */}
            {editModeNotices ? (
              <div className="px-2 ">
                <button className="pr-2" onClick={handleNoticesSaveClick}>
                  Save
                </button>
                {/* <button onClick={handleIEPCancelClick}>Cancel</button> */}
              </div>
            ) : (
              <div>
                <button className="underline" onClick={handleEditNoticesClick}>
                  Edit IEP
                </button>
              </div>
            )}
          </div>
          {/* <div className="text-sm font-sm underline">
          <Link to={`/viewclasslist/${teacherId}/${classroomId}`}>
            &lt; Back
          </Link>
        </div> */}
        </div>
      </div>
    </div>
  );
}