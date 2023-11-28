// AddStudent.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { addStudentToClassroom } from '../../api/teachersApi';

export default function AddStudent() {
    const { teacherId, classroomId } = useParams();
    const [studentId, setStudentId] = useState('');

    const handleInputChange = (e) => {
        const { value } = e.target;
        setStudentId(value);
    };

    const handleAddStudent = async () => {
        try {
            // Make an API call to add the student to the classroom using the provided student ID
            await addStudentToClassroom(teacherId, classroomId, { studentId });

            // Clear the form after successful addition
            setStudentId('');

            // You may also want to navigate back to the ViewClassList page or update the state to trigger a re-render
        } catch (error) {
            console.error(error);
        }
    };

    return (
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
    );
}
