import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { getAllStudentsClassroom } from "../../api/teachersApi";
import furnitureShapes from "../../data/furnitureShapes";
import SampleAvatar from "../../images/Sample_Avatar.png";
import { motion } from "framer-motion";
import StudentInfoBox from "../../components/StudentInfoBox";
import { Link } from "react-router-dom";
import classBoxesIcon from "../../images/ClassBoxesIcon.png";
import listIcon from "../../images/ListIcon.png";
import ClassDetails from "../../components/ClassDetails";
import ButtonView from "../../components/TeacherView/ButtonView";
import { getLastJournalInfo } from "../../utils/editSeatChartUtil";
import Nav from "../../components/Navbar/Nav";
import withAuth from "../../hoc/withAuth";
import SimpleTopNav from "../../components/SimpleTopNav";
import Logout from "../../components/LogoutButton";
import editIcon from "../../images/edit_icon.png";


const ViewClassroom = () => {
  const { userData } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const { teacherId, classroomId } = useParams();
  const [students, setStudents] = useState([]);
  const constraintsRef = useRef(null);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [showMsg, setShowMsg] = useState(false);
  const [assignedFurniture, setAssignedFurniture] = useState([])

  const getClassroomData = async () => {
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

      const students = classroom.students.filter(
        (student) => student.seatInfo.assigned === true
      );
      setAssignedStudents(students);

      const furniture = classroom.furniture.filter(
        (item) => item.assigned === true
      );
      
      setAssignedFurniture(furniture)
    } catch (error) {
      console.log("oof error ");
      console.log(error);
    }
  };

  useEffect(() => {
    getClassroomData();
    setSelectedStudent({});

    window.scrollTo(0, 0);
  }, []);

  const closeStudentInfo = (clickedStudent) => {
    setSelectedStudent({});
  };

  const [zoom, setZoom] = useState(1); // Initial zoom level
  const maxZoomIn = 1; // Maximum zoom in level
  const minZoomOut = 0.5; // Minimum zoom out level

  const handleZoomIn = () => {
    if (zoom < maxZoomIn) {
      setZoom((prevZoom) => prevZoom + 0.1); // Increase zoom level
    }
  };

  const handleZoomOut = () => {
    if (zoom > minZoomOut) {
      setZoom((prevZoom) => Math.max(prevZoom - 0.1, minZoomOut)); // Decrease zoom level but not below minZoomOut
    }
  };

  useEffect(() => {
    if (assignedStudents.length === 0 && assignedFurniture.length === 0) {
      setShowMsg(true);
    } else {
      setShowMsg(false);
    }
  }, [assignedStudents]);

  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        <div className="hidden md:flex w-full justify-end underline mt-4 px-2 md:px-5">
          <Logout location="teacherLogout" userData={userData} />
        </div>
        <div className="flex flex-col md:items-center ">
          <div className="flex flex-col h-screen max-w-4xl lg:z-40 ">
            {/* Top Navbar */}
            <div className="flex flex-col h-[280px] md:h-auto w-full md:justify-between md:mt-6 pt-2 px-2 z-20">
              <div className="flex justify-center w-full flex-col md:flex-row ">
                <div className="flex">
                  <div className="flex md:justify-center">
                    <SimpleTopNav
                      pageTitle={classroom?.classSubject}
                      fontsize="text-[25px] xl:text-[24px]"
                    />
                  </div>

                  <div className="hidden md:flex flex-col px-4 md:flex-row justify-center md:items-center border-t-2 border-b-2 border-sandwich md:border-none">
                    <div
                      className={`flex overflow-hidden max-h-[500px] md:max-h-full h-auto`}
                    >
                      <ClassDetails
                        teacherId={teacherId}
                        classroomId={classroomId}
                      />
                    </div>
                  </div>
                </div>
                {/* Seating Chart & Class List Buttons */}
                <div className="flex justify-around md:justify-between gap-4 items-center mb-5 md:mb-0">
                  <ButtonView
                    buttonText="Seating Chart"
                    btnImageWhenOpen={classBoxesIcon}
                    isSelected={true}
                    buttonSize="small"
                  />
                  <Link
                    className="flex items-center h-16"
                    to={`/viewclasslist/${userData._id}/${classroomId}`}
                  >
                    <ButtonView
                      buttonText="Class List"
                      defaultBtnImage={listIcon}
                      isSelected={false}
                      buttonSize="small"
                    />
                  </Link>
                </div>
              </div>
              <a href={`/edit-seating-chart/${teacherId}/${classroomId}`} className="flex self-center items-center justify-center px-8 w-full md:w-72 border-2 border-sandwich rounded-[1.2rem] mb-[1rem] p-[0.8rem] gap-3">
                <h2 className="text-[16px] md:text-[18px] font-[Poppins] text-center underline">
                  
                    edit seating chart
                </h2>
                <img src={editIcon} alt="edit icon" className="h-6 w-6" />
              </a>
            </div>

            <div
              className={`${
                Object.keys(selectedStudent).length === 0
                  ? "hidden"
                  : "fixed w-full h-full"
              } bg-graphite md:hidden md:bg-none z-30 md:z-0 top-0 opacity-50 md:opacity-0`}
            ></div>

            {classroom ? (
              <>
                {/* static classroom */}
                <div className="relative flex w-full md:w-[752px] md:h-[570px] h-full overflow-auto md:overflow-visible shadow-inner-md md:shadow-none scrollbar-bg-transparent">
                  {/* Classroom Container */}
                  {/* movable classroom */}
                  <div
                    key={`classroom-${classroomId}`}
                    className={`${
                      Object.keys(selectedStudent).length === 0
                        ? ""
                        : "pointer-events-none"
                    } relative flex w-[752px] h-[570px] rounded-[1rem] mt-10 ml-10 md:mt-0 md:ml-0 md:border-[#D2C2A4] md:border-[8px] md:rounded-[1rem] `}
                    ref={constraintsRef}
                    style={{
                      transform: `scale(${zoom})`,
                    }}
                  >
                    {/* to make the classroom width 752 on smaller screens. Not sure why it just doesn't work on the div itself */}
                    <div className="md:hidden w-[752px]"></div>

                    <div
                      className={`${
                        Object.keys(selectedStudent).length === 0
                          ? "hidden"
                          : "md:flex"
                      } md:bg-graphite md:z-10 w-[752px] h-[100%] rounded-[0.5rem] mr-auto ml-auto border-[#D2C2A4] opacity-50 `}
                    ></div>

                    {/* Furniture layout here */}
                    {classroom.furniture.map((item, index) => {
                      const shape = furnitureShapes.find(
                        (shape) => shape.name === item.name
                      );
                      const initialX = item.x;
                      const initialY = item.y;

                      return (
                        <motion.div
                          id={`furniture-${item._id}`}
                          key={`${item._id}`}
                          initial={{
                            x: initialX,
                            y: initialY,
                            rotate: item.rotation || 0,
                          }}
                          className={`absolute ${shape.style.width} ${shape.style.height}`}
                        >
                          <img
                            className="flex w-full h-full"
                            src={shape.src}
                            alt={shape.alt}
                          />
                        </motion.div>
                      );
                    })}

                    {/* Assigned Students here */}
                    {assignedStudents.map((studentObj, index) => {
                      const initialX = studentObj.seatInfo.x;
                      const initialY = studentObj.seatInfo.y;

                      const assignedStudent = students.find(
                        (student) => student._id === studentObj.student
                      );

                      const { borderColorClass, bgColorClass } =
                        getLastJournalInfo(assignedStudent);

                      return (
                        <motion.div
                          id={`motion-div-${studentObj.student}`}
                          key={`${studentObj.student}-${index}`}
                          initial={{
                            x: Math.max(0, initialX),
                            y: Math.max(0, initialY),
                          }}
                          className={`absolute mx-1 bg-${bgColorClass} ${
                            borderColorClass === "sandwich"
                              ? "bg-opacity-30 border-4 border-sandwich"
                              : `border-4 border-${borderColorClass}`
                          } px-[2px] z-0 rounded-2xl`}
                          onClick={() => {
                            setSelectedStudent(assignedStudent);
                          }}
                        >
                          <div className="">
                            <div className="flex w-full justify-center h-full items-center">
                              <img
                                className={`flex object-cover mt-1 w-[55px] h-[50px] rounded-2xl ${
                                  borderColorClass === "sandwich"
                                    ? "opacity-50"
                                    : ""
                                }`}
                                src={
                                  assignedStudent?.avatarImg === "none"
                                    ? SampleAvatar
                                    : assignedStudent?.avatarImg
                                }
                                alt={assignedStudent?.firstName}
                              />
                            </div>
                            <h3 className="flex h-full text-[10px] font-[Poppins] text-center flex-col-reverse">
                              {assignedStudent?.firstName}{" "}
                              {assignedStudent?.lastName.charAt(0)}.
                            </h3>
                          </div>
                        </motion.div>
                      );
                    })}
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

            {/* Student Info Modal */}
            <div
              className={`${
                Object.keys(selectedStudent).length === 0
                  ? "hidden"
                  : "fixed top-[40%] md:top-[45%] md:absolute"
              } flex flex-col self-center sm:w-[500px] z-30`}
            >
              <StudentInfoBox
                student={selectedStudent}
                classroomId={classroomId}
                userData={userData}
                isEditMode={true}
                handleClick={() => closeStudentInfo(selectedStudent)}
              />
            </div>
          
          <div
            className={`${showMsg ? "absolute" : "hidden"} mt-[350px] px-24`}
          >
            <h4 className="text-black font-[Poppins] text-[32px] mt-32 md:mt-20 max-w-[740px] text-center font-semibold bg-notebookPaper">
              Nothing assigned yet!
            </h4>
          </div>
          <div className="fixed bottom-4 left-2 flex flex-col gap-2 md:hidden justify-center my-4 z-20">
            <button
              onClick={handleZoomIn}
              className=" px-4 py-2 bg-blue text-white rounded"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="px-4 py-2 bg-blue text-white rounded"
            >
              -
            </button>
          </div>
          </div>
          <div className="bottom-0 hidden md:block md:fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 z-20">
            <Nav teacherId={teacherId} classroomId={classroomId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(["teacher"])(ViewClassroom);
