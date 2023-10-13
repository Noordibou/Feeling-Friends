import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { getTeacherClassroom, getAllStudentsClassroom } from '../../api/teachersApi';
import { getBackgroundColorClass } from '../../components/classRoom';

export default function ViewClassList() {
    const { teacherId, classroomId } = useParams();
    const { userData } = useUser();
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);

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
    return (
        <>
            <div>
                <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]">Good morning, {userData.firstName}!</h1>
                {classroom ? (
                    <>
                        <div className="flex justify-center w-[90%] mr-auto ml-auto">

                            <div className="flex">
                                <div className="pr-[0.5rem]"><button className="text-body font-body rounded-[1rem] border-sandwich border-[4px] pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] w-[21rem]">Sort by Regulatory Zone</button></div>
                                <div className="pl-[0.5rem]"><button className="text-body font-body rounded-[1rem] border-sandwich border-[4px] pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] w-[21rem]">Sort by Last Name</button></div>
                            </div>

                            {/* Scrollable list of students */}

                        </div>
                        <div className='flex justify-center'>
                            {students.length > 0 ? (
                                <ul className='w-[70%]'>
                                    {students.map((student, index) => {
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
                                                        <div className={`bg${bgColorClass} my-3 p-4 rounded-lg`}>
                                                            <div className='pb-2'>
                                                                {student.firstName} {student.lastName} is feeling <b>{lastEmotion}</b>
                                                            </div>
                                                            <div className='bg-notebookPaper px-2 py-2 rounded-md'>
                                                                Goals: {lastCheckout.goal}
                                                                <br />
                                                                Needs: {lastCheckout.need}
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
                                                            <div>
                                                                {student.firstName} {student.lastName} is feeling <b>{lastEmotion}</b>
                                                            </div>
                                                            <div className='bg-notebookPaper px-2 py-2 rounded-md'>
                                                                Goals: {lastCheckin.goal}
                                                                <br />
                                                                Needs: {lastCheckin.need}
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        }
                                        return (
                                            <li key={`${student.id}-${index}`}>
                                                <div className={`bg-white p-4 my-3 rounded-lg`}>
                                                    {student.firstName} didn't check in or out yet!
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
                                <div><span className="text-header2 font-header2"><b>{classroom.classSubject}</b></span> &nbsp;&nbsp; <span className="font-karla text-lg">{classroom.location}</span></div>
                            </div>

                            <div className="flex justify-between text-body font-body">
                                <div><a href="/editneedsgoals">Set class goals and needs</a></div>
                                <div><a href="/">Edit roster</a></div>
                            </div>

                        </div>
                    </>
                ) : (
                    'Loading...'
                )}

                <div className="w-[90%] ml-auto mr-auto mt-[1rem]">


                    {/* Div below may need positioned differently later */}
                    <div className="justify-start text-body font-body">
                        <a href="/teacher-home">&lt; All Classes</a>
                    </div>

                    <div className="flex rounded-[1rem] border-sandwich border-[8px] w-[25%] ml-auto mr-auto">
                        <div className="text-body font-body p-[1rem] bg-sandwich">
                        <Link to={`/classroom/${userData._id}/${classroomId}`}>Room</Link></div>
                        <div className="text-body font-body p-[1rem]"><Link to={`/viewclasslist/${userData._id}/${classroomId}`}>List</Link></div>
                    </div>

                </div>

            </div>

        </>
    );
}