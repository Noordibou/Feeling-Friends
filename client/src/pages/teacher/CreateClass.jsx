import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../../context/UserContext';
import { getTeacherById, getAllStudentsClassroom, createClassroom } from '../../api/teachersApi';

const CreateClass = () => {
    const navigate = useNavigate();
    const { userData } = useUser();
    const [classroomsData, setClassroomsData] = useState([]);
    const [newClassData, setNewClassData] = useState({
        classSubject: "",
        location: "",
        students: [],
    });

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
        fetchTeacherData();
    }, [userData]);

    const handleInputChange = (field, value) => {
        setNewClassData((prevData) => ({ ...prevData, [field]: value }));
    };

    const handleCreateClassroom = async () => {
        try {
            const newClassroomData = {
                classSubject: newClassData.classSubject,
                location: newClassData.location,
                students: newClassData.students,
            };

            const newClassroom = await createClassroom(userData._id, newClassroomData);

            setClassroomsData((prevData) => [
                ...prevData,
                { classroom: newClassroom },
            ]);

            setNewClassData({
                classSubject: "",
                location: "",
                students: [],
            });

            navigate(`/teacher-home`);

        } catch (error) {
            console.error(error);
        }
    };

    console.log(classroomsData)

    return (
        <div className="h-screen">
            <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[4rem] ">
                Create New Class
            </h1>

            <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem] h-[80%] overflow-y-auto ">
                <div className="flex justify-center">
                    <div className="flex flex-col w-[60%]  text-center">
                        <FormField label="Class Subject" value={newClassData.classSubject} onChange={(e) => handleInputChange('classSubject', e.target.value)} />
                        <FormField label="Location" value={newClassData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
                        <FormField label="Students" value={newClassData.students} onChange={(e) => handleInputChange('students', e.target.value)} />
                        <div className=" text-body flex justify-center text-center pt-[2rem]">
                            <button className='border-4 border-darkSandwich hover:bg-darkSandwich rounded-lg px-2 ' onClick={handleCreateClassroom}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormField = ({ label, value, onChange }) => (
    <>
        <label>{label}:</label>
        <input type="text" value={value} onChange={onChange} />
    </>
);

export default CreateClass;
