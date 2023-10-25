// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getStudentProfile } from '../../api/teachersApi';

// export default function StudentProfile() {
//     const { teacherId, classroomId, studentId } = useParams();
//     const [studentProfile, setStudentProfile] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchStudentProfile = async () => {
//             try {
//                 const profile = await getStudentProfile(teacherId, classroomId, studentId);
//                 setStudentProfile(profile);
//             } catch (error) {
//                 setError('An error occurred while fetching the student profile.');
//                 console.error(error);
//             }
//         };

//         fetchStudentProfile();
//     }, [teacherId, classroomId, studentId]);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     if (!studentProfile) {
//         return <div>Loading...</div>;
//     }
//     console.log(studentProfile.firstName)

//     return (
//         <div className='flex w-screen flex-col items-center bg-notebookPaper h-screen'>
//             <div className='flex flex-row '>
//                 <div>{studentProfile.avatarImg}</div>
//                 <div>
//                     <h2 className='text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]'><strong>{studentProfile.firstName} {studentProfile.lastName}</strong></h2>
//                     <p>Age: {studentProfile.age}</p>
//                     <p>Grade: {studentProfile.gradeYear}th</p>
//                     <p>Student ID: {studentProfile.schoolStudentId} </p>
//                     <p>Birthday: {studentProfile.birthday}</p>
//                     <p>IEP: {studentProfile.iepStatus}</p>
//                 </div>
//             </div>
//             <div >
//                 {/* calender space */}
//             </div>
//             <div >
//               <h3>Individual Education Program (IEP)</h3>

//             </div>

//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentProfile } from '../../api/teachersApi';
import { getBackgroundColorClass } from '../../components/classRoom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import youngStudent from '../../images/young-student.png';
import './StudentProfile.css';


export default function StudentProfile() {
    const { teacherId, classroomId, studentId } = useParams();
    const [studentProfile, setStudentProfile] = useState(null);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEntries, setSelectedEntries] = useState([]);

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const profile = await getStudentProfile(teacherId, classroomId, studentId);
                setStudentProfile(profile);

                const studentEvents = profile.journalEntries.map((entry) => ({
                    title: '',
                    date: new Date(entry.date),
                    className: getBackgroundColorClass(entry.checkout?.ZOR || entry.checkin?.ZOR),
                }));
                setEvents(studentEvents);
            } catch (error) {
                setError('An error occurred while fetching the student profile.');
                console.error(error);
            }
        };
        fetchStudentProfile();
    }, [teacherId, classroomId, studentId]);

    const handleDateClick = (date) => {

        setSelectedDate(date);


        const selectedEntries = studentProfile.journalEntries.filter(entry =>
            new Date(entry.date).toDateString() === date.toDateString()
        );
        setSelectedEntries(selectedEntries);
    };

    return (
        <div className="flex  flex-col items-center bg-notebookPaper h-screen">
            <div>
                <div className="flex flex-row items-center">
                    <div className={`w-32 rounded-md mr-4 mt-16 border-8 border-${getBackgroundColorClass(studentProfile?.journalEntries[studentProfile?.journalEntries.length - 1]?.checkout?.ZOR || studentProfile?.journalEntries[studentProfile?.journalEntries.length - 1]?.checkin?.ZOR)}`}>
                        {studentProfile && <img src={youngStudent} alt="Student Avatar" />}
                    </div>
                    <div>
                        <h2 className="text-header1 font-header1 text-center pt-[4rem]">
                            <strong>{studentProfile?.firstName} {studentProfile?.lastName}</strong>
                        </h2>
                        <p>Age: {studentProfile?.age}</p>
                        <p>Grade: {studentProfile?.gradeYear}th</p>
                        <p>Student ID: {studentProfile?.schoolStudentId}</p>
                        <p>Birthday: {studentProfile?.birthday}</p>
                        <p>IEP: {studentProfile?.iepStatus}</p>
                    </div>
                </div>
                <div className="">
                    {studentProfile && (
                        <div className=" mt-12 rounded-2xl bg-white ">
                            <Calendar
                                className="react-calendar "
                                tileClassName={({ date }) => {
                                    const event = events.find((event) => event.date.toDateString() === date.toDateString());
                                    if (event) {
                                        return `${event.className} `;
                                    }
                                    return '';
                                }}
                                onClickDay={handleDateClick}
                            />
                        </div>
                    )}
                    <div>
                        {selectedDate && (
                            <div>
                                <h4>Journal Entries for {selectedDate.toDateString()}:</h4>
                                {selectedEntries.length > 0 ? (
                                    selectedEntries.map((entry) => (
                                        <div key={entry._id}>
                                            <p>ZOR: {entry.checkin?.ZOR || entry.checkout?.ZOR}</p>
                                            <p>Feelings: {entry.checkin?.emotion || entry.checkout?.emotion}</p>
                                            <p>Needs: {entry.checkin?.need || entry.checkout?.need}</p>
                                            <p>Goal: {entry.checkin?.goal || entry.checkout?.goal}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No journal entries for this date.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div className='mt-6 mb-2'>
                        <h3>Individual Education Program (IEP)</h3>
                    </div>
                    <div className='border-4 bg-sandwich border-sandwich rounded-2xl '>
                        <div className='border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4'>
                            <h3 className='text-black text-3xl font-bold font-header1'>Content Area Notices</h3>
                            <h3 className='underline'>Learning Benchmark</h3>
                            <p> {studentProfile?.contentAreaNotices?.contentArea}</p>
                            <p> {studentProfile?.contentAreaNotices?.benchmark}</p>
                        </div>
                        <div className='border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4 '>
                            <h3 className='text-black text-3xl font-bold font-header1'>Learning Challenges</h3>
                            <p> {studentProfile?.learningChallenges?.challenge}</p>
                            <p className='underline'>Diagnosed</p>
                            <p>{studentProfile?.learningChallenges?.date}</p>
                        </div>
                        <div className='border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4'>
                            <h3 className='text-black text-3xl font-bold font-header1'>Accomodations & Assisstive Tech</h3>
                            <h3 className='underline'>Frequency</h3>
                            <h3 className='underline'>Location</h3>
                            <p> {studentProfile?.accommodations?.accommodation}</p>
                            <p> {studentProfile?.accommodations?.frequency}</p>
                            <p> {studentProfile?.accommodations?.location}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
