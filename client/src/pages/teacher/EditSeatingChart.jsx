import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getAllStudentsClassroom,
  updateSeatingChart,
  getTeacherById,
  updateFurniturePositions,
  deleteFurniture,
} from "../../api/teachersApi";
import AddStudentModal from "../../components/TeacherView/modal/StudentRosterModal";
import ClassroomFurniture from "../../components/SeatingChart/ClassroomFurniture";
import AssignedStudent from "../../components/SeatingChart/AssignedStudent";
import FurnitureModal from "../../components/TeacherView/modal/FurnitureModal";
import ClassDetails from "../../components/ClassDetails";
import RosterImg from "../../images/Three People.png";
import FurnitureImg from "../../images/Desk.png";
import openRosterImg from "../../images/ThreePplLight.png";
import openFurnitureImg from "../../images/DeskImgLight.png";
import MsgModal from "../../components/SeatingChart/MsgModal";
import SeatingChartButton from "../../components/TeacherView/SeatingChartButton";
import BtnRainbow from "../../components/BtnRainbow";
import Nav from "../../components/Navbar/Nav";
import withAuth from "../../hoc/withAuth";
import SimpleTopNav from "../../components/SimpleTopNav";
import Logout from "../../components/LogoutButton";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext.js";
import UnsavedChanges from "../../components/TeacherView/UnsavedChanges.jsx";

const EditSeatingChart = () => {
  const { teacherId, classroomId } = useParams();
  const { userData, updateUser } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const constraintsRef = useRef(null);

  const [assignedStudents, setAssignedStudents] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [furnitureList, setFurnitureList] = useState([]);

  const [studentPositions, setStudentPositions] = useState({});
  const [furniturePositions, setFurniturePositions] = useState({});

  const [showStudentRosterModal, setShowStudentRosterModal] = useState(false);
  const [showFurnitureModal, setShowFurnitureModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [showMsg, setShowMsg] = useState(false);
  const [emptyMsg, setEmptyMsg] = useState(false);
  const { setHasUnsavedChanges } = useUnsavedChanges();
  const [scale, setScale] = useState(1);

  const furnitureModalRef = useRef(null);
  const studentModalRef = useRef(null);

  const openFurnitureModal = () => {
    // setShowStudentRosterModal(true);
    furnitureModalRef.current?.showModal();
  };

  const closeFurnitureModal = () => {
    // setShowStudentRosterModal(false);
    furnitureModalRef.current?.close();
  };

  const openStudentModal = () => {
    // setShowStudentRosterModal(true);
    studentModalRef.current?.showModal();
  };

  const closeStudentModal = () => {
    // setShowStudentRosterModal(false);
    studentModalRef.current?.close();
  };

  const handleZoomIn = () =>
    setScale((prevScale) => Math.min(prevScale + 0.1, 1.5));
  const handleZoomOut = () =>
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));

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

      const furniture = classroom.furniture.filter(
        (item) => item.assigned === true
      );
      console.log("furniture: " + JSON.stringify(furniture));
      setFurnitureList(furniture);

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
  }, [userData]);

  useEffect(() => {
    if (assignedStudents.length === 0 && furnitureList.length === 0) {
      setEmptyMsg(true);
    } else {
      setEmptyMsg(false);
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
              rotation:
                furniturePositions[itemId]?.rotation ||
                classroom.furniture[itemId]?.rotation,
            },
          }));
          setHasUnsavedChanges(true);
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
          setHasUnsavedChanges(true);
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
        const furnitureItem = classroom.furniture.find(
          (item) => item._id === itemId
        );
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
      setHasUnsavedChanges(false);
      await updateInfo();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AddStudentModal
        ref={studentModalRef}
        closeStudentModal={closeStudentModal}
        unassignedStudents={unassignedStudents}
        students={students}
        teacherId={teacherId}
        classroomId={classroomId}
        updateInfo={updateInfo}
      />
      <FurnitureModal
        ref={furnitureModalRef}
        closeFurnitureModal={closeFurnitureModal}
        classroom={classroom}
        teacherId={teacherId}
        classroomId={classroomId}
        updateInfo={updateInfo}
      />{" "}
      {/* page container */}
      <div className="flex h-screen min-w-screen justify-center md:mb-0">
        <div className="hidden md:flex md:absolute w-full justify-end underline mt-4 px-2 md:px-5">
          <Logout location="teacherLogout" userData={userData} />
        </div>

        {/* page container */}
        <div className="flex flex-col w-full h-screen items-center max-w-3xl">
          {/* top half of page */}
          <div className="flex flex-col h-[180px] md:h-auto w-screen md:w-full top-0 md:flex-row max-w-[752px] justify-start mb-2 md:mb-0 mt-5 md:mt-10 lg:mt-16 mx-4 md:ml-5 z-20">
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
                handleClick={openStudentModal}
                isSelected={showStudentRosterModal}
                buttonSize="small"
              />
              <SeatingChartButton
                buttonText="Classroom Objects"
                defaultBtnImage={FurnitureImg}
                btnImageWhenOpen={openFurnitureImg}
                handleClick={openFurnitureModal}
                isSelected={showFurnitureModal}
                buttonSize="small"
              />
            </div>{" "}
          </div>

          {/* bottom half/classroom part of page */}
          {classroom ? (
            <>
              {/* inside of the classroom (movable on mobile) */}
              <div className="relative w-full md:w-[752px] md:h-[570px] h-full overflow-auto md:overflow-visible shadow-inner-md md:shadow-none scrollbar-bg-transparent">
                {/* static container of the classroom */}
                <div
                  className="relative w-[752px] h-[570px] rounded-[1rem] mt-10 ml-10 md:mt-0 md:ml-0 md:border-[#D2C2A4] md:border-[8px] md:rounded-[1rem] "
                  ref={constraintsRef}
                >
                  {/* Scale wrapper */}
                  <div
                    className="absolute top-0 left-0"
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: `scale(${scale})`,
                      transformOrigin: "top left",
                    }}
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
                      handleRemoveObject={handleRemoveObject}
                    />

                    <AssignedStudent
                      assignedStudents={assignedStudents}
                      setSelectedStudents={setSelectedStudents}
                      students={students}
                      constraintsRef={constraintsRef}
                      selectedStudents={selectedStudents}
                      handleDragEnd={handleDragEnd}
                      handleRemoveObject={handleRemoveObject}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex w-[752px] h-[61%] rounded-[1rem] mt-3 mr-auto ml-auto border-[#D2C2A4] border-[8px] shadow-2xl">
              {/* placeholder for now */}
              <div className={`absolute mt-[250px] px-32 -ml-10`}>
                <p className="text-black font-[Poppins] text-[32px] text-center font-semibold bg-notebookPaper">
                  Sorry, this feature is not available right now. Please try
                  again later
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 md:gap-0 md:flex-row w-full justify-center items-start md:mt-5">
            {/* Open Choose Students Modal */}
            <div className="hidden md:flex flex-col md:flex-row gap-4 items-center justify-center">
              <SeatingChartButton
                buttonText="Student Roster"
                defaultBtnImage={RosterImg}
                btnImageWhenOpen={openRosterImg}
                handleClick={openStudentModal}
                isSelected={showStudentRosterModal}
                buttonSize="long"
              />

              {/* Open Choose Furniture Modal */}

              <SeatingChartButton
                buttonText="Classroom Objects"
                defaultBtnImage={FurnitureImg}
                btnImageWhenOpen={openFurnitureImg}
                handleClick={openFurnitureModal}
                isSelected={showFurnitureModal}
                buttonSize="long"
              />
            </div>
            {/* Save Layout button */}

            <div className="absolute w-52 left-[15%] xs:left-[25%] bottom-10 flex justify-center md:mx-4 md:relative md:bottom-0 md:left-auto md:right-auto z-20 md:z-0 md:mb-52 lg:mb-10">
              <BtnRainbow
                textColor="text-black"
                btnText="Save"
                handleSave={handleSave}
              />
            </div>

            {/* Msg shows when no students are in the classroom */}
            <div
              className={`${emptyMsg ? "absolute" : "hidden"} mt-[350px] px-24`}
            >
              <p className="text-black font-[Poppins] text-[32px] max-w-[730px] text-center font-semibold bg-notebookPaper">
                Nothing yet! Click Student Roster or Classroom Objects to get
                started!
              </p>
            </div>
          </div>
        </div>
        {/* Tells user they have saved the layout */}

        <MsgModal
          msgText="Save Successful!"
          showMsg={showMsg}
          textColor="text-black"
        />

        <UnsavedChanges />
      </div>
      <div className="fixed bottom-28 left-2 flex flex-col md:hidden justify-center gap-2 my-4 z-20">
        <button
          onClick={() => handleZoomIn()}
          className="px-4 py-2 bg-blue text-white rounded"
        >
          +
        </button>
        <button
          onClick={() => handleZoomOut()}
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

export default withAuth(["teacher"])(EditSeatingChart);
