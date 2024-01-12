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
import { getBackgroundColorClass } from "../../components/classRoomColors";
import { useNavigate } from "react-router-dom";
import AddStudentModal from "../../components/SeatingChart/StudentRosterModal";
import RosterImg from "../../images/Three People.png"
import FurnitureImg from "../../images/Desk.png"
import ClassroomFurniture from "../../components/SeatingChart/ClassroomFurniture";
import AssignedStudent from "../../components/SeatingChart/AssignedStudent";
import FurnitureModal from "../../components/SeatingChart/FurnitureModal";

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

  const [showStudentRosterModal, setShowStudentRosterModal] = useState(false);
  const [showFurnitureModal, setShowFurnitureModal] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([]);


  const handleStudentClick = (currentStudentObj) => {
    // Toggle the selected state of the student
    setSelectedStudents((prevSelected) => {
  
      if (prevSelected.some((student) => student.student === currentStudentObj.student)) {
        // If student is already selected, remove the entire object
        return prevSelected.filter((student) => student.student !== currentStudentObj.student);
      } else {
        // If student is not selected, add them
        return [...prevSelected, currentStudentObj];
      }
    });
  };

  const handleRemoveStudents = async () => {
    try {
      // Move selected students to the unassigned array
      const updatedUnassignedStudents = [
        ...unassignedStudents,
        ...assignedStudents.filter((student) =>
          selectedStudents.includes(student.student)
        ),
      ];

      console.log("Updated Unassigned : " + JSON.stringify(updatedUnassignedStudents)) 
  
      // Remove selected students from assigned array
      const updatedAssignedStudents = assignedStudents.filter(
        (student) => !selectedStudents.includes(student.student)
      );

      console.log("Updated Assigned: " + JSON.stringify(updatedAssignedStudents))
  
      // Update the local state immediately
      setUnassignedStudents(updatedUnassignedStudents);
      setAssignedStudents(updatedAssignedStudents);
  
      // Clear the selected students
      setSelectedStudents([]);
  
      // Prepare data for backend update
      const updatedPositions = updatedAssignedStudents.map((student) => ({
        student: student.student,
        seatInfo: {
          x: student.seatInfo.x,
          y: student.seatInfo.y,
          assigned: student.seatInfo.assigned,
          rotation: student.seatInfo.rotation || 0,
        },
      }));
  
      // Update the backend data immediately
      await updateSeatingChart(teacherId, classroomId, updatedPositions);
  
      console.log("Students unassigned and saved successfully!");
    } catch (error) {
      console.error("Error removing and saving students:", error);
    }
  };

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
            student.borderColorClass = getBackgroundColorClass(zor);
          } else if (lastCheckin && lastCheckin.ZOR) {
            const zor = lastCheckin.ZOR;
            student.borderColorClass = getBackgroundColorClass(zor);
          } else {
            student.borderColorClass = "darkSandwich";
          }
        } else {
          student.borderColorClass = "darkSandwich";
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

  const handleConfirmModal = () => {
    // Copy the current state of assigned and unassigned students
    const newAssignedStudents = [...assignedStudents];
    const newUnassignedStudents = [...unassignedStudents];
    
    // Iterate over selected students and move them from unassigned to assigned
    selectedStudents.forEach((studentId) => {
      const student = newUnassignedStudents.find(
        (unassignedStudent) => unassignedStudent.student === studentId
      );
  
      console.log("student in removing studnet for unassigned: " + JSON.stringify(student))
      if (student) {
        // Remove from unassigned
        newUnassignedStudents.splice(
          newUnassignedStudents.indexOf(student),
          1
        );
  
        // Add to assigned
        newAssignedStudents.push(student);
      }
    });
  
    // Update state with the new assigned and unassigned students
    setAssignedStudents(newAssignedStudents);
    setUnassignedStudents(newUnassignedStudents);
  
    // Clear the selected students
    setSelectedStudents([]);
    console.log("WOOO: " + JSON.stringify(newAssignedStudents) + "< " + JSON.stringify(newUnassignedStudents))

    // Optional: You might want to update the backend here as well
    // Call your backend API to update the seating chart with the new data
    updateSeatingChart(teacherId, classroomId, /* Updated positions data */);
  
    // Log for confirmation
    console.log("Students assigned successfully!");
  };

  useEffect(() => {
    console.log("Unassigned studnetsss: " + JSON.stringify(unassignedStudents))
    
    fetchData();
  }, [teacherId, classroomId]);

  const handleDragEnd = (itemId, key, y) => {
    let studentCoords = null;
    let furnishCoords = null;
    
    if (constraintsRef.current) {

    if(key === "furniture") {
      const furnitureDiv = document.getElementById(`furniture-${itemId}`);
      furnishCoords = furnitureDiv.style.transform.match(/translateX\(([^)]+)px\) translateY\(([^)]+)px\)/);

      console.log("furnish coords: " + furnishCoords)

        if (furnishCoords) {
        setFurniturePositions((prevPositions) => ({
          ...prevPositions,
          [itemId]: {
            x: parseInt(furnishCoords[1]),
            y: parseInt(furnishCoords[2]),
            assigned: true,
            rotation: furniturePositions[itemId]?.rotation,
          },
        }))
      } else {
        console.log("woops, no furnished coords")
      }
      
    } else {
      const motionDiv = document.getElementById(`motion-div-${itemId}`);
      studentCoords = motionDiv.style.transform.match(
        /^translateX\((.+)px\) translateY\((.+)px\) translateZ/
      );

      if (studentCoords?.length) {
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
    }
  };

  const handleSave = async () => {
    const updatedPositions = students.map((student) => ({
        student: student._id,
        seatInfo: {
        x: studentPositions[student._id].x,
        y: studentPositions[student._id].y,
        assigned: studentPositions[student._id].assigned,
      }
    }));

    const updatedFurniturePositions = Object.keys(furniturePositions).map((itemId) => {

      const furniture = furniturePositions[itemId];
      console.log("furniture: " + JSON.stringify(furniture))
      return {
        itemId,
        x: furniture.x,
        y: furniture.y,
        assigned: furniture.assigned,
        rotation: furniture.rotation || 0,
      };
    });

    console.log("updated funriture positions: " + JSON.stringify(updatedFurniturePositions))

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

  return (
    <>
      {" "}
      <div className="flex min-h-screen min-w-screen">
        <div className="flex flex-col w-full items-center">
          <h1 className="text-center mt-10 text-header1">
            Edit Classroom Seating Chart
          </h1>

          {classroom ? (
            <>
              <div
                className="flex w-[752px] h-[61%] rounded-[1rem] mt-10 mr-auto ml-auto border-[#D2C2A4] border-[8px]"
                ref={constraintsRef}
              >
                {/* Classroom layout here */}

                <ClassroomFurniture
                  classroom={classroom}
                  setFurniturePositions={setFurniturePositions}
                  furniturePositions={furniturePositions}
                  constraintsRef={constraintsRef}
                  handleDragEnd={handleDragEnd}
                />

                <AssignedStudent
                  assignedStudents={assignedStudents}
                  students={students}
                  constraintsRef={constraintsRef}
                  selectedStudents={selectedStudents}
                  handleStudentClick={handleStudentClick}
                  handleDragEnd={handleDragEnd}
                />
                <div className="flex self-end w-full justify-center mb-8">
                  {/* Unassigned Section */}
                  <button
                    id="unassigned-section"
                    className="flex items-center h-[90px] w-[580px] flex-col rounded-2xl border-4 border-darkSandwich"
                    onClick={handleRemoveStudents}
                  >
                    <h2 className="flex items-center h-full font-semibold text-header2 bg-lightLavender">
                      Remove Student(s) from Class
                    </h2>
                  </button>
                </div>
              </div>
            </>
          ) : (
            "Loading..."
          )}

          {showStudentRosterModal && (
            <AddStudentModal
              setShowStudentRosterModal={setShowStudentRosterModal}
              unassignedStudents={unassignedStudents}
              students={students}
              onConfirm={handleConfirmModal}
            />
          )}
          {showFurnitureModal && (
            <FurnitureModal
              setShowFurnitureModal={setShowFurnitureModal}
              classroom={classroom}
              teacherId={teacherId}
              classroomId={classroomId}
              onConfirm={handleConfirmModal}
            />
          )}

          <div className="flex flex-row w-full justify-around mt-10">

            {/* Open Choose Students Modal */}
            <button
              onClick={() => setShowStudentRosterModal(!showStudentRosterModal)}
              className="flex flex-row justify-around items-center px-[24px] border-4 border-[#D2C2A4] rounded-xl"
            >
              <h5 className="text-[24px]">Student Roster</h5>
              <img src={RosterImg} />
            </button>

            {/* Open Choose Furniture Modal */}
            <button className="flex flex-row justify-around items-center px-[24px] border-4 border-[#D2C2A4] rounded-xl" onClick={() => setShowFurnitureModal(true)}>
              <h5 className="text-[24px]">Classroom Objects</h5>
              <img src={FurnitureImg} />
            </button>
          </div>
          <div className="flex w-full justify-around max-w-3xl">
            <button
              className="bg-yellow border p-5 my-8 h-10 rounded flex items-center"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TESTEditSeatingChart;
