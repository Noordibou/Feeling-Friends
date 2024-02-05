import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../../context/UserContext';
import { getTeacherById, getAllStudentsClassroom, createClassroom, getAllStudents } from '../../api/teachersApi';
import TeacherNavbar from "../../components/TeacherNavbar";

const CreateClass = () => {
    const navigate = useNavigate();
    const { userData } = useUser();
    const [classroomsData, setClassroomsData] = useState([]);
    const [newClassData, setNewClassData] = useState({
        classSubject: "",
        location: "",
        students: [],
    });
    const [allStudents, setAllStudents] = useState([]);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const response = await getTeacherById(userData._id);
                const studentsPromises = response.classrooms.map(async classroom => {
                    const students = await getAllStudentsClassroom(userData._id, classroom._id);
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

    const handleAddStudent = (studentId) => {
        // Check if the student is already selected
        const isSelected = newClassData.students.includes(studentId);
    
        if (isSelected) {
            // If selected, remove the student from the array
            setNewClassData((prevData) => ({
                ...prevData,
                students: prevData.students.filter((id) => id !== studentId),
            }));
        } else {
            // If not selected, add the student to the array
            setNewClassData((prevData) => ({
                ...prevData,
                students: [...prevData.students, studentId],
            }));
        }
    };

    const isStudentSelected = (studentId) => newClassData.students.includes(studentId);

    const handleCreateClassroom = async () => {
        try {
          const newClassroomData = {
            classSubject: newClassData.classSubject,
            location: newClassData.location,
            students: newClassData.students.map(studentId => ({
              student: studentId,
              seatInfo: {
                x: null,
                y: null,
                assigned: false,
              },
            })),
          };
            const newClassroom = await createClassroom(userData._id, newClassroomData);

            setClassroomsData((prevData) => [...prevData, { classroom: newClassroom }]);
            setNewClassData((prevData) => ({ ...prevData, students: [] }));

            navigate(`/teacher-home`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
        <div className="h-screen ">
            <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[1rem] ">
                Add new Classroom
            </h1>
            
            <div className="bg-sandwich w-[80%]  ml-auto mr-auto p-[1rem] rounded-[1rem] my-[1rem]">
                        <FormField
                            label="Enter Class Title or Subject"
                            value={newClassData?.classSubject || ""}
                            onChange={(e) => handleInputChange('classSubject', e.target.value)}
                        />
            <div className="bg-notebookPaper p-[0.5rem] rounded-[1rem]">
            <div className="flex justify-between mx-2">
                      <div className="flex-col text-sm font-body">
                        <h2 className="ml-[1rem] text-lg font-karla">Location:</h2>
                        <FormField
                            label="Classroom"
                            value={newClassData?.location || ""}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>

                      <div className="flex-col text-sm font-body ">
                        <div className="flex gap-4">
                          <h2 className="ml-[1rem] text-lg font-karla">Check-in:</h2>
                          <h2 className="ml-[1rem] text-lg font-karla">Check-out:</h2>
                        </div>
                        <div className="flex w-[20rem]">
                        <FormField
                            label="00 AM"
                            value={newClassData?.checkIn || ""}
                            onChange={(e) => handleInputChange('checkIn', e.target.value)}
                        />
                        <FormField
                            label="00 PM"
                            value={newClassData?.checkOut || ""}
                            onChange={(e) => handleInputChange('checkOut', e.target.value)}
                        />
                          </div>
                        </div>
                        </div>
                        </div>
                      <div className="flex justify-center bg-sandwich rounded-[1rem]  pt-[0.8rem]">
                      <h2 className="text-header2 font-header2"><a href="/edit-seating-chart/:teacherId/:classroomId"><u>Edit Seating Chart</u></a></h2>

                    </div>
                  </div>
                  
            <div className="w-[80%] ml-auto mr-auto p-[2rem] rounded-[1rem] h-[80%] overflow-y-auto ">
            <h2 className="text-header2 font-header2 text-center"><a href="/addstudent/:teacherId/:classroomId"><u>+ Add student</u></a></h2>
                <div className="flex justify-center pt-[3rem]">
                    <div className="flex flex-col w-[60%] gap-5 text-center">
                        {allStudents.length > 0 && (
                            <div className="text-center">
                                <label >Students:</label>
                                <ul className="columns-3">
                                    {allStudents.map(student => (
                                        <li key={student._id}>
                                            <button
                                                onClick={() => handleAddStudent(student._id)}
                                                className={`p-1 ${isStudentSelected(student._id) ? 'bg-darkSandwich rounded-lg m-2 text-white' : 'bg-white rounded-lg m-2'}`}
                                            >
                                                {student.firstName} {student.lastName}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className=" text-sm flex justify-center text-center pt-[2rem] gap-2">
                            <button
                                className='border-4 border-darkSandwich hover:bg-darkSandwich rounded-lg px-2 '
                                onClick={handleCreateClassroom}
                            >
                                Save
                            </button>
                            <Link className='border-4 border-darkSandwich hover:bg-darkSandwich rounded-lg px-2 ' to={'/teacher-home'}>Cancel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="fixed -bottom-0 sticky">
            <TeacherNavbar />
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
        className="rounded-lg h-[2.2rem] p-4 text-header2 font-header2 custom-placeholder custom-input"
      />
    </div>
  );
  

export default CreateClass;