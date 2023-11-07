import { useEffect, useState } from "react";
import { useRef } from "react";
import { motion, useAnimation } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getTeacherClassroom, getAllStudentsClassroom, updateSeatingChart } from '../../api/teachersApi';
import { cols, getBorderColorClass } from '../../components/classRoomColors';

const TESTEditSeatingChart = () => {
    const { teacherId, classroomId } = useParams();
    const { userData, updateUser } = useUser();
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);
    const constraintsRef = useRef(null);
    const [unassignedStudents, setUnassignedStudents] = useState([]);


    const [studentPositions, setStudentPositions] = useState({})

    useEffect(() => {
        const fetchData = async () => {
          try {
            const classroom = userData.classrooms.find(c => c._id === classroomId);
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
                  student.borderColorClass = 'border-graphite';
                }
              } else {
                student.borderColorClass = 'border-graphite';
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

            const unassigned = classroom.students.filter(student => (
                student.seatInfo.x === null || student.seatInfo.y === null
              ));
              setUnassignedStudents(unassigned);
      
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

    
const handleSubmit = async () => {
    const updatedPositions = students.map((student) => ({
        studentId: student._id,
        x: studentPositions[student._id].x,
        y: studentPositions[student._id].y,
    }));

    try {
        await updateSeatingChart(teacherId, classroomId, updatedPositions);

        // Optionally, you can show a success message to the user
    } catch (error) {
        // Handle any errors
    }
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

                            {students.map((student, index) => {

                                const ref = constraintsRef.current;
                                const initialX = (studentPositions[student._id]?.x || 0)/  (ref ? ref.clientWidth : 1) *100
                                const initialY = (studentPositions[student._id]?.y || 0) / (ref ? ref.clientHeight : 1) *100;
                                console.log("ref client width: " + JSON.stringify(ref.clientWidth/2))       
                                console.log("initial x: " + JSON.stringify(initialX))
                                console.log("initialY: " + JSON.stringify(initialY))

                                return (
                                <motion.div
                                    dragMomentum={false}
                                    drag
                                    dragConstraints={constraintsRef}
                                    key={`${student._id}-${index}`}
                                    initial={{ x: initialX, y: initialY }}
                                    className={`border-4 ${student.borderColorClass} p-3 rounded-lg h-20 w-20`}
                                    onDragEnd={(event, info) => {
                                        console.log("student: "+ student._id + ", x: " + info.point.x + ", y: " + info.point.y)
                                        handleDragEnd(student._id, info.point.x, info.point.y);
                                    }}
                                >
                                    {student.firstName}
                                </motion.div>
                                )
                            })}

                            </div>
                        </div>
                        
                    </>
                ) : (
                    'Loading...'
                )}
                {/* Unassigned Students */}
                <div className="bg-lightBlue w-40 h-40 m-10">
                    <h2 className="text-center">Unassigned Students</h2>
                    <div>
                    {unassignedStudents.map((student, index) => (
                        <div key={`unassigned-${student._id}`} className="p-2">
                        {student.firstName}
                        </div>
                    ))}
                    </div>
                </div>
                <div className="text-right text-body font-body text-darkSandwich pt-[2rem]">
                    <a href={`/TESTEditSC/${teacherId}/${classroomId}`}>edit seating chart</a>
                </div>

                <div>
                    <button onClick={handleSubmit}>Save Seating Chart</button>
                </div>
            </div>
            </div>
        </>
    );
}

export default TESTEditSeatingChart