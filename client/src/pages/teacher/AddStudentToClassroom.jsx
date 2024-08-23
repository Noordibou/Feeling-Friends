import { useUser } from "../../context/UserContext";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addStudentToClassroom } from "../../api/teachersApi";
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
    try {
      await addStudentToClassroom(teacherId, classroomId, studentProfile);
      setStudentProfile({
        name: "",
        gradeYear: "",
        schoolStudentId: "",
        birthday: "",
        iepStatus: "No",
        avatarImg: youngStudent,
      });
      navigate(`/viewclasslist/${teacherId}/${classroomId}`);
    } catch (error) {
      console.error(error);
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
          <div className="self-center flex flex-col w-96 mt-32">
            <div className="content-area-notices">
              <h3>Content Area Notices</h3>
              {studentProfile.contentAreaNotices.map((notice, index) => (
                <div key={index}>
                  <input
                    type="text"
                    name="contentArea"
                    value={notice.contentArea}
                    onChange={(e) =>
                      handleArrayChange("contentAreaNotices", index, e)
                    }
                    placeholder="Content Area"
                  />
                  <input
                    type="text"
                    name="benchmark"
                    value={notice.benchmark}
                    onChange={(e) =>
                      handleArrayChange("contentAreaNotices", index, e)
                    }
                    placeholder="Benchmark"
                  />
                  <button
                    onClick={() =>
                      removeItemFromArray("contentAreaNotices", index)
                    }
                  >
                    Remove
                  </button>
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

            <div className="learning-challenges">
              <h3>Learning Challenges</h3>
              {studentProfile.learningChallenges.map((challenge, index) => (
                <div key={index}>
                  <input
                    type="text"
                    name="challenge"
                    value={challenge.challenge}
                    onChange={(e) =>
                      handleArrayChange("learningChallenges", index, e)
                    }
                    placeholder="Challenge"
                  />
                  <input
                    type="date"
                    name="date"
                    value={challenge.date}
                    onChange={(e) =>
                      handleArrayChange("learningChallenges", index, e)
                    }
                    placeholder="Date"
                  />
                  <button
                    onClick={() =>
                      removeItemFromArray("learningChallenges", index)
                    }
                  >
                    Remove
                  </button>
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

            <div className="accomodations-and-assistive-tech">
              <h3>Accommodations and Assistive Tech</h3>
              {studentProfile.accomodationsAndAssisstiveTech.map(
                (accomodation, index) => (
                  <div key={index}>
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
                    />
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
                    />
                    <input
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
                    />
                    <button
                      onClick={() =>
                        removeItemFromArray(
                          "accomodationsAndAssisstiveTech",
                          index
                        )
                      }
                    >
                      Remove
                    </button>
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
