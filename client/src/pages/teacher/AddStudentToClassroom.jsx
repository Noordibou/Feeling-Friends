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
const { calculateAge } = require("../../utils/dateFormat");

// TODO:

// // add way to add IEP
// // make certain fields required

const AddStudent = () => {
  const { teacherId, classroomId } = useParams();
  const [studentId, setStudentId] = useState("");
  const [studentProfile, setStudentProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    gradeYear: "",
    schoolStudentId: "",
    birthday: "",
    iepStatus: "Yes",
    avatarImg: youngStudent,
    contentAreaNotices: [{ contentArea: "", benchmark: "" }],
    learningChallenges: [{ challenge: "", date: "" }],
    accomodationsAndAssisstiveTech: [
      { accomodation: "", location: "", frequency: "" },
    ],
    notesForStudent: [{ note: "", date: "" }],
  });
  const navigate = useNavigate();
  const { userData } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

      setStudentProfile({
        ...studentProfile,
        [name]: value,
      });

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
    console.log("handle student starting")
    try {
      const requestData = {

          ...studentProfile,
          contentAreaNotices: studentProfile.contentAreaNotices,
          learningChallenges: studentProfile.learningChallenges,
          accomodationsAndAssisstiveTech: studentProfile.accomodationsAndAssisstiveTech,
          notesForStudent: studentProfile.notesForStudent,
      };
  
      // Assuming `addStudentToClassroom` sends the POST request to the backend
      await createNewStudentAndUser(requestData);
  
      // Reset form after successful submission
      setStudentProfile({
        email: "",
        name: "",
        gradeYear: "",
        schoolStudentId: "",
        birthday: "",
        iepStatus: "No",
        avatarImg: youngStudent, // Reset to default image
        contentAreaNotices: [{ contentArea: "", benchmark: "" }],
        learningChallenges: [{ challenge: "", date: "" }],
        accomodationsAndAssisstiveTech: [
          { accomodation: "", location: "", frequency: "" },
        ],
        notesForStudent: [{ note: "", date: "" }],
      });
  
      // Navigate to the class list page after adding the student
      console.log("woop done!")
      navigate(`/viewclasslist/${teacherId}/${classroomId}`);
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col  bg-notebookPaper min-h-screen">
        <div className="hidden md:flex justify-center lg:justify-end underline mt-4 px-2 md:px-5 ">
          <Logout location="teacherLogout" userData={userData} />
        </div>

        <div>
          <div className="flex md:justify-center">
            <SimpleTopNav
              pageTitle="Add New Student"
              fontsize="text-[25px] xl:text-[24px]"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center">
          {/* Image */}
          <div className="flex flex-col items-center md:self-left md:mr-5">
            <div
              className={`flex items-center justify-center w-32 rounded-md mr-4 border-8 border-[pink]`}
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
            <div className="flex flex-col w-44 md:w-52 ml-3 text-[14px] md:text-[16px]">
            <div>
              <label>First Name: </label>
              <input
                type="text"
                name="firstName"
                value={studentProfile.firstName}
                onChange={handleInputChange}
                className="rounded-md bg-sandwich w-8/12 px-2 my-1"
              />
            </div>
            <div>
              <label>Last Name: </label>
              <input
                type="text"
                name="lastName"
                value={studentProfile.lastName}
                onChange={handleInputChange}
                className="rounded-md bg-sandwich w-8/12 px-2 my-1"
              />
            </div>
            <div>
              <label>Parent's Email: </label>
              <input
                type="text"
                name="email"
                value={studentProfile.email}
                onChange={handleInputChange}
                className="rounded-md bg-sandwich w-8/12 px-2 my-1"
              />
            </div>
              <div className="h-7">
                {studentProfile.birthday && (
                  <p>Age: {calculateAge(studentProfile.birthday)}</p>
                )}
              </div>

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

              <div>
                <label>IEP: </label>
                <select
                  name="iepStatus"
                  value={studentProfile.iepStatus}
                  onChange={handleInputChange}
                  className="rounded-md bg-sandwich px-2 my-1"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* add iep section */}
        {studentProfile.iepStatus === "Yes" && (
          <div className="self-center bg-sandwich p-4 rounded-xl flex flex-col w-[35rem] mt-32">
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
                      onClick={() =>
                        removeItemFromArray("contentAreaNotices", index)
                      }
                    >
                      <img src={xButton} alt="remove" className="w-4 ml-1 " />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  addItemToArray("contentAreaNotices", {
                    contentArea: "",
                    benchmark: "",
                  })
                }
              >
                Add Notice
              </button>
            </div>

            <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-2 sm:px-4 py-4">
              <h3 className="font-header4">Learning Challenges</h3>
              <p className="underline flex justify-end pb-2 text-[14px] md:text-[16px]">
                Diagnosed
              </p>
              {studentProfile.learningChallenges.map((challenge, index) => (
                <div key={index} className="flex justify-end">
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
                      onClick={() =>
                        removeItemFromArray("learningChallenges", index)
                      }
                    >
                      <img src={xButton} alt="remove" className="w-4 ml-1 " />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  addItemToArray("learningChallenges", {
                    challenge: "",
                    date: "",
                  })
                }
              >
                Add Challenge
              </button>
            </div>

            <div className="border-4 border-sandwich bg-notebookPaper rounded-lg px-2 sm:px-4 py-4">
              <h3 className="font-header4">Accommodations & Assistive Tech</h3>
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
                    className="grid grid-cols-4 gap-1 sm:gap-4 items-center"
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
                        onClick={() =>
                          removeItemFromArray(
                            "accomodationsAndAssisstiveTech",
                            index
                          )
                        }
                      >
                        <img src={xButton} alt="remove" className="w-4 ml-1 " />
                      </button>
                    </div>
                  </div>
                )
              )}
              <button
                onClick={() =>
                  addItemToArray("accomodationsAndAssisstiveTech", {
                    accomodation: "",
                    location: "",
                    frequency: "",
                  })
                }
              >
                Add Accommodation
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
                <div key={index} className="flex justify-end">
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
                      onClick={() =>
                        removeItemFromArray("notesForStudent", index)
                      }
                    >
                      <img src={xButton} alt="remove" className="w-4 ml-1 " />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  addItemToArray("notesForStudent", {
                    note: "",
                    date: "",
                  })
                }
              >
                Add Note
              </button>
            </div>
          </div>
        )}

        {/* temp button */}
        <button
          onClick={handleAddStudent}
          className="my-20 self-center w-32 bg-blue px-5 py-2"
        >
          Add Student
        </button>
        <div className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
          <Nav teacherId={teacherId} classroomId={classroomId} />
        </div>
      </div>
    </>
  );
};

export default withAuth(["teacher"])(AddStudent);
