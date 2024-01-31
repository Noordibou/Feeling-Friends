import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addStudentToClassroom } from '../../api/teachersApi';
import TeacherNavbar from '../../components/TeacherNavbar';

export default function AddStudent() {
    const { teacherId, classroomId } = useParams();
    const [studentId, setStudentId] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { value } = e.target;
        setStudentId(value);
    };

    const handleAddStudent = async () => {
        try {
            await addStudentToClassroom(teacherId, classroomId, { studentId });
            setStudentId('');
            navigate(`/viewclasslist/${teacherId}/${classroomId}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
        <div>
            <h1>Add New Student</h1>
            <form>
                <div>
                    <label htmlFor="studentId">Student ID:</label>
                    <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={studentId}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="button" onClick={handleAddStudent}>
                    Add Student
                </button>
            </form>
        </div>
        <div className="fixed -bottom-0 sticky">
            <TeacherNavbar />
        </div>
        </>
    );
}
