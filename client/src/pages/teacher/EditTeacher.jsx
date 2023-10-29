import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherById } from '../../api/teachersApi';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../context/UserContext";

const EditTeacher = () => {
    const navigate = useNavigate();
    const { userData, updateUser } = useUser();
    // const { teacherId } = useParams();
    const [formData, setFormData] = useState({
        prefix: '',
        avatarImg: '',
        firstName: '',
        lastName: '',
        schoolTeacherId: '',
        classrooms: [],

    });

    useEffect(() => {

        const fetchTeacherData = async () => {
            try {
                const response = await getTeacherById(userData._id);
                setFormData(response);
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


    const handleFormSubmit = async (event) => {
        try {
            event.preventDefault();
            updateUser(formData);
            navigate(`/teacher-home`);
        }
        catch (error) {
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
                {formData.classrooms.map((classroom, index) => (
                    <div key={index}>
                        <label>Class Subject:</label>
                        <input
                            type="text"
                            name={`classrooms[${index}].classSubject`}
                            value={classroom.classSubject}
                            onChange={(event) => handleClassroomInputChange(event, index, 'classSubject')}
                        />
                        <label>Location:</label>
                        <input
                            type="text"
                            name={`classrooms[${index}].location`}
                            value={classroom.location}
                            onChange={(event) => handleClassroomInputChange(event, index, 'location')}
                        />
                        <label>Students:</label>
                        <input
                            type="text"
                            name={`classrooms[${index}].students`}
                            value={classroom.students}
                            onChange={(event) => handleClassroomInputChange(event, index, 'students')}
                        />
                    </div>
                ))}

                <button type="submit">Update Teacher</button>
            </form>
        </div>
    );
};

export default EditTeacher;