import { useEffect, useState } from "react";
import { useRef } from "react";
import { motion, useAnimation } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getTeacherClassroom, getAllStudentsClassroom } from '../../api/teachersApi';
import { cols, getBorderColorClass } from '../../components/classRoomColors';

const TESTEditSeatingChart = () => {
    const { teacherId, classroomId } = useParams();
    const { userData } = useUser();
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);
    const constraintsRef = useRef(null);

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
        <> <div className='h-screen'>
                <div >
                    <div>
                    <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem] ">
                        Good morning, {userData.firstName}!
                    </h1>
                </div>
                {classroom ? (
                    <>
                        <div className="w-[90%] h-6/12 rounded-[1rem] border-sandwich border-[8px] mr-auto ml-auto p-[2rem]" ref={constraintsRef}>
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
                                                <motion.div
                                                    dragMomentum={false}
                                                    drag 
                                                    dragConstraints={constraintsRef}
                                                    key={`${student.id}-${index}`}
                                                    className={`border-4 ${bgColorClass} p-3 m-4 rounded-lg`}
                                                    style={{
                                                        gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                                                        gridColumnStart: `${student.seatNumber % cols + 1}`,
                                                    }}
                                                >
                                                    a{student.firstName}
                                                </motion.div>
                                            );
                                        } else if (lastCheckin && lastCheckin.ZOR) {
                                            const zor = lastCheckin.ZOR;
                                            const bgColorClass = getBorderColorClass(zor);
                                            return (
                                                <motion.div
                                                    drag={false}
                                                    dragMomentum={false} 
                                                    dragConstraints={constraintsRef}
                                                    key={`${student.id}-${index}`}
                                                    className={`border-4 ${bgColorClass} p-3 m-4 rounded-lg`}
                                                    style={{
                                                        gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                                                        gridColumnStart: `${student.seatNumber % cols + 1}`,
                                                    }}
                                                >
                                                    b{student.firstName}
                                                </motion.div>
                                            );
                                        }
                                    }
                                    return (
                                        <motion.div 
                                            drag 
                                            dragConstraints={constraintsRef}
                                            dragMomentum={false}
                                            key={`${student.id}-${index}`} className={`bg-white p-3 m-4 rounded-lg`} style={{
                                                gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                                                gridColumnStart: `${student.seatNumber % cols + 1}`,
                                            }}
                                        >
                                            c{student.firstName}
                                        </motion.div>

                                    );
                                }
                                )}

                            </div>
                            <div className="text-right text-body font-body text-darkSandwich pt-[2rem]">
                                <a href={`/TESTEditSC/${teacherId}/${classroomId}`}>edit seating chart</a>
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
            </div>
        </>
    );
}

export default TESTEditSeatingChart