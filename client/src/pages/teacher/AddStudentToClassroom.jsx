import { useUser } from "../../context/UserContext";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createNewStudentAndUser } from "../../api/studentsApi";
import Nav from "../../components/Navbar/Nav";
import Logout from "../../components/LogoutButton.jsx";
import withAuth from "../../hoc/withAuth";
import FileBase from "react-file-base64";
import youngStudent from "../../images/young-student.png";
import SimpleTopNav from "../../components/SimpleTopNav.jsx";
import xButton from "../../images/x-button.png";
import Button from "../../components/Button.jsx";
import SmallSaveButton from "../../components/SmallSaveButton.jsx";
import UnsavedChanges from "../../components/TeacherView/UnsavedChanges.jsx";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext.js";
const { calculateAge } = require("../../utils/dateFormat");


const AddStudent = () => {
  const { teacherId, classroomId } = useParams();
  const [studentProfile, setStudentProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    gradeYear: "",
    schoolStudentId: "",
    birthday: "",
    iepStatus: "",
    avatarImg: youngStudent,
    contentAreaNotices: [],
    learningChallenges: [],
    accomodationsAndAssisstiveTech: [],
    notesForStudent: [],
  });
  const navigate = useNavigate();
  const { userData } = useUser();
  const {setHasUnsavedChanges} = useUnsavedChanges();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setStudentProfile({
      ...studentProfile,
      [name]: value,
    });
    setHasUnsavedChanges(true);
  };

  const handleFileUpload = (file) => {
    setStudentProfile({
      ...studentProfile,
      avatarImg: file.base64,
    });
  };

  const handleArrayChange = (arrayName, index, event) => {
    const { name, value } = event.target;
    setStudentProfile((prevProfile) => {
      const updatedArray = prevProfile[arrayName].map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      );
      return {
        ...prevProfile,
        [arrayName]: updatedArray,
      };
    });
    setHasUnsavedChanges(true);
  };

  const addItemToArray = (arrayName, newItem) => {
    setStudentProfile((prevProfile) => ({
      ...prevProfile,
      [arrayName]: [...prevProfile[arrayName], newItem],
    }));
  };

  const removeItemFromArray = (arrayName, index) => {
    const updatedArray = studentProfile[arrayName].filter(
      (item, i) => i !== index
    );
    setStudentProfile({
      ...studentProfile,
      [arrayName]: updatedArray,
    });
  };

  const handleAddStudent = async () => {
    console.log("handle student starting");
    try {
      const requestData = {
        ...studentProfile,
        contentAreaNotices: studentProfile.contentAreaNotices,
        learningChallenges: studentProfile.learningChallenges,
        accomodationsAndAssisstiveTech:
          studentProfile.accomodationsAndAssisstiveTech,
        notesForStudent: studentProfile.notesForStudent,
      };

      await createNewStudentAndUser(requestData);
      setHasUnsavedChanges(false);

      setStudentProfile({
        email: "",
        name: "",
        gradeYear: "",
        schoolStudentId: "",
        birthday: "",
        iepStatus: "No",
        avatarImg: youngStudent,
        contentAreaNotices: [{ contentArea: "", benchmark: "" }],
        learningChallenges: [{ challenge: "", date: "" }],
        accomodationsAndAssisstiveTech: [
          { accomodation: "", location: "", frequency: "" },
        ],
        notesForStudent: [{ note: "", date: "" }],
      });
      
      navigate(`/createclass`);
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col  bg-notebookPaper min-h-screen mb-32 xs:mb-10 md:mb-0 ">
        <div className="hidden md:flex justify-center lg:justify-end underline mt-4 px-2 md:px-5 ">
          <Logout location="teacherLogout" userData={userData} />
        </div>

        <div className="flex w-full justify-center mt-5 md:mt-10">
          <div className="w-full max-w-2xl flex md:justify-start">
            <SimpleTopNav
              pageTitle="Add New Student"
              fontsize="text-[25px] xl:text-[24px]"
            />
          </div>
        </div>

        <form onSubmit={handleAddStudent}>
        <div className="flex flex-col md:flex-row items-center justify-center mt-10">
          {/* Image */}
          <div className="flex flex-col items-center md:self-left">
            <div
              className={`flex items-center justify-center rounded-md mr-4 border-8 border-[pink]`}
            >
              <img
                src={studentProfile.avatarImg}
                alt="student"
                className="rounded-md object-fill w-32"
              />
            </div>

            <div className="inline-flex text-[12px] self-right ml-14 mt-2 font-header1 underline">
              <FileBase
                type="file"
                multiple={false}
                onDone={({ base64 }) => handleFileUpload({ base64 })}
              />
            </div>
          </div>
          <div className="flex justify-center my-5 md:my-0">
            {/* Student Info Container */}
            <div className="flex flex-col w-60 xs:w-80 ml-3 text-[14px] md:text-[16px]">
              <div>
                <label>First Name*: </label>
                <input
                  type="text"
                  name="firstName"
                  value={studentProfile.firstName}
                  onChange={handleInputChange}
                  className="rounded-md bg-sandwich w-8/12 px-2 my-1"
                  required
                />
              </div>
              <div>
                <label>Last Name*: </label>
                <input
                  type="text"
                  name="lastName"
                  value={studentProfile.lastName}
                  onChange={handleInputChange}
                  className="rounded-md bg-sandwich w-8/12 px-2 my-1"
                  required
                />
              </div>
              <div className="flex items-center">
                <label className="w-28">Parent's Email*: </label>
                <input
                  type="text"
                  name="email"
                  value={studentProfile.email}
                  onChange={handleInputChange}
                  className="rounded-md bg-sandwich w-8/12 px-2 my-1"
                  required
                />
              </div>

              <div>
                <label htmlFor="gradeYear">Grade: </label>
                <select
                  name="gradeYear"
                  value={studentProfile.gradeYear}
                  onChange={handleInputChange}
                  className="rounded-md bg-sandwich w-5/12 px-2 my-1"
                >
                  <option value="" disabled>
                    Select Grade
                  </option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="1st Grade">1st Grade</option>
                  <option value="2nd Grade">2nd Grade</option>
                  <option value="3rd Grade">3rd Grade</option>
                  <option value="4th Grade">4th Grade</option>
                  <option value="5th Grade">5th Grade</option>
                  <option value="6th Grade">6th Grade</option>
                  <option value="7th Grade">7th Grade</option>
                  <option value="8th Grade">8th Grade</option>
                  <option value="9th Grade">9th Grade</option>
                  <option value="10th Grade">10th Grade</option>
                  <option value="11th Grade">11th Grade</option>
                  <option value="12th Grade">12th Grade</option>
                </select>
              </div>

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

              <div className="flex">
                <div>
                  <label>Birthday: </label>
                  <input
                    type="date"
                    name="birthday"
                    value={studentProfile.birthday}
                    onChange={handleInputChange}
                    className="rounded-md bg-sandwich w-8/12 px-2 my-1"
                  />
                </div>
                <div className="flex items-center">
                  <p>Age:</p>
                  {studentProfile.birthday && (
                    <p className="pl-1">
                      {calculateAge(studentProfile.birthday)}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label>IEP*: </label>
                <select
                  name="iepStatus"
                  value={studentProfile.iepStatus}
                  onChange={handleInputChange}
                  className="rounded-md bg-sandwich px-2 my-1"
                  required
                >
                  <option value="" disabled></option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* section bar */}
        <div className="flex md:hidden w-[90%] sm:w-[50%] mx-auto border-2 border-sandwich rounded-xl mt-5 mb-10 sm:my-16"></div>

        {/* add iep section */}

        {studentProfile.iepStatus === "Yes" && (
          <div className="flex w-full justify-center mb-32 md:mb-0 mt-10">
            <div className="flex flex-col justify-center">
              <h1 className="text-black text-sm sm:text-md font-bold font-header1 mb-4 max-w-2xl">
                Individual Education Program (IEP)
              </h1>
              <div className="self-center bg-sandwich p-4 rounded-xl flex flex-col w-[19.5rem] xs:w-[25rem] md:w-[35rem] mb-32">
                {/* Content Area Notices */}
                <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-2 sm:px-4 py-4">
                  <h3 className="font-header4">Content Area Notices</h3>
                  <h3 className="underline flex justify-end pb-2 text-[14px] md:text-[15px]">
                    Learning Benchmark
                  </h3>
                  {studentProfile.contentAreaNotices.map((notice, index) => (
                    <div
                      key={index}
                      className="flex w-full justify-between xs:-mr-3 py-2"
                    >
                      <input
                        type="text"
                        name="contentArea"
                        value={notice.contentArea}
                        onChange={(e) =>
                          handleArrayChange("contentAreaNotices", index, e)
                        }
                        placeholder="Content Area"
                        className="w-full flex rounded-md bg-sandwich text-[14px] px-2 md:text-[16px]"
                      />
                      <div className="w-full flex justify-end ">
                        <input
                          type="text"
                          name="benchmark"
                          value={notice.benchmark}
                          onChange={(e) =>
                            handleArrayChange("contentAreaNotices", index, e)
                          }
                          placeholder="Benchmark"
                          className="w-[120px] rounded-md bg-sandwich text-[14px] md:text-[16px] px-2"
                        />
                        <button
                          type="button"
                          aria-label="delete content area notice"
                          onClick={() =>
                            removeItemFromArray("contentAreaNotices", index)
                          }
                        >
                          <img
                            src={xButton}
                            alt="remove"
                            className="w-4 ml-1 "
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                  type="button"
                    onClick={() =>
                      addItemToArray("contentAreaNotices", {
                        contentArea: "",
                        benchmark: "",
                      })
                    }
                    className="w-full border-4 border-graphite rounded-xl py-2 my-4"
                  >
                    Add Content Area Notice +
                  </button>
                </div>

                <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-2 sm:px-4 py-4">
                  <h3 className="font-header4">Learning Challenges</h3>
                  <p className="underline flex justify-end pb-2 text-[14px] md:text-[16px]">
                    Diagnosed
                  </p>
                  {studentProfile.learningChallenges.map((challenge, index) => (
                    <div key={index} className="flex justify-end py-2">
                      <input
                        type="text"
                        name="challenge"
                        value={challenge.challenge}
                        onChange={(e) =>
                          handleArrayChange("learningChallenges", index, e)
                        }
                        placeholder="Challenge"
                        className="w-full flex rounded-md bg-sandwich text-[14px] md:text-[16px] px-2"
                      />
                      <div className="w-full flex justify-end ">
                        <input
                          type="date"
                          name="date"
                          value={challenge.date}
                          onChange={(e) =>
                            handleArrayChange("learningChallenges", index, e)
                          }
                          placeholder="Date"
                          className="w-[130px] rounded-md bg-sandwich text-[14px] md:text-[16px] ml-3 px-2"
                        />
                        <button
                          type="button"
                          aria-label="delete learning challenge"
                          onClick={() =>
                            removeItemFromArray("learningChallenges", index)
                          }
                        >
                          <img
                            src={xButton}
                            alt="remove"
                            className="w-4 ml-1 "
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      addItemToArray("learningChallenges", {
                        challenge: "",
                        date: "",
                      })
                    }
                    className="w-full border-4 border-graphite rounded-xl py-2 my-4"
                  >
                    Add Learning Challenge +
                  </button>
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
                  {studentProfile.accomodationsAndAssisstiveTech.map(
                    (accomodation, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 gap-1 sm:gap-4 items-center py-2"
                      >
                        <input
                          type="text"
                          name="accomodation"
                          value={accomodation.accomodation}
                          onChange={(e) =>
                            handleArrayChange(
                              "accomodationsAndAssisstiveTech",
                              index,
                              e
                            )
                          }
                          placeholder="Accommodation"
                          className="w-[220%] flex pl-2 rounded-md text-[14px] md:text-[17px] bg-sandwich col-span-1 px-2"
                        />
                        <div></div>
                        <select
                          type="text"
                          name="frequency"
                          value={accomodation.frequency}
                          onChange={(e) =>
                            handleArrayChange(
                              "accomodationsAndAssisstiveTech",
                              index,
                              e
                            )
                          }
                          placeholder="Frequency"
                          className="rounded-md bg-sandwich text-[14px] md:text-[17px] w-full col-span-1"
                        >
                          <option value=""></option>
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="As Needed">As Needed</option>
                        </select>

                        <div className="flex flex-row justify-end ">
                          <input
                            type="text"
                            name="location"
                            value={accomodation.location}
                            onChange={(e) =>
                              handleArrayChange(
                                "accomodationsAndAssisstiveTech",
                                index,
                                e
                              )
                            }
                            placeholder="Location"
                            className="rounded-md bg-sandwich text-[14px] md:text-[17px] w-full col-span-1 px-2"
                          />

                          <button
                            type="button"
                            aria-label="delete accomodation or assistive tech"
                            onClick={() =>
                              removeItemFromArray(
                                "accomodationsAndAssisstiveTech",
                                index
                              )
                            }
                          >
                            <img
                              src={xButton}
                              alt="remove"
                              className="w-4 ml-1 "
                            />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      addItemToArray("accomodationsAndAssisstiveTech", {
                        accomodation: "",
                        location: "",
                        frequency: "",
                      })
                    }
                    className="w-full border-4 border-graphite rounded-xl py-2 my-4"
                  >
                    Add Accommodation & Assistive Tech +
                  </button>
                </div>

                <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-2 sm:px-4 py-4">
                  <h3 className="font-header4">Notes</h3>
                  <div className="grid grid-cols-2 gap-1 md:gap-4 pb-2">
                    <div className="col-span-1"></div>
                    <h3 className="underline col-span-1 text-[14px] md:text-[16px] text-right">
                      Date
                    </h3>
                  </div>
                  {studentProfile.notesForStudent.map((studentNote, index) => (
                    <div key={index} className="flex justify-end py-2">
                      <input
                        type="text"
                        name="note"
                        value={studentNote.note}
                        onChange={(e) =>
                          handleArrayChange("notesForStudent", index, e)
                        }
                        placeholder="Note"
                        className="w-full flex rounded-md bg-sandwich text-[14px] md:text-[16px] px-2"
                      />
                      <div className="w-full flex justify-end ">
                        <input
                          type="date"
                          name="date"
                          value={studentNote.date}
                          onChange={(e) =>
                            handleArrayChange("notesForStudent", index, e)
                          }
                          placeholder="Date"
                          className="w-[130px] rounded-md bg-sandwich text-[14px] md:text-[16px] ml-3 px-2"
                        />
                        <button
                          type="button"
                          aria-label="delete notes for student"
                          onClick={() =>
                            removeItemFromArray("notesForStudent", index)
                          }
                        >
                          <img
                            src={xButton}
                            alt="remove"
                            className="w-4 ml-1 "
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      addItemToArray("notesForStudent", {
                        note: "",
                        date: "",
                      })
                    }
                    className="w-full border-4 border-graphite rounded-xl py-2 my-4"
                  >
                    Add Note +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <UnsavedChanges />
        <div className="lg:hidden flex justify-center">
          <button
            className="lg:hidden fixed bottom-36 flex "
            type="submit"
          >
            <Button buttonText="Save" />
          </button>
        </div>
        {/* Small Save button for desktop/large screens to the right */}
        <div>
          <button
            className="hidden lg:fixed lg:bottom-36 lg:right-10 lg:flex "
            type="submit"
          >
            <SmallSaveButton />
          </button>
        </div>
        </form>

        <div className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
          <Nav teacherId={teacherId} classroomId={classroomId} />
        </div>
      </div>
    </>
  );
};

export default withAuth(["teacher"])(AddStudent);
