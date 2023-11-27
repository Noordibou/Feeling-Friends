import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../../context/UserContext';
import { getTeacherById, getAllStudentsClassroom, createClassroom, getAllStudents } from '../../api/teachersApi';

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
        if (studentId && !newClassData.students.includes(studentId)) {
            setNewClassData((prevData) => ({ ...prevData, students: [...prevData.students, studentId] }));
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
        <div className="h-screen ">
            <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[4rem] ">
                Create New Class
            </h1>

            <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[2rem] rounded-[1rem] h-[80%] overflow-y-auto ">
                <div className="flex justify-center">
                    <div className="flex flex-col w-[60%] gap-5 text-center">
                        <FormField
                            label="Class Subject"
                            value={newClassData?.classSubject || ""}
                            onChange={(e) => handleInputChange('classSubject', e.target.value)}
                        />
                        <FormField

                            label="Location"
                            value={newClassData?.location || ""}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                        />
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
    );
};
const FormField = ({ label, value, onChange }) => (
    <div>
      <label>{label}:</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="rounded-lg h-[2.2rem] p-4 mx-2"
      />
    </div>
  );
  

export default CreateClass;