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
  addFurniture,
  updateFurniturePositions
} from "../../api/teachersApi";
import { getBorderColorClass } from "../../components/classRoomColors";
import { useNavigate } from "react-router-dom";
import furnitureShapes from "../../data/furnitureShapes";
import AddStudentModal from "../../components/AddStudentsToClass";


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
  const [furniturePositions, setFurniturePositions] = useState({});

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
        positions[student.student] = {
          x: student.seatInfo.x,
          y: student.seatInfo.y,
          assigned: student.seatInfo.assigned,
        };
      });

      setStudentPositions(positions);

      // organizing all unassigned seats to an array
      const unassigned = classroom.students.filter(
        (student) => student.seatInfo.assigned === false
      );
      setUnassignedStudents(unassigned);
      // organizing all assigned seats to an array
      const assigned = classroom.students.filter(
        (student) => student.seatInfo.assigned
      );
      setAssignedStudents(assigned);
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
    //   nullPositions[student.student] = { assigned: false };
    // });
    // setStudentPositions(nullPositions);
  };

  useEffect(() => {
    fetchData();
  }, [teacherId, classroomId]);

  const handleDragEnd = (itemId, key, y) => {
    const unassignedSection = document.getElementById(`unassigned-section`);
    let studentCoords = null;
    let furnishCoords = null;
    
    if(key === "furniture") {
      const furnitureDiv = document.getElementById(`furniture-${itemId}`);
      furnishCoords = furnitureDiv.style.transform.match(
        /^translateX\((.+)px\) translateY\((.+)px\) translateZ/
      );
      
    } else {
      const motionDiv = document.getElementById(`motion-div-${itemId}`);
      studentCoords = motionDiv.style.transform.match(
        /^translateX\((.+)px\) translateY\((.+)px\) translateZ/
      );
    }
    
    

      if (key === "furniture") {
        setFurniturePositions((prevPositions) => ({
          ...prevPositions,
          [itemId]: {
            x: parseInt(furnishCoords[1]),
            y: parseInt(furnishCoords[2]),
            assigned: true,
          },
        }))
      
    // Check if the assigned element moves to the unassigned section
   } else if (
      unassignedSection &&
      y <= unassignedSection.offsetTop &&
      y >= unassignedSection.offsetTop - unassignedSection.offsetHeight * 1.5
    ) {

      setStudentPositions((prevPositions) => ({
        ...prevPositions,
        [itemId]: {
          x: parseInt(studentCoords[1]),
          y: parseInt(studentCoords[2]),
          assigned: false,
        },
      }));
    } else {
      // if moving student from unassigned to assigned area
      // FIXME: Still doesn't save on exact coordinate placement for some reason
      if (studentCoords?.length && key === "unassigned") {
        const unassignedX = parseInt(studentCoords[1]) + unassignedSection.offsetLeft;
        const unassignedY = parseInt(studentCoords[2]) + unassignedSection.offsetTop;
        setStudentPositions((prevPositions) => ({
          ...prevPositions,
          [itemId]: {
            x: parseInt(unassignedX),
            y: parseInt(unassignedY),
            assigned: true,
          },
        }));
      // moving just inside the classroom and assigned (true); state does not change
      } else {
        setStudentPositions((prevPositions) => ({
          ...prevPositions,
          [itemId]: {
            x: parseInt(studentCoords[1]),
            y: parseInt(studentCoords[2]),
            assigned: true,
          },
        }));
      }
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
    const updatedFurniturePositions = Object.keys(furniturePositions).map((itemId) => {
      const furniture = furniturePositions[itemId];
      return {
        itemId,
        x: furniture.x,
        y: furniture.y,
        assigned: furniture.assigned,
      };
    });
    try {
      await updateSeatingChart(teacherId, classroomId, updatedPositions);
      await updateFurniturePositions(teacherId, classroomId, updatedFurniturePositions);
      console.log("Submitted :)");

      // updateUser({
      //   classrooms: [{ _id: classroomId, students: updatedPositions }],
      // });
      const updatedUserData = await getTeacherById(teacherId);
      updateUser(updatedUserData);

    } catch (error) {
      console.log("Ooops didnt work");
    }
  };

  const determineShape = (furnitureName) => {
    switch (furnitureName) {
      case 'Smartboard':
      case 'Chalkboard':
        return furnitureShapes.longBar;
      case 'Door':
      case 'Window':
        return furnitureShapes.shortBar;
      case 'Teacher\'s Desk':
      case 'Bookcase':
      case 'Table':
        return furnitureShapes.rectangle;
      case 'Empty Desk':
        return furnitureShapes.square;
      default:
        return furnitureShapes.rectangle;
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
            <button
              className="bg-orange border p-5 h-10 rounded flex items-center"
              onClick={unassignAll}
            >
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
                {classroom.furniture.map((item, index) => {
                  const shape = determineShape(item.name);
                  const initialX = item.x;
                  const initialY = item.y;
                  return (
                    <motion.div
                      id={`furniture-${item._id}`}
                      key={`${item._id}`}
                      dragMomentum={false}
                      initial={{
                        x: Math.max(0, initialX),
                        y: Math.max(0, initialY),
                      }}
                      drag
                      dragElastic={0}
                      dragPropagation={false}
                      dragConstraints={constraintsRef}
                      onDragEnd={() => handleDragEnd(item._id, "furniture")}
                      // onClick={() => {
                      //   // Update rotation on click, e.g., rotate by 180 degrees
                      //   setFurniturePositions((prevPositions) => ({
                      //     ...prevPositions,
                      //     [item._id]: {
                      //       x: prevPositions[item._id].x,
                      //       y: prevPositions[item._id].y,
                      //       assigned: true,
                      //       rotation: (prevPositions[item._id].rotation || 0) + 180,
                      //     },
                      //   }));
                      // }}
                      className={`absolute border-4 border-[#734e2a] rounded bg-[#c7884a]`}
                    >
                      <h3 className="flex w-full text-center justify-center items-center h-full break-words">
                        {item.name}
                      </h3>
                    </motion.div>
                  );
                })}

                {assignedStudents.map((studentObj, index) => {
                  const initialX = studentObj.seatInfo.x;
                  const initialY = studentObj.seatInfo.y;

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
                        onClick={() => console.log("click")}
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
                          handleDragEnd(
                            studentObj.student,
                            "assigned",
                            containerY
                          );
                        }}
                      >
                        <h3 className="flex h-full text-center flex-col-reverse bg-lightLavender">
                          <span className="bg-white">
                            {assignedStudent.firstName}
                          </span>
                        </h3>
                      </motion.div>
                    );
                  } else {
                    return null;
                  }
                })}
                <div className="flex self-end w-full justify-center my-4">
                {/* Unassigned Section */}
                  <div
                    id="unassigned-section"
                    className="flex h-[100px] w-[580px] flex-col rounded border-4 border-darkSandwich"
                  >
                    <h2 className="flex justify-center items-center h-full font-semibold text-header2">
                      Remove Student(s) from Class
                    </h2>
                  </div>
                </div>
              </div>
            </>
          ) : (
            "Loading..."
          )}
          <div className="flex flex-row flex-wrap p-2">
            <AddStudentModal unassignedStudents={unassignedStudents} students={students}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default TESTEditSeatingChart;
