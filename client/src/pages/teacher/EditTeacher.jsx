import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherById, getAllStudentsClassroom, addStudentToClassroom, deleteStudentFromClassroom } from '../../api/teachersApi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const EditTeacher = () => {
    const navigate = useNavigate();
    const { userData, updateUser } = useUser();
    const [formData, setFormData] = useState({
        prefix: '',
        avatarImg: '',
        firstName: '',
        lastName: '',
        schoolTeacherId: '',
        classrooms: [],
    });
    const [studentsData, setStudentsData] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedClassroomIndex, setSelectedClassroomIndex] = useState(null);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const response = await getTeacherById(userData._id);
                setFormData(response);
                const studentsPromises = response.classrooms.map(classroom => {
                    return getAllStudentsClassroom(userData._id, classroom._id);
                });

                const students = await Promise.all(studentsPromises);
                setStudentsData(students);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTeacherData();
    }, [userData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleClassroomInputChange = (event, classroomIndex, field) => {
        const updatedClassrooms = [...formData.classrooms];
        updatedClassrooms[classroomIndex][field] = event.target.value;
        setFormData({
            ...formData,
            classrooms: updatedClassrooms,
        });
    };

    // const handleStudentInputChange = (event, classroomIndex, studentIndex, field) => {
    //     const updatedStudentsData = [...studentsData];
    //     updatedStudentsData[classroomIndex][studentIndex][field] = event.target.value;
    //     setStudentsData(updatedStudentsData);
    // };

    const addStudentToClassroom = async () => {
        if (selectedClassroomIndex !== null) {
            try {
                const classroom = formData.classrooms[selectedClassroomIndex];
                const teacherId = userData._id;
                const classroomId = classroom._id;

                // Make an API call to add a student to the classroom
                const response = await addStudentToClassroom(teacherId, classroomId);

                if (response && response.student) {
                    const updatedClassrooms = [...formData.classrooms];
                    updatedClassrooms[selectedClassroomIndex].students.push(response.student);
                    setFormData({
                        ...formData,
                        classrooms: updatedClassrooms,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const removeStudentFromClassroom = async (classroomIndex, studentId) => {
        const classroom = formData.classrooms[classroomIndex];
        const teacherId = userData._id;
        const classroomId = classroom._id;

        // Make an API call to remove a student from the classroom
        await deleteStudentFromClassroom(teacherId, classroomId, studentId);

        const updatedClassrooms = [...formData.classrooms];
        const studentIndex = updatedClassrooms[classroomIndex].students.findIndex(student => student._id === studentId);
        if (studentIndex !== -1) {
            updatedClassrooms[classroomIndex].students.splice(studentIndex, 1);
            setFormData({
                ...formData,
                classrooms: updatedClassrooms,
            });
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            // Update teacher data
            await updateUser(formData);

            // Update student data for each classroom
            // formData.classrooms.forEach(async (classroom, classroomIndex) => {
            //     classroom.students.forEach(async (student) => {
            //         await updateStudent(userData._id, classroom._id, student._id, {
            //             firstName: student.firstName,
            //             lastName: student.lastName,
            //             iepStatus: student.iepStatus,
            //         });
            //     });
            // });

            navigate('/teacher-home');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='h-full min-h-screen flex flex-col items-center '>
            <h1 className='m-4 font-header1'>Edit Teacher</h1>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Prefix: </label>
                    <input type="text" name="prefix" value={formData.prefix} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Avatar Image: </label>
                    <input type="text" name="avatarImg" value={formData.avatarImg} onChange={handleInputChange} />
                </div>
                <div>
                    <label>First Name: </label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Last Name: </label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </div>
                <div>
                    <label>School Teacher ID: </label>
                    <input type="text" name="schoolTeacherId" value={formData.schoolTeacherId} onChange={handleInputChange} />
                </div>
                {/* Classroom details */}
                {formData.classrooms.map((classroom, classroomIndex) => (
                    <div key={classroomIndex}>
                        <label>Class Subject: </label>
                        <input
                            type="text"
                            name={`classrooms[${classroomIndex}].classSubject`}
                            value={classroom.classSubject}
                            onChange={(event) => handleClassroomInputChange(event, classroomIndex, 'classSubject')}
                        />
                        <label>Location: </label>
                        <input
                            type="text"
                            name={`classrooms[${classroomIndex}].location`}
                            value={classroom.location}
                            onChange={(event) => handleClassroomInputChange(event, classroomIndex, 'location')}
                        />

                        <ul>
                            {Array.isArray(studentsData[classroomIndex]) &&
                                studentsData[classroomIndex].map((student, studentIndex) => (
                                    <li key={studentIndex}>
                                        <span>{student.firstName} {student.lastName}</span>
                                        <button className='border rounded-md mx-4'
                                            onClick={() => removeStudentFromClassroom(classroomIndex, student._id)}
                                        >
                                            Remove Student
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
                {/* Add Student section */}
                <div>
                    <h2>Add Student to Classroom</h2>
                    <select onChange={(event) => setSelectedClassroomIndex(event.target.value)}>
                        <option value="">Select a Classroom</option>
                        {formData.classrooms.map((classroom, index) => (
                            <option key={index} value={index}>{classroom.classSubject}</option>
                        ))}
                    </select>
                    <button onClick={addStudentToClassroom}>Add Student to Classroom</button>
                </div>
                <button className='border rounded-md my-4' type="submit">Update Teacher</button>
            </form>
        </div>
    );
};

export default EditTeacher;

{/* <label>Students:</label>
                        <ul>
                            {Array.isArray(studentsData[classroomIndex]) &&
                                studentsData[classroomIndex].map((student, studentIndex) => (
                                    <li key={studentIndex}>
                                        <input
                                            type="text"
                                            value={student.firstName}
                                            onChange={(event) =>
                                                handleStudentInputChange(event, classroomIndex, studentIndex, 'firstName')
                                            }
                                        />
                                        <input
                                            type="text"
                                            value={student.lastName}
                                            onChange={(event) =>
                                                handleStudentInputChange(event, classroomIndex, studentIndex, 'lastName')
                                            }
                                        />
                                        <select
                                            value={student.iepStatus}
                                            onChange={(event) =>
                                                handleStudentInputChange(event, classroomIndex, studentIndex, 'iepStatus')
                                            }
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </li>
                                ))}
                        </ul> */}
