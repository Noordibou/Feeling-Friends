import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherById} from '../../api/teachersApi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import TeacherNavbar from '../../components/TeacherNavbar';

const EditTeacher = () => {
    const navigate = useNavigate();
    const { userData, updateUser } = useUser();
    const [formData, setFormData] = useState({
        prefix: '',
        avatarImg: '',
        firstName: '',
        lastName: '',
        schoolTeacherId: '',
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
   
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            // Update teacher data
            await updateUser(formData);

            navigate('/teacher-home');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
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
                
            
               
                <button className='border rounded-md my-4' type="submit">Update Teacher</button>
            </form>
        </div>
        <div className="fixed -bottom-0 sticky">
            <TeacherNavbar />
        </div>
        </>
    );
};

export default EditTeacher;
