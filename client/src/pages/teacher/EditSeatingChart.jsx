import { useEffect, useState } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getAllStudentsClassroom,
  updateSeatingChart,
  getTeacherById,
  updateFurniturePositions,
  deleteFurniture,
} from "../../api/teachersApi";
import { applyColorsToStudents } from "../../utils/editSeatChartUtil";
import AddStudentModal from "../../components/SeatingChart/StudentRosterModal";
import ClassroomFurniture from "../../components/SeatingChart/ClassroomFurniture";
import AssignedStudent from "../../components/SeatingChart/AssignedStudent";
import FurnitureModal from "../../components/SeatingChart/FurnitureModal";
import TeacherNavbar from "../../components/TeacherNavbar";
import ClassInfoNavbar from "../../components/ClassInfoNavbar";
import saveButton from "../../images/button.png";
import RosterImg from "../../images/Three People.png";
import FurnitureImg from "../../images/Desk.png";
import openRosterImg from "../../images/ThreePplLight.png";
import openFurnitureImg from "../../images/DeskImgLight.png";
import MsgModal from "../../components/SeatingChart/MsgModal";
import ButtonView from "../../components/ButtonView";

const EditSeatingChart = () => {
  const { teacherId, classroomId } = useParams();
  const { userData, updateUser } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const constraintsRef = useRef(null);

  const [assignedStudents, setAssignedStudents] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);

  const [studentPositions, setStudentPositions] = useState({});
  const [furniturePositions, setFurniturePositions] = useState({});

  const [showStudentRosterModal, setShowStudentRosterModal] = useState(false);
  const [showFurnitureModal, setShowFurnitureModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [counter, setCounter] = useState(0);
  const [showMsg, setShowMsg] = useState(false);
  const [noStudentMsg, setNoStudentMsg] = useState(false);

  const handleRemoveObject = async () => {
    if (selectedStudents.length > 0) {
      try {
        // Update the backend data immediately
        await updateSeatingChart(teacherId, classroomId, selectedStudents);
        setSelectedStudents([]);
        console.log("Students unassigned and saved successfully!");
      } catch (error) {
        console.error("Error removing and saving students: ", error);
      }
    }
    if (selectedItems.length > 0) {
      try {
        await deleteFurniture(teacherId, classroomId, selectedItems);
        setSelectedItems([]);
        console.log("Furniture removed successfully!");
      } catch (error) {
        console.error("Error removing and removing furniture items: ", error);
      }
    }
    updateInfo();
  };

  const refreshData = async () => {
    try {
      const classroom = userData.classrooms.find((c) => c._id === classroomId);
      setClassroom(classroom);
      const classroomStudents = await getAllStudentsClassroom(
        teacherId,
        classroomId
      );

      const studentsWithBorderColor = applyColorsToStudents(classroomStudents);

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
        (student) => student.seatInfo.assigned === true
      );
      setAssignedStudents(assigned);
    } catch (error) {
      console.log("oof error ");
      console.log(error);
    }
  };

  const updateInfo = async () => {
    const updatedUserData = await getTeacherById(teacherId);
    updateUser(updatedUserData);
    refreshData();
    setCounter(counter + 1);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refreshData();
  }, [counter]);

  useEffect(() => {
    if (assignedStudents.length === 0) {
      setNoStudentMsg(true);
    } else {
      setNoStudentMsg(false);
    }
  }, [assignedStudents]);

  const handleDragEnd = (itemId, key, y) => {
    let studentCoords = null;
    let furnishCoords = null;

    if (constraintsRef.current) {
      if (key === "furniture") {
        const furnitureDiv = document.getElementById(`furniture-${itemId}`);
        furnishCoords = furnitureDiv.style.transform.match(
          /translateX\(([^)]+)px\) translateY\(([^)]+)px\)/
        );

        console.log("furnish coords: " + furnishCoords);
        console.log("furniture rotation: " + furniturePositions[itemId]?.rotation)

        if (furnishCoords) {
          setFurniturePositions((prevPositions) => ({
            ...prevPositions,
            [itemId]: {
              x: parseInt(furnishCoords[1]),
              y: parseInt(furnishCoords[2]),
              assigned: true,
              rotation: furniturePositions[itemId]?.rotation || classroom.furniture[itemId]?.rotation,
            },
          }));
        } else {
          console.log("woops, no furnished coords");
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
      },
    }));

    const updatedFurniturePositions = Object.keys(furniturePositions).map(
      (itemId) => {
        const furniture = furniturePositions[itemId];
        const furnitureItem = classroom.furniture.find(item => item._id === itemId);
        const furnitureRotation = furnitureItem?.rotation;

        return {
          itemId,
          x: furniture.x,
          y: furniture.y,
          assigned: furniture.assigned,
          rotation: furniture.rotation || furnitureRotation,
        };
      }
    );

    console.log(
      "updated funriture positions: " +
        JSON.stringify(updatedFurniturePositions)
    );

    try {
      await updateSeatingChart(teacherId, classroomId, updatedPositions);
      await updateFurniturePositions(
        teacherId,
        classroomId,
        updatedFurniturePositions
      );
      // Show brief save message for 3 secs
      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
      }, 2500);
      updateInfo();
    } catch (error) {
      console.log("Ooops didnt work");
    }
  };

  return (
    <>
      {" "}
      <div className="flex min-h-screen min-w-screen justify-center">
        <div className="flex flex-col w-full items-center max-w-3xl h-screen">
          <ClassInfoNavbar teacherId={teacherId} classroomId={classroomId} />

          {classroom ? (
            <>
              <div
                className="flex w-[752px] h-[61%] rounded-[1rem] mt-3 mr-auto ml-auto border-[#D2C2A4] border-[8px] shadow-2xl"
                ref={constraintsRef}
              >
                {/* Classroom layout here */}

                <ClassroomFurniture
                  classroom={classroom}
                  setFurniturePositions={setFurniturePositions}
                  furniturePositions={furniturePositions}
                  constraintsRef={constraintsRef}
                  handleDragEnd={handleDragEnd}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />

                <AssignedStudent
                  assignedStudents={assignedStudents}
                  setSelectedStudents={setSelectedStudents}
                  students={students}
                  constraintsRef={constraintsRef}
                  selectedStudents={selectedStudents}
                  handleDragEnd={handleDragEnd}
                />
                <div className="flex self-end w-full justify-center mb-8">
                  {/* Unassigned Section */}
                  <button
                    id="unassigned-section"
                    className="flex items-center h-[80px] w-[550px] flex-col rounded-2xl border-4 border-darkSandwich"
                    onClick={handleRemoveObject}
                  >
                    <h2 className="flex items-center h-full font-semibold text-[24px] font-[Poppins]">
                      Remove from Class
                    </h2>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex w-[752px] h-[61%] rounded-[1rem] mt-3 mr-auto ml-auto border-[#D2C2A4] border-[8px] shadow-2xl">
              {/* placeholder for now */}
              <div className={`absolute mt-[250px] px-32 -ml-10`}>
                <h4 className="text-black font-[Poppins] text-[32px] text-center font-semibold bg-notebookPaper">
                  Sorry, this feature is not available right now. Please try
                  again later
                </h4>
              </div>
            </div>
          )}

          {showStudentRosterModal && (
            <AddStudentModal
              setShowStudentRosterModal={setShowStudentRosterModal}
              unassignedStudents={unassignedStudents}
              students={students}
              teacherId={teacherId}
              classroomId={classroomId}
              updateInfo={updateInfo}
            />
          )}
          {showFurnitureModal && (
            <FurnitureModal
              setShowFurnitureModal={setShowFurnitureModal}
              classroom={classroom}
              teacherId={teacherId}
              classroomId={classroomId}
              updateInfo={updateInfo}
            />
          )}

          <div className="flex flex-row w-full justify-between mt-10">
            {/* Open Choose Students Modal */}

            <ButtonView
              buttonText="Student Roster"
              defaultBtnImage={RosterImg}
              btnImageWhenOpen={openRosterImg}
              handleClick={() => {
                setShowStudentRosterModal(!showStudentRosterModal);
                setShowFurnitureModal(false);
              }}
              isSelected={showStudentRosterModal}
            />

            {/* Open Choose Furniture Modal */}

            <ButtonView
              buttonText="Classroom Objects"
              defaultBtnImage={FurnitureImg}
              btnImageWhenOpen={openFurnitureImg}
              handleClick={() => {
                setShowFurnitureModal(!showFurnitureModal);
                setShowStudentRosterModal(false);
              }}
              isSelected={showFurnitureModal}
            />

            {/* Save Layout button */}
            <button
              className="relative overflow-hidden mx-4 rounded-xl"
              onClick={handleSave}
            >
              <img
                alt="Save Seating Chart"
                className=" object-auto w-72 h-full"
                src={saveButton}
              />
              <h4 className="absolute text-[23px] font-[Poppins] inset-0 flex items-center justify-center text-black font-bold">
                Save
              </h4>
            </button>
          </div>
          {/* Tells user they have saved the layout */}
          <div className="absolute mt-[70px]">
            <MsgModal
              msgText="Seating Chart Saved!"
              showMsg={showMsg}
              bgColor="bg-black"
              textColor="text-white"
            />
          </div>
          {/* Msg shows when no students are in the classroom */}
          <div
            className={`${
              noStudentMsg ? "absolute" : "hidden"
            } mt-[350px] px-24`}
          >
            <h4 className="text-black font-[Poppins] text-[32px] text-center font-semibold bg-notebookPaper">
              Click "Student Roster" to start adding students to your seating
              chart!
            </h4>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 w-screen">
        <TeacherNavbar />
      </div>
    </>
  );
};

export default EditSeatingChart;
