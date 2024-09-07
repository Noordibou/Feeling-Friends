import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getTeacherById,
  getAllStudentsClassroom,
  createClassroom,
  getAllStudents,
} from "../../api/teachersApi";
import TeacherNavbar from "../../components/Navbar/TeacherNavbar";
import GoBack from "../../components/GoBack";
import Nav from "../../components/Navbar/Nav";
import youngStudent from "../../images/young-student.png";
import { getBackgroundColorClass } from "../../utils/classroomColors";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import Divider from "../../images/divider.png";
import Arrow from "../../images/dropdownarrow.svg";
import Sort from "../../images/sortaz.svg";
import withAuth from "../../hoc/withAuth";


const CreateClass = () => {

  const navigate = useNavigate();
  const { userData, updateUser } = useUser();
  const [classroomsData, setClassroomsData] = useState([]);
  const [newClassData, setNewClassData] = useState({
    classSubject: "",
    location: "",
    students: [],
  });
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([])

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await getTeacherById(userData._id);
        const studentsPromises = response.classrooms.map(async (classroom) => {
          const students = await getAllStudentsClassroom(
            userData._id,
            classroom._id
          );
          return { classroom, students };
        });

        const classroomsWithStudents = await Promise.all(studentsPromises);
        setClassroomsData(classroomsWithStudents);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllStudents = async () => {
      try {
        const allStudentsData = await getAllStudents();
        setAllStudents(allStudentsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeacherData();
    fetchAllStudents();
  }, [userData]);

  const handleInputChange = (field, value) => {
    setNewClassData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleStudentChange = (student) => {
    setSelectedStudents((prev) => {
      if (prev.some((selectedStudent) => selectedStudent._id === student._id)) {
        // If the student is already selected, remove them
        return prev.filter((selectedStudent) => selectedStudent._id !== student._id);
      } else {
        // Otherwise, add the student to the selected list
        return [...prev, student];
      }
    });
  };

  const handleDayChange = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((selectedDay) => selectedDay !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  // probably would use this for the "submit" button
  // FIXME: need to use selectedStudents instead of maybe prevData??
  const handleAddStudent = (student) => {
    console.log("handleAddStudent called with:", student);
    setNewClassData((prevData) => {
      const isSelected = prevData.students.some(s => s._id === student._id);
      console.log("Is student already selected?", isSelected);
      if (isSelected) {
        const updatedStudents = prevData.students.filter(s => s._id !== student._id);
        console.log("Removing student. Updated students:", updatedStudents);
        return {
          ...prevData,
          students: updatedStudents,
        };
      } else {
        const updatedStudents = [...prevData.students, student];
        console.log("Adding student. Updated students:", updatedStudents);
        return {
          ...prevData,
          students: updatedStudents,
        };
      }
    });
  };

  // TODO: remove if no longer need, replaced with "selectedStudents"
  const isStudentSelected = (studentId) =>
    newClassData.students.some(s => s._id === studentId);

  const handleCreateClassroom = async () => {
    try {
      const newClassroomData = {
        classSubject: newClassData.classSubject,
        location: newClassData.location,
        students: newClassData.students.map((studentId) => ({
          student: studentId,
          seatInfo: {
            x: null,
            y: null,
            assigned: false,
          },
        })),
      };
      const newClassroom = await createClassroom(
        userData._id,
        newClassroomData
      );

      setClassroomsData((prevData) => [
        ...prevData,
        { classroom: newClassroom },
      ]);
      setNewClassData((prevData) => ({ ...prevData, students: [] }));

      // Updates React Context
      const updatedUserData = await getTeacherById(userData._id);
      updateUser(updatedUserData);

      navigate(`/teacher-home`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents =
    searchTerm.length > 0
      ? allStudents.filter((student) =>
          `${student.firstName} ${student.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : allStudents;

  const toggleDaySelection = (day) => {
    setSelectedDays((currentSelectedDays) =>
      currentSelectedDays.includes(day)
        ? currentSelectedDays.filter((d) => d !== day)
        : [...currentSelectedDays, day]
    );
  };


  
  return (
    <>
      <div className="h-screen ">
        <div className="flex justify-around items-center pt-8">
          <div className="absolute left-[28%]">
            <GoBack />
          </div>
          <span className="text-header2 font-semibold font-header2 w-[40%]">
            Add New Classroom
          </span>
        </div>

        <div className="bg-sandwich max-w-[40%] min-w-[25rem]  ml-auto mr-auto p-[1rem] rounded-[1rem] my-[1rem]">
          <h3 className="mb-[0.5rem] ml-[0.5rem] font-poppins font-bold text-sm">
            Title or Subject
          </h3>
          <FormField
            label="Math"
            value={newClassData?.classSubject || ""}
            onChange={(e) => handleInputChange("classSubject", e.target.value)}
          />

          <h3 className="mb-[0.5rem] ml-[0.5rem] mt-[1rem]  font-poppins font-bold text-sm">
            Days of the Week
          </h3>
          <div className="flex justify-center py-[1rem] font-poppins text-md">
            Sun{" "}
            <span className="ml-[1rem] mr-[1rem]">
              <Checkbox
                id="Sunday"
                handleCheckboxChange={() => handleDayChange("Sunday")}
                isChecked={selectedDays.includes("Sunday")}
              />
            </span>
            Mon{" "}
            <span className="ml-[1rem] mr-[1rem]">
              <Checkbox
                id="Monday"
                handleCheckboxChange={() => handleDayChange("Monday")}
                isChecked={selectedDays.includes("Monday")}
              />
            </span>
            Tues{" "}
            <span className="ml-[1rem] mr-[1rem]">
              <Checkbox
                id="Tuesday"
                handleCheckboxChange={() => handleDayChange("Tuesday")}
                isChecked={selectedDays.includes("Tuesday")}
              />
            </span>
            Wed{" "}
            <span className="ml-[1rem] mr-[1rem]">
              <Checkbox
                id="Wednesday"
                handleCheckboxChange={() => handleDayChange("Wednesday")}
                isChecked={selectedDays.includes("Wednesday")}
              />
            </span>
            Thurs{" "}
            <span className="ml-[1rem] mr-[1rem]">
              <Checkbox
                id="Thursday"
                handleCheckboxChange={() => handleDayChange("Thursday")}
                isChecked={selectedDays.includes("Thursday")}
              />
            </span>
            Fri{" "}
            <span className="ml-[1rem] mr-[1rem]">
              <Checkbox
                id="Friday"
                handleCheckboxChange={() => handleDayChange("Friday")}
                isChecked={selectedDays.includes("Friday")}
              />
            </span>
            Sat{" "}
            <span className="ml-[1rem] mr-[1rem]">
              <Checkbox
                id="Saturday"
                handleCheckboxChange={() => handleDayChange("Saturday")}
                isChecked={selectedDays.includes("Saturday")}
              />
            </span>
          </div>
          <div className="rounded-[1rem]">
            <div className="flex-col text-sm font-body">
              <h3 className="mt-[0.5rem] mb-[0.5rem] ml-[0.5rem] font-poppins font-bold text-sm">
                Location
              </h3>
              <FormField
                label="Classroom 101"
                value={newClassData?.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div>
              <div className="flex gap-[8rem]">
                <div className="w-[50%]">
                  <h3 className="mb-[0.5rem] ml-[0.2rem] mt-[1rem] font-poppins font-bold text-sm">
                    Check-in:
                  </h3>
                  <FormField
                    label="00:00 AM"
                    value={newClassData?.checkIn || ""}
                    onChange={(e) =>
                      handleInputChange("checkIn", e.target.value)
                    }
                  />
                </div>
                <div className="w-[50%]">
                  <h3 className="mb-[0.5rem] ml-[0.2rem] mt-[1rem] font-poppins font-bold text-sm">
                    Check-out:
                  </h3>
                  <FormField
                    label="00:00 PM"
                    value={newClassData?.checkOut || ""}
                    onChange={(e) =>
                      handleInputChange("checkOut", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center bg-sandwich rounded-[1rem] mt-[1rem]">
            <h2 className="text-sm font-body">
              <a href="/edit-seating-chart/:teacherId/:classroomId">
                <u>Edit Seating Chart</u>
              </a>
            </h2>
          </div>
        </div>

        <div className="flex justify-center pt-[1.5rem]">
          <div className="w-[40%]">
            <span className="text-md font-bold font-poppins">Class size</span>
            <span className="text-md font-poppins">
              &nbsp;&nbsp;&nbsp;{newClassData.students.length} student(s)
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[40%] text-center font-poppins text-md pt-[2rem] pb-[2rem]">
            {selectedStudents.length > 0 ? (
              selectedStudents.map((student) => (
                <div key={student._id}>
                  {student.firstName} {student.lastName}
                </div>
              ))
            ) : (
              <span className="italic">
                Students will appear here when added
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <img src={Divider} alt="Divider" className="w-[40%]" />
        </div>

        <div className="flex justify-center pt-[2rem]">
          <div className="flex flex-col w-[40%] gap-5 text-center">
            <h2 className="text-header3 font-poppins font-bold text-left">
              Add Students to Classroom
            </h2>
            <input
              type="text"
              placeholder="Type to search for student"
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-[0.4rem] pl-[0.8rem] bg-notebookPaper rounded-3xl border-[0.3rem] border-sandwich font-poppins text-sm"
            />
            <div>
              <div className="flex justify-between items-center">
                <div className="flex justify-center items-center gap-2 p-[0.2rem] w-[40%] bg-notebookPaper rounded-3xl border-[0.3rem] border-sandwich font-poppins text-sm">
                  Sort by Last Name <img src={Sort} />
                </div>
                <div className="flex justify-center items-center gap-2 p-[0.6rem] w-[40%] bg-notebookPaper rounded-3xl border-[0.3rem] border-sandwich font-poppins text-sm">
                  Grade Level: 5th
                  <img src={Arrow} />
                </div>
              </div>
            </div>
            {filteredStudents.length > 0 && (
              <div>
                <ul className="columns-3">
                  {filteredStudents.map((student) => (
                    <li key={student._id}>
                      <div className="flex font-poppins mb-[0.5rem] mr-[3rem]">
                        <Checkbox
                          id={`student-${student._id}`}
                          handleCheckboxChange={() =>
                            handleStudentChange(student)
                          }
                          isChecked={selectedStudents.some(
                            (s) => s._id === student._id
                          )}
                        />
                        <label htmlFor={`student-${student._id}`}>
                          {student.firstName} {student.lastName}
                        </label>
                        <div>
                          <img
                            src={
                              student.avatarImg === "none"
                                ? youngStudent
                                : student.avatarImg
                            }
                            alt={student.lastName}
                            className="w-[3rem] h-[3rem] rounded-[1rem] ml-[0.5rem]"
                          />
                        </div>
                        <div className="text-left m-auto text-xs font-poppins">
                          <span className="font-bold">
                            {student.firstName} {student.lastName}
                          </span>
                          <br />
                          {student.gradeYear}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="h-[25%] w-full flex justify-center mt-[1rem]">
          <div onClick={handleCreateClassroom}>
            <Button buttonText="Submit" />
          </div>
        </div>

        <div className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
          <Nav />
        </div>
      </div>
    </>
  );
};


const FormField = ({ label, value, onChange }) => (
  <div>
    <input
      type="text"
      placeholder={label}
      value={value}
      onChange={onChange}
      className="custom-placeholder custom-input"
    />
  </div>
);

export default withAuth(['teacher'])(CreateClass)
