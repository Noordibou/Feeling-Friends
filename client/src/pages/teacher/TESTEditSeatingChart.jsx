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

    const [studentPositions, setStudentPositions] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classroom = await getTeacherClassroom(teacherId, classroomId);
                setClassroom(classroom);
                const classroomStudents = await getAllStudentsClassroom(teacherId, classroomId);
                setStudents(classroomStudents);
                
                const positions = {};
                classroomStudents.forEach(student => {
                    positions[student._id] = {
                        x: student.seatInfo.x || null, 
                        y: student.seatInfo.y || null, 
                    };
                });
                setStudentPositions(positions);
                
                console.log( "what's this ",JSON.stringify(positions))
                console.log("whaaat")

            } catch (error) {
                console.log("oof error ")
                console.log(error);
            }
        };

        fetchData();
    }, [teacherId, classroomId]);

    const handleDragEnd = (studentId, x, y) => {
        setStudentPositions(prevPositions => ({
            ...prevPositions,
            [studentId]: { x, y },
        }));
    };

    return (
        <> <div className='flex min-h-screen'>
                <div >
                    <div>
                    <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem] ">
                        Good morning, {userData.firstName}!
                    </h1>
                </div>
                {classroom ? (
                    <>
                        <div className="w-[90%] h-[70%] rounded-[1rem] border-sandwich border-[8px] mr-auto ml-auto p-[2rem]" ref={constraintsRef}>
                            <h4 className="bg-sandwich text-notebookPaper font-body text-body w-[23rem] rounded-[1rem] text-center ml-auto mr-auto">
                                Smartboard
                            </h4>
                            {/* Classroom layout here */}
                            <div className="grid grid-rows-8 grid-cols-8 grid-flow-col auto-cols-auto py-4 bg-lightLavender">

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
                                                    className={`border-4 ${bgColorClass} p-3 rounded-lg h-20`}
                                                    style={{
                                                        gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                                                        gridColumnStart: `${student.seatNumber % cols + 1}`,
                                                    }}
                                                    onDragEnd={(event, info) => {
                                                        handleDragEnd(student._id, info.point.x, info.point.y);
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
                                                    className={`border-4 ${bgColorClass} p-3 rounded-lg`}
                                                    style={{
                                                        gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                                                        gridColumnStart: `${student.seatNumber % cols + 1}`,
                                                    }}
                                                    onDragEnd={(event, info) => {
                                                        handleDragEnd(student._id, info.point.x, info.point.y);
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
                                            key={`${student.id}-${index}`} className={`bg-white p-3 m-4 border rounded-lg`} style={{
                                                gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                                                gridColumnStart: `${student.seatNumber % cols + 1}`,
                                            }}
                                            onDragEnd={(event, info) => {
                                                handleDragEnd(student._id, info.point.x, info.point.y);
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
                            
                        <div className="bg-lightBlue w-40 h-40 "></div>
                        </div>
                    </>
                ) : (
                    'Loading...'
                )}


            </div>
            </div>
        </>
    );
}

export default TESTEditSeatingChart