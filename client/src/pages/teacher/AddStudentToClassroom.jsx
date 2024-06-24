import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addStudentToClassroom } from '../../api/teachersApi';
import TeacherNavbar from '../../components/Navbar/TeacherNavbar';
import Nav from '../../components/Navbar/Nav';
import withAuth from '../../hoc/withAuth';

const AddStudent = () => {
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
        {/* <div className="fixed bottom-0 w-screen">
            <TeacherNavbar />
        </div> */}
        <div className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
          <Nav  />
        </div>
        </div>
        </>
    );
}

export default withAuth(['teacher'])(AddStudent)