import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentProfile } from '../../api/teachersApi';
import { getBackgroundColorClass } from '../../components/classRoomColors';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import youngStudent from '../../images/young-student.png';
import './StudentProfile.css';
const { calculateAge, formatDate } = require('../../components/dateFormat');


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
        <div className="flex flex-col items-center bg-notebookPaper h-full">
            <div>
                <div className="flex flex-row items-center">
                    <div className={`w-32 rounded-md mr-4 mt-16 border-8 border-${getBackgroundColorClass(studentProfile?.journalEntries[studentProfile?.journalEntries.length - 1]?.checkout?.ZOR || studentProfile?.journalEntries[studentProfile?.journalEntries.length - 1]?.checkin?.ZOR)}`}>
                        {studentProfile && <img src={youngStudent} alt="Student Avatar" />}
                    </div>
                    <div>
                        <h2 className="text-header1 font-header1 text-center pt-[4rem]">
                            <strong> <Link to={`/viewclasslist/${teacherId}/${classroomId}`}>&lt;</Link> {studentProfile?.firstName} {studentProfile?.lastName}</strong>
                        </h2>
                        <p>Age: {calculateAge(studentProfile?.birthday)}</p>
                        <p>Grade: {studentProfile?.gradeYear}th</p>
                        <p>Student ID: {studentProfile?.schoolStudentId}</p>
                        <p>Birthday: {studentProfile?.birthday}</p>
                        <p>IEP: {studentProfile?.iepStatus}</p>
                    </div>
                </div>
                <div className="">
                    {studentProfile && (
                        <div className=" mt-12 rounded-2xl ">
                            <Calendar
                                className="react-calendar"
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
                            <div className='my-4 p-4 border-8 border-sandwich rounded-2xl '>
                                <h4><strong>Journal Entries for {selectedDate.toDateString()}:</strong></h4>
                                {selectedEntries.length > 0 ? (
                                    selectedEntries.map((entry) => (
                                        <div key={entry._id}>
                                            <p>Zone of Regulation: {entry.checkin?.ZOR || entry.checkout?.ZOR}</p>
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
                <div className='mb-20'>
                    <div className='mt-6 mb-2'>
                        <h1 className='text-black text-4xl font-bold font-header1'>Individual Education Program (IEP)</h1>
                    </div>
                    <div className='border-4 bg-sandwich border-sandwich rounded-2xl '>
                        <div className='border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4'>
                            <h3 className='font-header4'>Content Area Notices</h3>
                            <h3 className='underline flex justify-end pb-2'>Learning Benchmark</h3>
                            {studentProfile?.iep.map((iepEntry, index) => (
                                <div key={index} className='flex justify-between font-body'>
                                    <p> {iepEntry.contentAreaNotices.contentArea}</p>
                                    <p> {iepEntry.contentAreaNotices.benchmark}</p>
                                </div>
                            ))}
                        </div>

                        <div className='border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4'>
                            <h3 className='font-header4'>Learning Challenges</h3>
                            <p className='underline flex justify-end pb-2'>Diagnosed</p>
                            {studentProfile?.iep.map((iepEntry, index) => (
                                <div key={index} className='flex justify-between font-body'>
                                    <p>{iepEntry.learningChallenges.challenge}</p>
                                    <p>{formatDate(iepEntry.learningChallenges.date)}</p>
                                </div>
                            ))}
                        </div>

                        <div className='border-4 border-sandwich bg-notebookPaper rounded-lg px-4 py-4'>
                            <h3 className='font-header4'>Accommodations & Assistive Tech</h3>
                            <div className='flex flex-row gap-4 justify-end pb-2'>
                                <h3 className='underline'>Frequency</h3>
                                <h3 className='underline'>Location</h3>
                            </div>
                            {studentProfile?.iep.map((iepEntry, index) => (
                                <div key={index} className='flex justify-between font-body'>
                                    <p> {iepEntry.accomodationsAndAssisstiveTech.accomodation}</p>
                                    <p className='ml-28'> {iepEntry.accomodationsAndAssisstiveTech.frequency}</p>
                                    <p> {iepEntry.accomodationsAndAssisstiveTech.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* <div className="text-sm font-sm my-6 underline">
                    <Link to={`/viewclasslist/${teacherId}/${classroomId}`}>&lt; Back</Link>
                </div> */}
            </div>
        </div>
    );
}
