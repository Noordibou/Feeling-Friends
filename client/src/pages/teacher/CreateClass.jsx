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
import Button from "../../components/SmallSaveButton";
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
  const [sortByLastName, setSortByLastName] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);

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
    if (!newClassData.classSubject.trim()) {
      alert("Please enter a class subject.");
      return;
    }

    if (selectedStudents.length === 0) {
      alert("Please select at least one student for the class.");
      return;
    }

    try {
      const newClassroomData = {
        classSubject: newClassData.classSubject,
        location: newClassData.location,
        students: selectedStudents.map((student) => ({
          student: student._id,
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
      setSelectedStudents([]);

      // Updates React Context
      const updatedUserData = await getTeacherById(userData._id);
      updateUser(updatedUserData);

      navigate(`/teacher-home`);
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the classroom. Please try again.");
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

  const handleSortByLastName = () => {
    setSortByLastName(!sortByLastName);
  };

  const sortedFilteredStudents = sortByLastName
    ? [...filteredStudents].sort((a, b) => a.lastName.localeCompare(b.lastName))
    : filteredStudents;

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setIsGradeDropdownOpen(false);
  };

  const filteredByGradeStudents = selectedGrade === 'All'
    ? sortedFilteredStudents
    : sortedFilteredStudents.filter(student => student.gradeYear === selectedGrade);

  return (
    <>
      <div className="h-screen">
        <div className="flex justify-around items-center pt-8 pb-[1rem]">
          <div className="relative lg:left-[-18%] left-[-40%]">
            <GoBack />
          </div>
          <span className="text-header2 font-header2 font-semibold absolute lg:left-[35%]">
            Add New Classroom
          </span>
        </div>

        <div className="bg-sandwich max-w-[40%] min-w-[23rem] ml-auto mr-auto p-[1rem] rounded-[1rem] lg:my-[1rem] sm:my-[0rem]">
          <h3 className="mb-[0.5rem] ml-[0.5rem] font-poppins font-bold text-sm">
            Title or Subject
          </h3>
          <FormField
            label="Math"
            value={newClassData?.classSubject || ""}
            onChange={(e) => handleInputChange("classSubject", e.target.value)}
          />

          <h3 className="mb-[0.5rem] ml-[0.5rem] mt-[1rem] font-poppins font-bold text-sm">
            Days of the Week
          </h3>
          <div className="flex flex-wrap py-[1rem] gap-4 justify-center font-poppins lg:text-md sm:text-xs max-w-[100%]">
            
            <div className="flex gap-2">
              Sun{" "}
              <Checkbox
                id="Sunday"
                handleCheckboxChange={() => handleDayChange("Sunday")}
                isChecked={selectedDays.includes("Sunday")}

              />
            </div>
            <div className="flex gap-2">
            Mon{" "}
              <Checkbox
                id="Monday"
                handleCheckboxChange={() => handleDayChange("Monday")}
                isChecked={selectedDays.includes("Monday")}
              />
            </div>
            <div className="flex gap-2">
            Tues{" "}
              <Checkbox
                id="Tuesday"
                handleCheckboxChange={() => handleDayChange("Tuesday")}
                isChecked={selectedDays.includes("Tuesday")}
              />
            </div>
            <div className="flex gap-2">
            Wed{" "}
              <Checkbox
                id="Wednesday"
                handleCheckboxChange={() => handleDayChange("Wednesday")}
                isChecked={selectedDays.includes("Wednesday")}
              />
            </div>
            <div className="flex gap-2">
            Thurs{" "}
              <Checkbox
                id="Thursday"
                handleCheckboxChange={() => handleDayChange("Thursday")}
                isChecked={selectedDays.includes("Thursday")}
              />
            </div>
            <div className="flex gap-2">
            Fri{" "}
              <Checkbox
                id="Friday"
                handleCheckboxChange={() => handleDayChange("Friday")}
                isChecked={selectedDays.includes("Friday")}
              />
            </div>
            <div className="flex gap-2">
            Sat{" "}
              <Checkbox
                id="Saturday"
                handleCheckboxChange={() => handleDayChange("Saturday")}
                isChecked={selectedDays.includes("Saturday")}
              />
            </div>
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
          <div className="min-w-[40%]">
            <span className="text-md font-bold font-poppins">Class size</span>
            <span className="text-md font-poppins">
              &nbsp;&nbsp;&nbsp;{selectedStudents.length} student(s)
            </span>
          </div>
        </div>
        <div className="flex justify-center pt-[2rem]">
          <div className="flex flex-col min-w-[40%] gap-5 text-center p-[0.5rem]">
            <div className="min-w-[40%] text-center font-poppins text-md pt-[2rem] pb-[2rem]">
              {selectedStudents.length > 0 ? (
                <div className="ml-auto mr-auto">
                  <ul className="lg:columns-3 sm:columns-2 md:columns-2">
                    {selectedStudents.map((student) => (
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
                          <div>
                            <img
                              src={
                                student.avatarImg === "none"
                                  ? youngStudent
                                  : student.avatarImg
                              }
                              alt={student.lastName}
                              className="max-w-[3rem] max-h-[3rem] rounded-[1rem] ml-[0.5rem] mr-[0.5rem]"
                            />
                          </div>
                          <div className="text-left lg:text-xs md:text-xs font-poppins">
                            <span className="font-bold">
                              {student.firstName} {student.lastName}
                            </span>
                            <br />
                            Grade {student.gradeYear}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <span className="italic">
                  Students will appear here when added
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <img src={Divider} alt="Divider" className="max-w-[40%] p-[0.5rem]" />
        </div>

        <div className="flex justify-center pt-[2rem] lg:pb-[3rem] pb-[15rem]">
          <div className="flex flex-col min-w-[40%] gap-5 text-center p-[0.5rem]">
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
                <div
                  className="flex justify-center items-center gap-2 p-[0.2rem] w-[40%] bg-notebookPaper hover:border-lightSandwich rounded-3xl border-[0.3rem] border-sandwich font-poppins text-sm cursor-pointer"
                  onClick={handleSortByLastName}
                >
                  Sort by Last Name <img src={Sort} alt="Sort icon" />
                </div>
                <div className="relative w-[40%]">
                  <div
                    className="flex justify-between items-center p-[0.6rem] w-full bg-notebookPaper hover:border-lightSandwich rounded-3xl border-[0.3rem] border-sandwich font-poppins text-sm cursor-pointer"
                    onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
                  >
                    Grade Level: {selectedGrade}
                    <img src={Arrow} alt="Dropdown arrow" className={`transition-transform duration-300 ${isGradeDropdownOpen ? 'transform rotate-180' : ''}`} />
                  </div>
                  {isGradeDropdownOpen && (
                    <div className="text-left absolute top-full left-0 w-full mt-1 font-poppins bg-notebookPaper border border-[0.1rem] border-sandwich rounded-3xl z-10">
                      {['All', '1', '2', '3', '4', '5', '6'].map((grade) => (
                        <div
                          key={grade}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleGradeSelect(grade)}
                        >
                        Grade Level: {grade}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {filteredByGradeStudents.length > 0 && (
              <div className="ml-auto mr-auto">
                <ul className="lg:columns-3 sm:columns-2 md:columns-2">
                  {filteredByGradeStudents.map((student) => (
                    <li key={student._id}>
                      <div className="flex font-poppins mb-[0.5rem]  mr-[3rem]">
                        <Checkbox
                          id={`student-${student._id}`}
                          handleCheckboxChange={() =>
                            handleStudentChange(student)
                          }
                          isChecked={selectedStudents.some(
                            (s) => s._id === student._id
                          )}
                        />
                        <div>
                          <img
                            src={
                              student.avatarImg === "none"
                                ? youngStudent
                                : student.avatarImg
                            }
                            alt={student.lastName}
                            className="max-w-[3rem] max-h-[3rem] rounded-[1rem] ml-[0.5rem] mr-[0.5rem]"
                          />
                        </div>
                        <div className="text-left lg:text-xs md:text-xs font-poppins">
                          <span className="font-bold">
                            {student.firstName} {student.lastName}
                          </span>
                          <br />
                          Grade {student.gradeYear}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="h-[25%] w-full flex justify-center mt-[1rem] fixed md:top-[88%] top-[75%] md:left-[42%]">
          <div onClick={handleCreateClassroom}>
            <Button />
          </div>
        </div>

        {/* <div className="lg:hidden h-[25%] w-full flex justify-center mt-[1rem]">
          <div onClick={handleCreateClassroom}>
            <Button />
          </div>
        </div> */}


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
