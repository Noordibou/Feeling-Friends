import { useEffect, useState } from "react";
import { useRef } from "react";
import { motion, useAnimation, useDragControls } from 'framer-motion';
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

    // const handleDragEnd = (studentId, x, y) => {
    //     setStudentPositions(prevPositions => ({
    //         ...prevPositions,
    //         [studentId]: { x, y },
    //     }));
    // };

    const handleDragEnd = (studentId, x, y) => {  
      const motionDiv = document.getElementById(`motion-div-${studentId}`);
      if (motionDiv) {
          const coords = motionDiv.style.transform.match(
              /^translateX\((.+)px\) translateY\((.+)px\) translateZ/
          );
  
          if (coords?.length) {
            console.log("Coords: " + JSON.stringify(coords));

            // Update studentPositions directly
            setStudentPositions(prevPositions => ({
                ...prevPositions,
                [studentId]: {
                    x: parseInt(coords[1], 10),
                    y: parseInt(coords[2], 10),
                },
            }));
        }
      }
  };

    
const handleSubmit = async () => {
    const updatedPositions = students.map((student) => ({
        studentId: student._id,
        x: studentPositions[student._id].x,
        y: studentPositions[student._id].y,
    }));

    try {
        await updateSeatingChart(teacherId, classroomId, updatedPositions);
        console.log("Submitted :)")
        // Optionally, you can show a success message to the user
    } catch (error) {
        // Handle any errors
    }
};


    return (
        <> <div className='flex min-h-screen min-w-screen'>
                <div className="w-full" >
                    <h1 className="text-center mt-10 text-header1">Edit Classroom Seating Chart</h1>
                    <h3 className="text-center mt-10 text-header2">🚧 Still in progress 🚧</h3>
                    <div className="flex justify-around my-8">
                        <button className="bg-darkTeal border p-5 h-10 rounded flex items-center">Save & Exit</button>
                        <button className="bg-yellow border p-5 h-10 rounded flex items-center" onClick={handleSubmit} >Save & Keep Working</button>
                        <button className="bg-orange border p-5 h-10 rounded flex items-center" >Unassign All</button>
                        <a className="bg-lightLavender border p-5 h-10 rounded flex items-center" href={`/TESTEditSC/${teacherId}/${classroomId}`}>Refresh</a>

                        
                    </div>
                {classroom ? (
                    <>
                        <div className="flex w-[690px] h-[507px] rounded-[1rem] mr-auto ml-auto border-sandwich border-[3px] bg-darkTeal  " ref={constraintsRef}>
                            <h4 className="relative top-1 left-1/2 transform -translate-x-1/2 h-10 bg-sandwich text-notebookPaper font-body text-body rounded-[1rem] text-center w-96">
                                Smartboard
                            </h4>
                            {/* Classroom layout here */}

                            {assignedStudents.map((studentObj, index) => {

                                console.log("assigned studentObj: " + JSON.stringify(studentObj))
                                
                                const ref = constraintsRef.current;

                                const containerBounds = constraintsRef.current.getBoundingClientRect();
                                const containerWidth = parseFloat(containerBounds.clientWidth);
                                const containerHeight = parseFloat(containerBounds.clientHeight);
                                const initialX = parseFloat(studentObj.seatInfo.x)
                                const initialY = studentObj.seatInfo.y

                                const assignedStudent = students.find(student => student._id === studentObj._id);
                              if(assignedStudent) {

                                

                                return (
                                <motion.div
                                    id={`motion-div-${studentObj._id}`}
                                    dragMomentum={false}
                                    drag
                                    dragElastic={0}
                                    dragPropagation={false}
                                    dragConstraints={constraintsRef}
                                    key={`${studentObj._id}-${index}`}
                                    initial={{ 
                                      x: Math.max(0, initialX),
                                      y: Math.max(0, initialY)
                                   }}
                                    className={`absolute border-4 ${assignedStudent.borderColorClass} p-3 rounded-lg h-[80px] w-[80px] bg-lightYellow`}
                                    onDragEnd={(event, info) => {
                                        console.log("student: "+ studentObj._id + ", x: " + info.point.x + ", y: " + info.point.y)
                                        const containerBounds = constraintsRef.current.getBoundingClientRect();

                                        const containerX = Math.max(0, info.point.x - containerBounds.left)-40;
                                        const containerY = Math.max(0, info.point.y - containerBounds.top)-40
                                        // const containerX = Math.max(0, motionRef.x - containerBounds.left);
                                        // const containerY = Math.max(0, motionRef.y - containerBounds.top

                                        console.log("Dragged to x:",containerX, "y:", containerY, ", for " + assignedStudent.firstName);

                                        handleDragEnd(studentObj._id, containerX, containerY);
                                    }}
                                >
                                    <h1 className="">{assignedStudent.firstName}</h1>
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
                            <div key={`unassigned-${index}`} 
                            onClick={()=>{
                              handleDragEnd(studentId._id, 10, 10)
                            }}
                            
                            className={`p-2 border-2 ${unassignedStudent.borderColorClass}`}>
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