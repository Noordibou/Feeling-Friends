import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getTeacherClassroom, getAllStudentsClassroom, deleteStudentFromClassroom } from '../../api/teachersApi';
import { getBackgroundColorClass } from '../../utils/classroomColors.js';
import xButton from '../../images/x-button.png';
import './scrollbar.css'
import GoBack from '../../components/GoBack.jsx';
import ToggleButton from '../../components/ToggleButton.jsx';
import sortByCriteria  from '../../utils/sortStudents.js';
import TeacherNavbar from '../../components/TeacherNavbar.jsx';

export default function ViewClassList() {
    const { teacherId, classroomId } = useParams();
    const { userData } = useUser();
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classroom = await getTeacherClassroom(teacherId, classroomId);
                setClassroom(classroom);
                const classroomStudents = await getAllStudentsClassroom(teacherId, classroomId);
                setStudents(classroomStudents);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [teacherId, classroomId]);
    

    const handleDeleteStudent = async (studentId) => {
        try {
            await deleteStudentFromClassroom(teacherId, classroomId, studentId);
            setStudents((prevData) => prevData.filter((item) => item._id !== studentId));
        } catch (error) {
            console.error(error);
        }
    };

    const sortedStudents = sortByCriteria(students);


    return (
        <>
            <div className='max-w-screen-xl mx-auto'>
                <div className='flex flex-col justify-center h-screen pt-[4rem]'>
                    {classroom ? (
                        <>
                            <div className="flex justify-center gap-[8rem] mb-[0.5rem] ">
                                <div className="flex items-center ">
                                    <GoBack />
                                    <h2 className="text-header4 font-header2 ml-[2rem] ">{classroom.classSubject}</h2>
                                </div>
                                <div className="flex-col text-sm font-body">
                                    <h2>Location:</h2>
                                    <h2 className="font-semibold">{classroom.location}</h2>
                                </div>

                                <div className="flex-col text-sm font-body ">
                                    <div className="flex gap-4">
                                        <h2>Check-in</h2>
                                        <h2>Check-out</h2>
                                    </div>
                                    <div className="flex gap-[4rem] font-semibold">
                                        <h2>{classroom.checkIn ? `${classroom.checkIn}AM` : '-'}</h2>
                                        <h2>{classroom.checkOut ? `${classroom.checkOut}PM` : '-'}</h2>
                                    </div>
                                </div>
                            </div>


                            {/* <div>
                                <h2 className="text-header2 font-header2 text-center my-[1rem]">
                                {isEditMode ? (
                                    <Link className="underline" to={`/addstudent/${teacherId}/${classroomId}`}>
                                    Add new student
                                    </Link>
                                    ) : (
                                        ''
                                        )}
                                        </h2>
                                    </div> */}

                                <ToggleButton
                                    students={students}
                                    setStudents={setStudents}
                                />
                            
                            {/* Scrollable list of students */}
                            <div className='flex justify-center overflow-y-auto custom-scrollbar'>
                                {sortedStudents.length > 0 ? (
                                    <ul className='w-[70%]'>
                                        {sortedStudents.map((student, index) => {
                                            const lastJournal = student.journalEntries[student.journalEntries.length - 1];

                                            if (lastJournal) {
                                                const isCheckout = lastJournal.checkout && lastJournal.checkout.emotion;
                                                const lastEmotion = isCheckout ? lastJournal.checkout.emotion : lastJournal.checkin?.emotion;
                                                const zor = isCheckout ? lastJournal.checkout.ZOR : lastJournal.checkin?.ZOR;
                                                const bgColorClass = getBackgroundColorClass(zor);

                                                return (
                                                    <li key={`${student.id}-${index}`}>
                                                        <div className={`bg-${bgColorClass} my-3 p-4 rounded-lg`}>
                                                            <div className='pb-2 flex justify-between'>
                                                                <div>
                                                                    {student.firstName}  {student.lastName} is feeling <b>{lastEmotion}</b>
                                                                </div>
                                                                {isEditMode && (
                                                                    <div className='-mt-8 -mx-8'>
                                                                        <div>
                                                                            <button onClick={() => handleDeleteStudent(student._id)}>
                                                                                <img src={xButton} alt="xButton" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className='bg-notebookPaper px-2 py-2 rounded-md flex justify-between'>
                                                                Goals: {isCheckout ? lastJournal.checkout.goal : lastJournal.checkin?.goal}
                                                                <br />
                                                                Needs: {isCheckout ? lastJournal.checkout.need : lastJournal.checkin?.need}
                                                                <div className='pt-3 mr-2 underline'>
                                                                    <Link to={`/${userData._id}/${classroomId}/${student._id}`}>More &gt;</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            }

                                            return (
                                                <li key={`${student.id}-${index}`}>
                                                    <div className={`bg-white p-4 my-3 rounded-lg flex justify-between`}>
                                                        <div className=''>
                                                            {student.firstName} {student.lastName} didn't check in or out yet!
                                                        </div>
                                                        <div className='flex justify-end'>
                                                            {isEditMode && (
                                                                <div className='-mt-10 -mx-24'>
                                                                    <div>
                                                                        <button onClick={() => handleDeleteStudent(student._id)}>
                                                                            <img src={xButton} alt="xButton" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <Link to={`/${userData._id}/${classroomId}/${student._id}`} className='mr-4 underline'>More &gt;</Link>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p>No students found.</p>
                                )}
                            </div>

                        </>
                    ) : (
                        'Loading...'
                    )}

                    <div className="w-[90%] ml-auto mr-auto mt-[1rem] pb-6">
                        <div className="flex justify-between text-body font-body">
                            <a href="/teacher-home">&lt; All Classes</a>
                            <div>
                                <button onClick={() => setIsEditMode(!isEditMode)}>
                                    {isEditMode ? 'Save Changes' : 'Edit Students'}
                                </button>
                            </div>
                        </div>

                        <div className="flex rounded-[1rem] border-sandwich border-[8px] w-[25%] ml-auto mr-auto ">
                            <div className="text-body font-body p-[1rem] bg-sandwich">
                                <Link to={`/classroom/${userData._id}/${classroomId}`}>Room</Link>
                            </div>
                            <div className="text-body font-body p-[1rem]">
                                List
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed -bottom-0 sticky">
            <TeacherNavbar />
            </div>
        </>
    );
}
