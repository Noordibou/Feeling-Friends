import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherById, getAllStudentsClassroom, updateStudent } from '../../api/teachersApi';
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

    const handleStudentInputChange = (event, classroomIndex, studentIndex, field) => {
        const updatedStudentsData = [...studentsData];
        updatedStudentsData[classroomIndex][studentIndex][field] = event.target.value;
        setStudentsData(updatedStudentsData);
    };

    const handleFormSubmit = async (event) => {
        try {
            event.preventDefault();
            updateUser(formData);

            studentsData.forEach(async (classroom, classroomIndex) => {

                classroom.forEach(async (student, studentIndex) => {
                    // console.log(studentsData[classroomIndex][studentIndex].firstName)
                    await updateStudent(userData._id, formData.classrooms[classroomIndex]._id, student._id, {
                        firstName: studentsData[classroomIndex][studentIndex].firstName,
                        lastName: studentsData[classroomIndex][studentIndex].lastName,
                        iepStatus: studentsData[classroomIndex][studentIndex].iepStatus,

                    });

                });
            });
            navigate(`/teacher-home`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Edit Teacher</h1>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Prefix:</label>
                    <input type="text" name="prefix" value={formData.prefix} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Avatar Image:</label>
                    <input type="text" name="avatarImg" value={formData.avatarImg} onChange={handleInputChange} />
                </div>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </div>
                <div>
                    <label>School Teacher ID:</label>
                    <input type="text" name="schoolTeacherId" value={formData.schoolTeacherId} onChange={handleInputChange} />
                </div>
                {/* Classroom details */}
                {formData.classrooms.map((classroom, classroomIndex) => (
                    <div key={classroomIndex}>
                        <label>Class Subject:</label>
                        <input
                            type="text"
                            name={`classrooms[${classroomIndex}].classSubject`}
                            value={classroom.classSubject}
                            onChange={(event) => handleClassroomInputChange(event, classroomIndex, 'classSubject')}
                        />
                        <label>Location:</label>
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
                                        <span>{student.firstName}</span>
                                        <span>{student.lastName}</span>
                                    </li>
                                ))}
                        </ul>
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
                    </div>
                ))}

                <button type="submit">Update Teacher</button>
            </form>
        </div>
    );
};

export default EditTeacher;
