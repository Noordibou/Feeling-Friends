import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../context/UserContext';
import { getTeacherById, getAllStudentsClassroom, createClassroom, getAllStudents } from '../../api/teachersApi';

const AddStudentToClassroom = () => {
    const navigate = useNavigate();
    const { userData } = useUser();
    const [classroomsData, setClassroomsData] = useState([]);
    const [newClassData, setNewClassData] = useState({
        classSubject: "",
        location: "",
        students: [],
    });
    const [allStudents, setAllStudents] = useState([]);
    const [studentId, setStudentId] = useState(""); // Added missing state for studentId
    const [error, setError] = useState(""); // Added missing state for error

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

    const handleAddStudent = () => {
        if (studentId && !newClassData.students.includes(studentId)) {
            setNewClassData((prevData) => ({ ...prevData, students: [...prevData.students, studentId] }));
            setStudentId(""); // Clear studentId after adding
            setError(""); // Clear error if it was set previously
        } else {
            setError("Please enter a valid student ID.");
        }
    };

    const isStudentSelected = (studentId) => newClassData.students.includes(studentId);

    return (
        <div>
            <label>
                Student ID:
                <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            </label>
            <button onClick={handleAddStudent}>Add Student to Classroom</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default AddStudentToClassroom;
