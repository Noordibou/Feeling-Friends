import { useEffect, useState } from "react";
import { useRef } from "react";
import { motion, useAnimation } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getTeacherClassroom, getAllStudentsClassroom } from '../../api/teachersApi';
import { cols, getBorderColorClass } from '../../components/classRoomColors';

const TESTEditSeatingChart = () => {
    const { teacherId, classroomId } = useParams();
    const { userData, updateUser } = useUser();
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
      
            // Calculate the border color for each student
            const studentsWithBorderColor = classroomStudents.map(student => {
              const lastJournal = student.journalEntries[student.journalEntries.length - 1];
              if (lastJournal) {
                const lastCheckin = lastJournal.checkin;
                const lastCheckout = lastJournal.checkout;
                if (lastCheckout && lastCheckout.ZOR) {
                  const zor = lastCheckout.ZOR;
                  student.borderColorClass = getBorderColorClass(zor);
                } else if (lastCheckin && lastCheckin.ZOR) {
                  const zor = lastCheckin.ZOR;
                  student.borderColorClass = getBorderColorClass(zor);
                } else {
                  student.borderColorClass = 'border-graphite'; // Default border color
                }
              } else {
                student.borderColorClass = 'border-graphite'; // Default border color
              }
      
              return student;
            });
      
            setStudents(studentsWithBorderColor);
            const positions = {};
                classroom.students.forEach(student => {
                    console.log("student in class: ", JSON.stringify(student))
                  positions[student._id] = {
                    x: student.seatInfo.x || null,
                    y: student.seatInfo.y || null,
                  };
                });

            setStudentPositions(positions);
      
          } catch (error) {
            console.log("oof error ");
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
                        <div className="w-[90%] h-[50%] rounded-[1rem] border-sandwich border-[8px] mr-auto ml-auto p-[2rem]" ref={constraintsRef}>
                            <h4 className="bg-sandwich text-notebookPaper font-body text-body w-[23rem] rounded-[1rem] text-center ml-auto mr-auto">
                                Smartboard
                            </h4>
                            {/* Classroom layout here */}
                            <div className="flex flex-wrap py-4 bg-lightLavender">

                            {students.map((student, index) => (
                                <motion.div
                                    dragMomentum={false}
                                    drag
                                    dragConstraints={constraintsRef}
                                    key={`${student._id}-${index}`}
                                    className={`border-4 ${student.borderColorClass} p-3 rounded-lg h-20 w-20`}
                                    onDragEnd={(event, info) => {
                                        console.log("student: "+ student._id + ", x: " + info.point.x + ", y: " + info.point.y)
                                        handleDragEnd(student._id, info.point.x, info.point.y);
                                    }}
                                >
                                    {student.firstName}
                                </motion.div>
                                ))}

                            </div>

                            {/* Unassigned Students */}
                            <div className="bg-lightBlue w-40 h-40 ">

                            </div>
                        </div>
                        
                    </>
                ) : (
                    'Loading...'
                )}

                <div className="text-right text-body font-body text-darkSandwich pt-[2rem]">
                    <a href={`/TESTEditSC/${teacherId}/${classroomId}`}>edit seating chart</a>
                </div>
            </div>
            </div>
        </>
    );
}

export default TESTEditSeatingChart