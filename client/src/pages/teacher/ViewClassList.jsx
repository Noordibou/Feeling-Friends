import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getTeacherClassroom, getAllStudentsClassroom, deleteStudentFromClassroom } from '../../api/teachersApi';
import { getBackgroundColorClass } from '../../components/classRoomColors';
import xButton from '../../images/x-button.png';

export default function ViewClassList() {
    const { teacherId, classroomId } = useParams();
    const { userData } = useUser();
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('zor');
    const [sortDirection, setSortDirection] = useState('asc');
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


    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortStudents = () => {
        const zorOrder = ['Unmotivated', 'Wiggly', 'Ready to Learn', 'Explosive'];

        const sortedStudents = [...students].sort((a, b) => {
            if (sortCriteria === 'lastName') {
                return sortDirection === 'desc'
                    ? a.lastName.localeCompare(b.lastName)
                    : b.lastName.localeCompare(a.lastName);
            } else if (sortCriteria === 'zor') {
                const zorA = a.journalEntries[a.journalEntries.length - 1]?.checkout?.ZOR || a.journalEntries[a.journalEntries.length - 1]?.checkin?.ZOR;
                const zorB = b.journalEntries[b.journalEntries.length - 1]?.checkout?.ZOR || b.journalEntries[b.journalEntries.length - 1]?.checkin?.ZOR;

                const indexA = zorOrder.indexOf(zorA);
                const indexB = zorOrder.indexOf(zorB);


                if (indexA === -1 && indexB === -1) {
                    return 0;
                } else if (indexA === -1) {
                    return 1;
                } else if (indexB === -1) {
                    return -1;
                } else {
                    return indexA - indexB;
                }
            }

            return 0;
        });

        if (sortCriteria === 'zor' && sortDirection === 'desc') {
            sortedStudents.reverse();
        }

        return sortedStudents;
    };

    const sortedStudents = sortStudents();


    return (
        <>
            <div>
                <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]">Good morning, {userData.firstName}!</h1>
                {classroom ? (
                    <>
                        <div className="flex justify-center w-[90%] mr-auto ml-auto">
                            <div className="flex">
                                <div className="pr-[0.5rem]">
                                    <button
                                        className="text-body font-body rounded-[1rem] border-sandwich border-[4px] pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] w-[21rem]"
                                        onClick={() => {
                                            setSortCriteria('zor');
                                            toggleSortDirection();
                                        }}
                                    >
                                        Sort by Regulatory Zone
                                    </button>
                                </div>
                                <div className="pl-[0.5rem]">
                                    <button
                                        className="text-body font-body rounded-[1rem] border-sandwich border-[4px] pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] w-[21rem]"
                                        onClick={() => {
                                            setSortCriteria('lastName');
                                            toggleSortDirection();
                                        }}
                                    >
                                        Sort by Last Name
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable list of students */}
                        </div>
                        <div className='flex justify-center'>
                            {sortedStudents.length > 0 ? (
                                <ul className='w-[70%]'>
                                    {sortedStudents.map((student, index) => {
                                        const lastJournal = student.journalEntries[student.journalEntries.length - 1];
                                        if (lastJournal) {
                                            const lastCheckin = lastJournal.checkin;
                                            const lastCheckout = lastJournal.checkout;
                                            if (lastCheckout && lastCheckout.emotion) {
                                                const lastEmotion = lastCheckout.emotion;
                                                const zor = lastCheckout.ZOR;
                                                const bgColorClass = getBackgroundColorClass(zor);
                                                return (
                                                    <li key={`${student.id}-${index}`}>
                                                        <div className={`bg-${bgColorClass} my-3 p-4 rounded-lg`}>
                                                            <div className='pb-2 flex justify-between'>
                                                                <div>
                                                                    {student.firstName} {student.lastName} is feeling <b>{lastEmotion}</b>
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
                                                                Goals: {lastCheckout.goal}
                                                                <br />
                                                                Needs: {lastCheckout.need}
                                                                <div className='pt-3 mr-2 underline'>
                                                                    <Link to={`/${userData._id}/${classroomId}/${student._id}`}>More &gt;</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            } else if (lastCheckin && lastCheckin.emotion) {
                                                const lastEmotion = lastCheckin.emotion;
                                                const zor = lastCheckin.ZOR;
                                                const bgColorClass = getBackgroundColorClass(zor);
                                                return (
                                                    <li key={`${student.id}-${index}`}>
                                                        <div className={`bg-${bgColorClass} my-3 p-4 rounded-lg`}>
                                                            <div className='flex justify-between'>
                                                                <div>
                                                                    {student.firstName} {student.lastName} is feeling <b>{lastEmotion}</b>
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
                                                                Goals: {lastCheckin.goal}
                                                                <br />
                                                                Needs: {lastCheckin.need}
                                                                <div className='pt-3 mr-2 underline'>
                                                                    <Link to={`/${userData._id}/${classroomId}/${student._id}`}>More &gt;</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            }
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

                        <div className="w-[90%] ml-auto mr-auto mt-[1rem]">
                            <div className="text-left">
                                <div>
                                    <span className="text-header2 font-header2"><b>{classroom.classSubject}</b></span> &nbsp;&nbsp;
                                    <span className="font-karla text-lg">{classroom.location}</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-body font-body">
                                <div><a href="/editneedsgoals">Set class goals and needs</a></div>
                                <div>
                                    <button onClick={() => setIsEditMode(!isEditMode)}>
                                        {isEditMode ? 'Save Changes' : 'Edit Students'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    'Loading...'
                )}

                <div className="w-[90%] ml-auto mr-auto mt-[1rem] pb-6">
                    <div className="justify-start text-body font-body">
                        <a href="/teacher-home">&lt; All Classes</a>
                    </div>
                    <div className="flex rounded-[1rem] border-sandwich border-[8px] w-[25%] ml-auto mr-auto ">
                        <div className="text-body font-body p-[1rem] bg-sandwich">
                            <Link to={`/classroom/${userData._id}/${classroomId}`}>Room</Link>
                        </div>
                        <div className="text-body font-body p-[1rem]">
                            <Link to={`/viewclasslist/${userData._id}/${classroomId}`}>List</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
