import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { getTeacherClassroom, getAllStudentsClassroom } from '../../api/teachersApi';
import { cols, getBorderColorClass } from '../../components/classRoom';

const ViewClassroom = () => {
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
                <div>
                    <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]">
                        Good morning, {userData.firstName}!
                    </h1>
                </div>
                {classroom ? (
                    <>
                        <div className="w-[90%] rounded-[1rem] border-sandwich border-[8px] mr-auto ml-auto p-[2rem]">
                            <h4 className="bg-sandwich text-notebookPaper font-body text-body w-[23rem] rounded-[1rem] text-center ml-auto mr-auto">
                                Smartboard
                            </h4>
                            {/* Classroom layout here */}
                            <div className="grid grid-rows-8 grid-cols-8 grid-flow-col auto-cols-auto py-4">

                                {students.map((student, index) => {
                                    const lastJournal = student.journalEntries[student.journalEntries.length - 1];
                                    if (lastJournal) {
                                        const lastCheckin = lastJournal.checkin;
                                        const lastCheckout = lastJournal.checkout;
                                        if (lastCheckout && lastCheckout.ZOR) {
                                            const zor = lastCheckout.ZOR;
                                            const bgColorClass = getBorderColorClass(zor);
                                            return (
                                                <div
                                                    key={`${student.id}-${index}`}
                                                    className={`border-4 ${bgColorClass} p-3 m-4 rounded-lg`}
                                                    style={{
                                                        gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                                                        gridColumnStart: `${student.seatNumber % cols + 1}`,
                                                    }}
                                                >
                                                    {student.firstName}
                                                </div>
                                            );
                                        }
                                        else if (lastCheckin && lastCheckin.ZOR) {
                                            const zor = lastCheckout.ZOR;
                                            const bgColorClass = getBorderColorClass(zor);
                                            return (
                                                <div
                                                    key={`${student.id}-${index}`}
                                                    className={`bg${bgColorClass} p-3 m-4 rounded-lg`}
                                                    style={{
                                                        gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                                                        gridColumnStart: `${student.seatNumber % cols + 1}`,
                                                    }}
                                                >
                                                    {student.firstName}
                                                </div>
                                            );
                                        }
                                    }
                                    return (
                                        <div key={`${student.id}-${index}`} className={`bg-white p-3 m-4 rounded-lg`} style={{
                                            gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                                            gridColumnStart: `${student.seatNumber % cols + 1}`,
                                        }}>
                                            {student.firstName}
                                        </div>

                                    );
                                }
                                )}

                            </div>
                            <div className="text-right text-body font-body text-sandwich pt-[2rem]">
                                <a href="/">Edit seating chart</a>
                            </div>
                        </div>

                        <div className="w-[90%] ml-auto mr-auto mt-[1rem]">
                            <div className="flex justify-between">
                                <div>
                                    <span className="text-header2 font-header2">
                                        <b>{classroom.classSubject}</b>
                                    </span>{' '}
                                    &nbsp;&nbsp;
                                    <span className="font-karla text-lg px-6">{classroom.location}</span>
                                </div>
                                <div className="text-body font-body">
                                    Check In &nbsp;&nbsp; 8AM - 9AM<br />
                                    Check out &nbsp;&nbsp; 2PM - 3PM
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    'Loading...'
                )}

                <div className="w-[90%] ml-auto mr-auto mt-[1rem]">
                    <div className="justify-start text-body font-body">
                        <a href="/teacher-home">&lt; All Classes</a>
                    </div>

                    <div className="flex rounded-[1rem] border-sandwich border-[8px] w-[25%] ml-auto mr-auto">
                        <div className="text-body font-body p-[1rem] bg-sandwich">
                            <a href="/viewclassroom">Room</a>
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

export default ViewClassroom;


// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';

// import { getAllStudentsClassroom } from '../../api/teachersApi';

// function ClassroomStudents() {
//     const { teacherId, classroomId } = useParams();

//     const [students, setStudents] = useState([]);

//     useEffect(() => {
//         const fetchStudents = async () => {
//             try {
//                 const classroomStudents = await getAllStudentsClassroom(teacherId, classroomId);
//                 setStudents(classroomStudents);
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchStudents();
//     }, [teacherId, classroomId]);

//     return (
//         <div>
//             <h1>Students</h1>

//             {students.length > 0 ? (
//                 <ul>
//                     {students.map((student, index) => (
//                         <li key={`${student.id}-${index}`}>{student.firstName}</li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No students found.</p>
//             )}
//         </div>
//     );
// }

// export default ClassroomStudents;