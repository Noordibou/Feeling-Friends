import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherById } from '../../api/teachersApi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import TeacherNavbar from '../../components/TeacherNavbar';
import Logout from '../../components/LogoutButton';

const EditTeacher = () => {
    const navigate = useNavigate();
    const { userData, updateUser } = useUser();
    const [formData, setFormData] = useState({
        prefix: '',
        avatarImg: '',
        firstName: '',
        lastName: '',
        schoolTeacherId: '',
        school: '',
        phone: '',
        email: '',
        password: '',
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

            // navigate('/teacher-home');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className='h-screen flex flex-col items-center pt-8'>
                <h1 className='m-4 font-header1 text-header2 '>Manage settings</h1>
                <div className=' p-4 rounded-lg justify-center bg-sandwich w-96'>
                    <h2 className='font-header4 text-header3'>Account profile</h2>
                    <form className='flex flex-col gap-2' onSubmit={handleFormSubmit}>
                        <div className='flex flex-col'>
                            <label>Prefix </label>
                            <input type="text" name="prefix" value={formData.prefix} onChange={handleInputChange} className='rounded-lg px-2 py-0.5' />
                        </div>
                        <div className='flex flex-col'>
                            <label>First Name </label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className='rounded-lg px-2 py-0.5' />
                        </div>
                        <div className='flex flex-col'>
                            <label>Last Name </label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className='rounded-lg px-2 py-0.5' />
                        </div>
                        <div className='flex flex-col'>
                            <label>School </label>
                            <input type="text" name="school" value={formData.school} onChange={handleInputChange} className='rounded-lg px-2 py-0.5' />
                        </div>
                        <div className='flex flex-col'>
                            <label>Email </label>
                            <input type="text" name="email" value={formData.email} onChange={handleInputChange} className='rounded-lg px-2 py-0.5' />
                        </div>
                        <div className='flex flex-col'>
                            <label>Phone </label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className='rounded-lg px-2 py-0.5' />
                        </div>
                        {/* <div className='flex flex-col'>
                    <label>Password </label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className='rounded-lg px-2 py-0.5'  />
                </div> */}

                        <button className='border rounded-md my-4' type="submit">Update Teacher</button>
                    </form>
                </div>
                <div className='flex flex-row mt-3 underline gap-1'>
                    <Logout location='teacherLogout' />
                    <div className='font-semibold underline text-body -mt-0.5'>
                        {userData.firstName} {userData.lastName}
                    </div>
                </div>
            <div className="bottom-0 fixed w-screen">
                <TeacherNavbar />
            </div>
            </div>
        </>
    );
};

export default EditTeacher;
