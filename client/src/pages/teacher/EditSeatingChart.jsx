import { useEffect, useState } from "react";
import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getAllStudentsClassroom,
  updateSeatingChart,
  getTeacherById,
  updateFurniturePositions,
  deleteFurniture,
} from "../../api/teachersApi";
import AddStudentModal from "../../components/SeatingChart/StudentRosterModal";
import ClassroomFurniture from "../../components/SeatingChart/ClassroomFurniture";
import AssignedStudent from "../../components/SeatingChart/AssignedStudent";
import FurnitureModal from "../../components/SeatingChart/FurnitureModal";
import ClassDetails from "../../components/ClassDetails";
import saveButton from "../../images/button.png";
import RosterImg from "../../images/Three People.png";
import FurnitureImg from "../../images/Desk.png";
import openRosterImg from "../../images/ThreePplLight.png";
import openFurnitureImg from "../../images/DeskImgLight.png";
import MsgModal from "../../components/SeatingChart/MsgModal";
import SeatingChartButton from "../../components/TeacherView/SeatingChartButton";
import BtnRainbow from "../../components/BtnRainbow";
import CloseButton from "../../images/x-button.png"
import Nav from "../../components/Navbar/Nav";
import withAuth from "../../hoc/withAuth";
import SimpleTopNav from "../../components/SimpleTopNav";
import Logout from "../../components/LogoutButton";


const EditSeatingChart = () => {
  const { teacherId, classroomId } = useParams();
  const { userData, updateUser } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const constraintsRef = useRef(null);
  const [isRemoveMode, setIsRemoveMode] = useState(false)


  const [assignedStudents, setAssignedStudents] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);

  const [studentPositions, setStudentPositions] = useState({});
  const [furniturePositions, setFurniturePositions] = useState({});

  const [showStudentRosterModal, setShowStudentRosterModal] = useState(false);
  const [showFurnitureModal, setShowFurnitureModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
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

      setStudents(classroomStudents);
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
      console.log(error);
    }
  };

  const updateInfo = async () => {
    const updatedUserData = await getTeacherById(teacherId);
    updateUser(updatedUserData);
    await refreshData();
  };

  useEffect(() => {
    refreshData();
  }, [userData])

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

    try {
      await updateSeatingChart(teacherId, classroomId, updatedPositions);
      await updateFurniturePositions(
        teacherId,
        classroomId,
        updatedFurniturePositions
      );
      await handleRemoveObject();
      // Show brief save message for 3 secs
      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
      }, 2500);
      await updateInfo();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {" "}
      {/* page container */}
      <div className="flex h-screen min-w-screen justify-center md:mb-0">
      <div className="hidden md:flex md:absolute w-full justify-end underline mt-4 px-2 md:px-5">
          <Logout location="teacherLogout" userData={userData} />
        </div>
        {/* page container */}
        <div className="flex flex-col w-full h-full items-center max-w-3xl">
          {/* top half of page */}
        <div className="flex flex-col h-[28vh] md:h-auto w-screen md:w-full top-0 sticky md:flex-row max-w-[900px] justify-start mb-2 mt-5 md:mt-20 mx-4 md:ml-5 z-20">
          <div className="flex">
            <SimpleTopNav
              pageTitle={classroom?.classSubject}
              fontsize="text-[25px] xl:text-[24px]"
            />
            </div>
            <div className="flex flex-col mx-8 md:flex-row justify-center md:items-center">
              
              <div
                className={`hidden md:flex overflow-hidden max-h-[500px] md:max-h-full md:h-auto`}
              >
                <ClassDetails
                  teacherId={teacherId}
                  classroomId={classroomId}
                  hasButtons={false}
                />
              </div>
            </div>
            {/* Room View & List Buttons */}
            <div className="flex md:hidden justify-around md:justify-between gap-2 md:gap-4 items-center mt-5 bg-notebookPaper">
                <SeatingChartButton
                  buttonText="Student Roster"
                  defaultBtnImage={RosterImg}
                  btnImageWhenOpen={openRosterImg}
                  handleClick={() => {
                    setShowStudentRosterModal(!showStudentRosterModal);
                    setShowFurnitureModal(false);
                  }}
                  isSelected={showStudentRosterModal}
                  buttonSize="small"
                />
                  <SeatingChartButton
                    buttonText="Classroom Objects"
                    defaultBtnImage={FurnitureImg}
                    btnImageWhenOpen={openFurnitureImg}
                    handleClick={() => {
                      setShowFurnitureModal(!showFurnitureModal);
                      setShowStudentRosterModal(false);
                    }}
                    isSelected={showFurnitureModal}
                    buttonSize="small"
                  />
              </div> </div>



          {/* bottom half/classroom part of page */}
          {classroom ? (
            <>
              {/* inside of the classroom (movable on mobile) */}
              <div className="flex w-full md:w-[752px] md:h-[654px] h-[80vh] overflow-scroll md:overflow-visible md:border-none shadow-inner-md md:shadow-none scrollbar-bg-transparent">
                
              {/* static container of the classroom */}
              <div
                className="relative flex w-[752px] h-[654px] rounded-[1rem] mt-3 mr-auto ml-auto md:border-[#D2C2A4] md:border-[8px]  md:rounded-[1rem] shadow-2xl "
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
                  isRemoveMode={isRemoveMode}
                  handleRemoveObject={handleRemoveObject}
                />

                <AssignedStudent
                  assignedStudents={assignedStudents}
                  setSelectedStudents={setSelectedStudents}
                  students={students}
                  constraintsRef={constraintsRef}
                  selectedStudents={selectedStudents}
                  handleDragEnd={handleDragEnd}
                  isRemoveMode={isRemoveMode}
                  handleRemoveObject={handleRemoveObject}
                />
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

          <div className="flex flex-col gap-4 md:gap-0 md:flex-row w-full justify-center items-center md:mt-10">
            {/* Open Choose Students Modal */}
            <div className="hidden md:flex flex-col md:flex-row gap-4 items-center justify-center">
            <SeatingChartButton
              buttonText="Student Roster"
              defaultBtnImage={RosterImg}
              btnImageWhenOpen={openRosterImg}
              handleClick={() => {
                setShowStudentRosterModal(!showStudentRosterModal);
                setShowFurnitureModal(false);
              }}
              isSelected={showStudentRosterModal}
              buttonSize="long"
            />

            {/* Open Choose Furniture Modal */}

            <SeatingChartButton
              buttonText="Classroom Objects"
              defaultBtnImage={FurnitureImg}
              btnImageWhenOpen={openFurnitureImg}
              handleClick={() => {
                setShowFurnitureModal(!showFurnitureModal);
                setShowStudentRosterModal(false);
              }}
              isSelected={showFurnitureModal}
              buttonSize="long"
            />
            </div>
            {/* Save Layout button */}

            <div className="fixed w-[40%] bottom-10 left-[50%] right-0 flex justify-center md:mx-4 md:relative md:bottom-0 md:left-auto md:right-auto z-20 md:z-0">
              <BtnRainbow textColor="text-black" btnText="Save" handleSave={handleSave}/>
            </div>
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
      
      {/* Tells user they have saved the layout */}
      <div className="flex justify-center">
        <MsgModal
          msgText="Save Successful!"
          showMsg={showMsg}
          textColor="text-black"
        />
      </div>
      {/* <div className="fixed bottom-0 w-screen">
        <TeacherNavbar />
      </div> */}
                    <div className="fixed bottom-28 left-2 flex flex-col md:hidden justify-center gap-2 my-4 z-20">
            <button
              onClick={() => console.log("coming soon")}
              className="px-4 py-2 bg-blue text-white rounded"
            >
              +
            </button>
            <button
              onClick={() => console.log("coming soon")}
              className="px-4 py-2 bg-blue text-white rounded"
            >
              -
            </button>
          </div>
      <div className="hidden md:block md:bottom-0 md:fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 z-20">
          <Nav teacherId={teacherId} classroomId={classroomId} />
        </div>
    </>
  );
};

export default withAuth(['teacher'])(EditSeatingChart)
