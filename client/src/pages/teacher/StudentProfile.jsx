import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentProfile } from '../../api/teachersApi'; // Ensure this import is correct

export default function StudentProfile() {
    const { teacherId, classroomId, studentId } = useParams();
    const [studentProfile, setStudentProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const profile = await getStudentProfile(teacherId, classroomId, studentId);
                setStudentProfile(profile);
            } catch (error) {
                setError('An error occurred while fetching the student profile.');
                console.error(error);
            }
        };

        fetchStudentProfile();
    }, [teacherId, classroomId, studentId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!studentProfile) {
        return <div>Loading...</div>;
    }
    console.log(studentProfile.firstName)

    return (
        <div className='flex w-screen flex-col items-center bg-notebookPaper h-screen'>
            <div className='flex flex-row '>
                <div>{studentProfile.avatarImg}</div>
                <div>
                    <h2 className='text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]'><strong>{studentProfile.firstName} {studentProfile.lastName}</strong></h2>
                    <p>Age: {studentProfile.age}</p>
                    <p>Grade: {studentProfile.gradeYear}th</p>
                    <p>Student ID: {studentProfile.schoolStudentId} </p>
                    <p>Birthday: {studentProfile.birthday}</p>
                    <p>IEP:</p>
                </div>
            </div>
            <div >
                {/* calender space */}
            </div>
            <div >
              <h3>Individual Education Program (IEP)</h3>
              
            </div>

        </div>
    );
}

