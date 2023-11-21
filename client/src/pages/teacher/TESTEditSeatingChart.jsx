import { useEffect, useState } from "react";
import { useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getTeacherClassroom,
  getAllStudentsClassroom,
  updateSeatingChart,
  getTeacherById
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
        positions[student._id] = {
          x: student.seatInfo.x || null,
          y: student.seatInfo.y || null,
        };
      });

      setStudentPositions(positions);

      // organizing all unassigned seats to an array
      const unassigned = classroom.students.filter(
        (student) => student.seatInfo.x === null || student.seatInfo.y === null
      );
      setUnassignedStudents(unassigned);

      // organizing all assigned seats to an array
      const assigned = classroom.students.filter(
        (student) => student.seatInfo.x !== null && student.seatInfo.y !== null
      );
      setAssignedStudents(assigned);
    } catch (error) {
      console.log("oof error ");
      console.log(error);
    }
  };

  const unassignAll = () => {
    // Reset assigned and unassigned students
    setUnassignedStudents(classroom.students.map((student) => student._id));
    setAssignedStudents([]);

    // Reset coordinates to null in studentPositions
    const nullPositions = {};
    classroom.students.forEach((student) => {
      nullPositions[student._id] = { x: null, y: null };
    });
    setStudentPositions(nullPositions);
  };


  useEffect(() => {
    fetchData();
  }, [teacherId, classroomId, userData]);

  const handleDragEnd = (studentId, x, y) => {
    const motionDiv = document.getElementById(`motion-div-${studentId}`);
    if (motionDiv) {
      const coords = motionDiv.style.transform.match(
        /^translateX\((.+)px\) translateY\((.+)px\) translateZ/
      );

        // Check if the dragged element is in the unassigned section
        const unassignedSection = document.getElementById("unassigned-section");
        console.log(
          "unassignedSection check: ",
          unassignedSection.offsetTop - unassignedSection.offsetHeight * 1.85
        );
        console.log("y: " + y);

        if (
          unassignedSection &&
          y <= unassignedSection.offsetTop &&
          y >=
            unassignedSection.offsetTop - unassignedSection.offsetHeight * 1.5
        ) {
          // Move the student to the unassigned array
          setUnassignedStudents((prevUnassigned) => [
            ...prevUnassigned,
            studentId,
          ]);

          // Remove the student from the assigned array
          setAssignedStudents((prevAssigned) =>
            prevAssigned.filter((assignedId) => assignedId !== studentId)
          );

          // Set the coordinates to null in studentPositions
          setStudentPositions((prevPositions) => ({
            ...prevPositions,
            [studentId]: { x: null, y: null },
          }));
        } else {
          if (coords?.length) {
            console.log("Coords: " + JSON.stringify(coords));
            // Update studentPositions directly
            setStudentPositions((prevPositions) => ({
              ...prevPositions,
              [studentId]: {
                x: parseInt(coords[1], 10),
                y: parseInt(coords[2], 10),
              },
            }));

        }
      }
    }
  };


  // --------- temporary ---------- //
  const handleDivClick = (studentId) => {
    setStudentPositions((prevPositions) => {
      // Find the clicked student in the positions state
      const updatedPositions = { ...prevPositions };
  
      if (studentId in updatedPositions && updatedPositions[studentId].x === null && updatedPositions[studentId].y === null) {
        // Hardcode the coordinates when x and y are null
        updatedPositions[studentId] = { x: 100, y: 100 }; // Change these values accordingly
      }
  
      return updatedPositions;
    });
  };
  // ----------------------------- //

  const handleSubmit = async () => {
    const updatedPositions = students.map((student) => ({
      studentId: student._id,
      x: studentPositions[student._id].x,
      y: studentPositions[student._id].y,
    }));

    try {
      await updateSeatingChart(teacherId, classroomId, updatedPositions);
      console.log("Submitted :)");
      // Optionally, you can show a success message to the user
      // updateUser({
      //   classrooms: [{ _id: classroomId, students: updatedPositions }],
      // });

      const updatedUserData = await getTeacherById(teacherId);
    updateUser(updatedUserData);
      
    } catch (error) {
      // Handle any errors
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
              onClick={handleSubmit}
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
                className="flex w-[690px] h-[65%] rounded-[1rem] mr-auto ml-auto border-sandwich border-[5px]"
                ref={constraintsRef}
              >
                {/* <h4 className="relative top-1 left-1/2 transform -translate-x-1/2 h-10 bg-sandwich font-body text-body rounded-[1rem] text-center w-96">
                  Smartboard
                </h4> */}
                {/* Classroom layout here */}

                {assignedStudents.map((studentObj, index) => {
                  const initialX = studentObj.seatInfo.x;
                  const initialY = studentObj.seatInfo.y;

                  const assignedStudent = students.find(
                    (student) => student._id === studentObj._id
                  );
                  if (assignedStudent) {
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
                          y: Math.max(0, initialY),
                        }}
                        className={`absolute border-4 ${assignedStudent.borderColorClass} rounded-lg h-[80px] w-[80px] `}
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

                          handleDragEnd(studentObj._id, containerX, containerY);
                        }}
                      >
                        <h1 className="flex h-full text-center flex-col-reverse bg-lightLavender"><span className="bg-white">{assignedStudent.firstName}</span></h1>
                      </motion.div>
                    );
                  } else {
                    return null;
                  }
                })}
                  <div id="unassigned-section" className="flex self-end h-[150px] w-[680px] bg-lightBlue flex-col">
                    <h2 className="pt-3 pl-3 text-header2">Unassigned Students</h2>
                    <div className="flex-wrap flex flex-row  p-2 rounded">
                      {unassignedStudents.map((studentId, index) => {
                        const unassignedStudent = students.find(
                          (student) => student._id === studentId._id
                        );

                        if (unassignedStudent) {
                          return (
                            <motion.div
                              id={`motion-div-${studentId._id}`}
                              key={`unassigned-${index}`}
                              dragMomentum={false}
                              drag
                              dragElastic={0}
                              dragConstraints={constraintsRef}
                              onClick={() => {
                                handleDivClick(studentId._id);
                              }}
                              className={`mx-1 border-4 ${unassignedStudent.borderColorClass} rounded-lg h-[80px] w-[80px]`}
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
