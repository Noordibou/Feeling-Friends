import { useEffect, useState } from "react";
import { useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getTeacherClassroom,
  getAllStudentsClassroom,
  updateSeatingChart,
  getTeacherById,
  addFurniture
} from "../../api/teachersApi";
import { getBorderColorClass } from "../../components/classRoomColors";
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

  const [studentPositions, setStudentPositions] = useState({});

  const fetchData = async () => {
    try {
      const classroom = userData.classrooms.find((c) => c._id === classroomId);
      setClassroom(classroom);
      const classroomStudents = await getAllStudentsClassroom(
        teacherId,
        classroomId
      );

      console.log("unassigned: " + JSON.stringify(unassignedStudents))

      // Calculate the border color for each student
      const studentsWithBorderColor = classroomStudents.map((student) => {
        const lastJournal =
          student.journalEntries[student.journalEntries.length - 1];
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
            student.borderColorClass = "border-graphite";
          }
        } else {
          student.borderColorClass = "border-graphite";
        }

        return student;
      });

      setStudents(studentsWithBorderColor);
      const positions = {};
      classroom.students.forEach((student) => {
        positions[student.student] = {
          x: student.seatInfo.x,
          y: student.seatInfo.y,
          assigned: student.seatInfo.assigned,
        };
      });


      setStudentPositions(positions);
      console.log("positions " + JSON.stringify(studentPositions) )

      // organizing all unassigned seats to an array
      const unassigned = classroom.students.filter(
        (student) => student.seatInfo.assigned === false
      );
      setUnassignedStudents(unassigned);
      console.log("unassigned students on page refresh: " + JSON.stringify(unassigned))

      // organizing all assigned seats to an array
      const assigned = classroom.students.filter(
        (student) => student.seatInfo.assigned
      );
      setAssignedStudents(assigned);
      console.log("assigned students on page refresh: " + JSON.stringify(assigned))

    } catch (error) {
      console.log("oof error ");
      console.log(error);
    }
  };

  // FIXME: need to fix so that it only updates the assigned boolean
  const unassignAll = () => {
    // Reset assigned and unassigned students
    setUnassignedStudents(classroom.students.map((student) => student.student));
    setAssignedStudents([]);

    // Reset coordinates to null in studentPositions
    // const nullPositions = {};
    // classroom.students.forEach((student) => {
    //   nullPositions[student.student] = { x: null, y: null };
    // });
    // setStudentPositions(nullPositions);
  };


  useEffect(() => {
    fetchData();


  }, [teacherId, classroomId]);

// TODO: make it so that when it's reassigned, 
  const handleDragEnd = (studentId, key, y) => {
    console.log("It has been dragged: ", studentId);
    const motionDiv = document.getElementById(`motion-div-${studentId}`);
    const coords = motionDiv.style.transform.match(
      /^translateX\((.+)px\) translateY\((.+)px\) translateZ/
    );
    console.log("Coords: ", JSON.stringify(coords));
    const unassignedSection = document.getElementById(`unassigned-section`);

    // Check if the dragged element moves to the unassigned section
    if (
      unassignedSection &&
      y <= unassignedSection.offsetTop &&
      y >= unassignedSection.offsetTop - unassignedSection.offsetHeight * 1.5
    ) {
      console.log("hello is this being unassigned??");
      console.log("total offset: " + unassignedSection.offsetHeight * 1.5)
      // Move the student to the unassigned array
      setUnassignedStudents((prevUnassigned) => [...prevUnassigned, studentId]);

      // Remove the student from the assigned array
      setAssignedStudents((prevAssigned) =>
        prevAssigned.filter((assignedId) => {
          console.log("assignedID & student id: " + assignedId + ", " + studentId)
          return assignedId !== studentId
        
        })
      );



      // Set the coordinates to null in studentPositions
      setStudentPositions((prevPositions) => ({
        ...prevPositions,
        [studentId]: { 
          x: parseInt(coords[1]),
          y: parseInt(coords[2]), 
          assigned: false
        },
      }));
      console.log("student id is okay here right? " + studentId)
      console.log("student positions after moving to unassigned section: " + parseInt(coords[1])  + ", " + parseInt(coords[2]))
      console.log("Is it being saved correctly? student positions: " + JSON.stringify(studentPositions))
    } 
    else {
      
      // if there's coordinates and the key value on the element is unassigned (started in the unassigned area)
      if (coords?.length && key === "unassigned") {
        console.log("Coords 2: " + JSON.stringify(coords));
        console.log(typeof coords);
        console.log("But I may be wrong and it hits here??")
        console.log("offset left and top: " + parseInt(Math.abs(coords[1] - unassignedSection.offsetLeft)) + ", " + parseInt(Math.abs(coords[2]) - unassignedSection.offsetTop))
        const unassignedX = parseInt(coords[1]) + unassignedSection.offsetLeft;
        const unassignedY = parseInt(coords[2]) + unassignedSection.offsetTop;
        console.log("unassigned x and  y : ", unassignedX, ", ", unassignedY)
        // const unassignedX = 250
        // const unassignedY = 250
        // Update studentPositions directly
        setStudentPositions((prevPositions) => ({
          ...prevPositions,
          [studentId]: {
            x: parseInt(unassignedX),
            y: parseInt(unassignedY),
            assigned: true
          },
        }));
        console.log("student id is okay here right? " + studentId)
        console.log("Is it being saved correctly #2? student positions: " + JSON.stringify(studentPositions))

        
        // console.log("student Positions: " + JSON.stringify(studentPositions));
        // console.log("User data: " + JSON.stringify(userData))
      } else {
        console.log("Should hit here hmmm")
        // Update studentPositions directly
      setStudentPositions((prevPositions) => ({
        ...prevPositions,
        [studentId]: {
          x: parseInt(coords[1]),
          y: parseInt(coords[2]),
          assigned: true
        },
      }));
      console.log("student id: "  +studentId)
      console.log("Is it being saved correctly #3? student positions: " + JSON.stringify(studentPositions))

      // Now, update the assigned students state
      // setAssignedStudents((prevAssigned) =>
      //   [...prevAssigned, studentId]
      // );
      }
      console.log("ASSIGNED STUDNETS SHOUDL WORK/???: " + JSON.stringify(assignedStudents))
      
    }
  };

  const handleSave = async () => {
    const updatedPositions = students.map((student) => {
      const updatedPosition = {
        student: student._id,
        x: studentPositions[student._id].x,
        y: studentPositions[student._id].y,
        assigned: studentPositions[student._id].assigned,
      };
      

      
      return updatedPosition;
    });
    console.log("Updated Position for Student:", updatedPositions);
    try {
      await updateSeatingChart(teacherId, classroomId, updatedPositions);
      console.log("Submitted :)");

      // updateUser({
      //   classrooms: [{ _id: classroomId, students: updatedPositions }],
      // });

      const updatedUserData = await getTeacherById(teacherId);
      console.log("updated user data: " + JSON.stringify(updatedUserData))
      
      updateUser(updatedUserData);
      // console.log("userData: " + JSON.stringify(userData))
      
    } catch (error) {
        console.log("Ooops didnt work")
    }
  };

// FIXME: Saving furniture doesnt yet work
const handleAddFurniture = async () => {
  const furnitureData = {
      // Structure your furniture data here according to server expectations
      // For example:
      name: "Desk",
      x: 100, 
      y: 150,
      assigned: true
  };
  console.log("teacher id, classroom id, furniture data: " + teacherId, + " " + classroomId + " " + furnitureData)
    try {
      console.log("oh hey")
        const response = await addFurniture(teacherId, classroomId, furnitureData);
        console.log("Furniture added successfully!", response);
        // Optionally, you can update the local state or perform any additional actions.
    } catch (error) {
        console.error("Error adding furniture:", error);
        // Handle any errors.
    }
};

  return (
    <>
      {" "}
      <div className="flex min-h-screen min-w-screen">
        <div className="flex flex-col w-full items-center">
          <h1 className="text-center mt-10 text-header1">
            Edit Classroom Seating Chart
          </h1>
          <div className="flex w-full justify-around my-8 max-w-3xl">
            <button
              className="bg-yellow border p-5 h-10 rounded flex items-center"
              onClick={handleSave}
            >
              Save
            </button>
            <button className="bg-orange border p-5 h-10 rounded flex items-center" onClick={unassignAll}>
              Unassign All
            </button>
            <a
              className="bg-lightLavender border p-5 h-10 rounded flex items-center"
              href={`/TESTEditSC/${teacherId}/${classroomId}`}
            >
              Refresh
            </a>
          </div>
          {classroom ? (
            <>
              <div
                className="flex w-[690px] h-[75%] rounded-[1rem] mr-auto ml-auto border-sandwich border-[5px]"
                ref={constraintsRef}
              >
                {/* Classroom layout here */}
                <motion.div
                  dragMomentum={false}
                  drag
                  dragElastic={0}
                  dragPropagation={false}
                  dragConstraints={constraintsRef}
                  onDragEnd={handleAddFurniture}
                  className="absolute border-4 border-[#734e2a] w-28 h-20 rounded bg-[#c7884a]"
                >
                  <h3 className="flex text-center items-center h-full break-words">Teacher's Desk</h3>
                </motion.div>
                {assignedStudents.map((studentObj, index) => {
                  const initialX = studentObj.seatInfo.x;
                  const initialY = studentObj.seatInfo.y;
                  console.log("studentObj: " + JSON.stringify(studentObj))
                  
                  const assignedStudent = students.find(
                    (student) => student._id === studentObj.student
                  );
                  if (assignedStudent) {
                    return (
                      <motion.div
                        id={`motion-div-${studentObj.student}`}
                        dragMomentum={false}
                        drag
                        dragElastic={0}
                        dragPropagation={false}
                        dragConstraints={constraintsRef}
                        key={`${studentObj.student}-${index}`}
                        initial={{
                          x: Math.max(0, initialX),
                          y: Math.max(0, initialY),
                        }}
                        className={`absolute mx-1 border-4 ${assignedStudent.borderColorClass} rounded-lg h-[80px] w-[80px] `}
                        onDragEnd={(event, info) => {
                          const containerBounds =
                            constraintsRef.current.getBoundingClientRect();

                          const containerX =
                            Math.max(0, info.point.x - containerBounds.left) -
                            40;
                          const containerY =
                            Math.max(0, info.point.y - containerBounds.top) -
                            40;
                          console.log(
                            "Dragged to x:",
                            containerX,
                            "y:",
                            containerY,
                            ", for " + assignedStudent.firstName
                          );

                          handleDragEnd(studentObj.student, "assigned", containerY);
                        }}
                      >
                        <h3 className="flex h-full text-center flex-col-reverse bg-lightLavender"><span className="bg-white">{assignedStudent.firstName}</span></h3>
                      </motion.div>
                    );
                  } else {
                    return null;
                  }
                })}
                  <div id="unassigned-section" className="flex self-end h-[200px] w-[680px] bg-lightBlue flex-col">
                    <h2 className="pt-3 pl-3 text-header2">Unassigned Students</h2>
                    <div className="flex-wrap flex flex-row  p-2 rounded">
                      {unassignedStudents.map((studentId, index) => {
                        const unassignedStudent = students.find(
                          (student) => student._id === studentId.student
                        );

                        if (unassignedStudent) {
                          return (
                            <motion.div
                              id={`motion-div-${unassignedStudent._id}`}
                              key={`unassigned-${index}`}
                              dragMomentum={false}
                              drag
                              dragElastic={0}
                              dragConstraints={constraintsRef}
                              onDragEnd={() => {
                                
                                
                                handleDragEnd(unassignedStudent._id, "unassigned")
                              
                              }}
                              className={`relative mx-1 border-4 ${unassignedStudent.borderColorClass} rounded-lg h-[80px] w-[80px]`}
                            >
                              <h1 className="flex h-full text-center flex-col-reverse bg-lightYellow"><span className="bg-white">{unassignedStudent.firstName}</span></h1>
                            </motion.div>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                </div>
              </div>
              
            </>
          ) : (
            "Loading..."
          )}
          {/* Unassigned Students */}

        </div>
      </div>
    </>
  );
};

export default TESTEditSeatingChart;
