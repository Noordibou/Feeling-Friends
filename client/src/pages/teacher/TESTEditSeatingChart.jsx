import { useEffect, useState } from "react";
import { useRef } from "react";
import { motion, useAnimation } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getTeacherClassroom, getAllStudentsClassroom, updateSeatingChart } from '../../api/teachersApi';
import { cols, getBorderColorClass } from '../../components/classRoomColors';
import { useNavigate } from "react-router-dom";

const TESTEditSeatingChart = () => {
    const { teacherId, classroomId } = useParams();
    const { userData, updateUser } = useUser();
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);
    const constraintsRef = useRef(null);
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [unassignedStudents, setUnassignedStudents] = useState([]);
    const navigate = useNavigate();


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
            
            const assigned = classroom.students.filter(student => (
              student.seatInfo.x !== null && student.seatInfo.y !== null
            ));
            setAssignedStudents(assigned);
      
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
        <> <div className='flex min-h-screen min-w-screen'>
                <div className="w-full" >
                    <h1 className="text-center mt-10 text-header1">Edit Classroom Seating Chart</h1>
                    <div className="flex justify-around my-8">
                        <button className="bg-darkTeal border p-5 h-10 rounded flex items-center">Save & Exit</button>
                        <button className="bg-yellow border p-5 h-10 rounded flex items-center" onClick={handleSubmit} >Save & Keep Working</button>
                        <button className="bg-orange border p-5 h-10 rounded flex items-center" >Unassign All</button>
                        <a className="bg-lightLavender border p-5 h-10 rounded flex items-center" href={`/TESTEditSC/${teacherId}/${classroomId}`}>Refresh</a>

                        
                    </div>
                {classroom ? (
                    <>
                        <div className="relative w-[90%] h-[50%] rounded-[1rem] border-sandwich border-[8px] mr-auto ml-auto " ref={constraintsRef}>
                            <h4 className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-sandwich text-notebookPaper font-body text-body rounded-[1rem] text-center w-96">
                                Smartboard
                            </h4>
                            {/* Classroom layout here */}

                            {assignedStudents.map((studentObj, index) => {

                                console.log("assigned studentObj: " + JSON.stringify(studentObj))
                                
                                const ref = constraintsRef.current;

                                console.log("innerwidth: " + window.innerWidth + ", clientWidth: " + ref.clientWidth)
                                const initialX = studentObj.seatInfo.x
                                const initialY = studentObj.seatInfo.y 
                                console.log("initial x: " + JSON.stringify(initialX))
                                console.log("initialY: " + JSON.stringify(initialY))

                                function clamp(value, min, max) {
                                  return Math.min(Math.max(value, min), max);
                                }

                                const assignedStudent = students.find(student => student._id === studentObj._id);
                              if(assignedStudent) {
                                return (
                                <motion.div
                                    dragMomentum={false}
                                    drag
                                    dragConstraints={constraintsRef}
                                    key={`${studentObj._id}-${index}`}
                                    initial={{ 
                                      x: initialX - 62,
                                      y: initialY - 62
                                    }}
                                    className={`absolute border-4 ${assignedStudent.borderColorClass} p-3 rounded-lg h-[80px] w-[80px] bg-lightYellow`}
                                    onDragEnd={(event, info) => {
                                        console.log("student: "+ studentObj._id + ", x: " + info.point.x + ", y: " + info.point.y)
                                        const containerBounds = constraintsRef.current.getBoundingClientRect();

                                        // Calculate container coordinates
                                        const containerX = info.point.x - containerBounds.left;
                                        const containerY = info.point.y - containerBounds.top;

                                        console.log("Dragged to x:", containerX, "y:", containerY);
                                        handleDragEnd(studentObj._id, containerX, containerY);
                                    }}
                                >
                                    {assignedStudent.firstName}
                                </motion.div>
                                )
                              } else {
                                return null;
                              }
                            })}

                            </div>
                        
                    </>
                ) : (
                    'Loading...'
                )}
                {/* Unassigned Students */}
                
                <div className=" w-90 m-10 flex-col">
                <h2 className="py-3 text-header2">Unassigned Students</h2>
                    <div className="flex-wrap flex flex-row bg-lightBlue p-5 rounded">
                    {unassignedStudents.map((studentId, index) => {
                        const unassignedStudent = students.find(student => student._id === studentId._id);
                                            
                        if (unassignedStudent) {
                          return (
                            <div key={`unassigned-${index}`} className={`p-2 border-2 ${unassignedStudent.borderColorClass}`}>
                              {unassignedStudent.firstName}
                            </div>
                          );
                        } else {
                          return null;
                        }
                    })}
                    </div>
                </div>                
            </div>
            </div>
        </>
    );
}

export default TESTEditSeatingChart