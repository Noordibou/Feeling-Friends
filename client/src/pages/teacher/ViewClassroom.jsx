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
import TeacherNavbar from "../../components/Navbar/TeacherNavbar";
import ClassDetails from "../../components/ClassDetails";
import ButtonView from "../../components/ButtonView";
import { getLastJournalInfo } from "../../utils/editSeatChartUtil";
import Nav from "../../components/Navbar/Nav";
import withAuth from "../../hoc/withAuth";
import GoBack from "../../components/GoBack";
import SimpleTopNav from "../../components/SimpleTopNav";

const ViewClassroom = () => {
  const { userData } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const { teacherId, classroomId } = useParams();
  const [students, setStudents] = useState([]);
  const constraintsRef = useRef(null);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [showMsg, setShowMsg] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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

      const assigned = classroom.students.filter(
        (student) => student.seatInfo.assigned === true
      );
      setAssignedStudents(assigned);

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
    setSelectedStudent({})
  }

  const [zoom, setZoom] = useState(1); // Initial zoom level
  const maxZoomIn = 1; // Maximum zoom in level
  const minZoomOut = 0.5; // Minimum zoom out level

  const handleZoomIn = () => {
    if (zoom < maxZoomIn) {
      setZoom(prevZoom => prevZoom + 0.1); // Increase zoom level
    }
  };

  const handleZoomOut = () => {
    if (zoom > minZoomOut) {
      setZoom(prevZoom => Math.max(prevZoom - 0.1, minZoomOut)); // Decrease zoom level but not below minZoomOut
    }
  };



  useEffect(() => {
    if(assignedStudents.length > 0) {
      setShowMsg(false)
    } else {
      setShowMsg(true)
    }
  }, [assignedStudents])

  return (
    <>
      <div className="flex min-h-screen min-w-screen justify-center">
        <div className="flex flex-col items-center max-w-4xl lg:z-40 mt-8 md:mt-0 mb-44 md:mb-0">
          {/* Top Navbar */}
          <div className="flex flex-col w-full md:justify-center md:flex-row md:mt-14 px-5 mb-10 xl:gap-8">
            <div className="flex md:justify-center">
              <SimpleTopNav
                pageTitle={classroom?.classSubject}
                fontsize="text-[22px] md:text-[18px] xl:text-[24px]"
              />
            </div>
            <div className="flex flex-col-reverse md:flex-row xl:gap-8">
              <div className="flex flex-col px-4 md:flex-row justify-center md:items-center border-t-2 border-b-2 border-sandwich md:border-none">
                <div
                  className="flex items-center w-full justify-between md:hidden"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <h2 className="md:hidden my-5 md:my-0 font-semibold text-[15px] font-[Poppins]">
                    Details
                  </h2>
                  <svg
                    className={`transition-transform duration-300 md:hidden ${
                      isOpen ? "" : "rotate-180"
                    }`}
                    width="70"
                    height="70"
                    viewBox="0 -25 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="50"
                      y1="10"
                      x2="35"
                      y2="30"
                      stroke="#8D8772"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <line
                      x1="50"
                      y1="10"
                      x2="65"
                      y2="30"
                      stroke="#8D8772"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div
                  className={`transition-all duration-500 ease-in-out md:flex overflow-hidden ${
                    isOpen ? "max-h-[500px]" : "max-h-0"
                  } md:max-h-full md:h-auto`}
                >
                  <ClassDetails
                    teacherId={teacherId}
                    classroomId={classroomId}
                  />
                </div>
              </div>
              {/* Room View & List Buttons */}
              <div className="flex justify-around md:justify-between gap-4 items-center mb-5 md:mb-0">
                <ButtonView
                  buttonText="Room View"
                  btnImageWhenOpen={classBoxesIcon}
                  isSelected={true}
                  buttonSize="small"
                />
                <Link
                  className="flex items-center h-16"
                  to={`/viewclasslist/${userData._id}/${classroomId}`}
                >
                  <ButtonView
                    buttonText="List View"
                    defaultBtnImage={listIcon}
                    isSelected={false}
                    buttonSize="small"
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className={`${Object.keys(selectedStudent).length === 0
                        ? "hidden"
                        : "fixed w-full h-full"
                    } bg-graphite md:hidden md:bg-none z-10 md:z-0 top-0 opacity-50 md:opacity-0`}></div>
          <div className="flex md:hidden justify-center mb-4">
            <button
              onClick={handleZoomIn}
              className="mr-2 px-4 py-2 bg-blue text-white rounded"
            >
              Zoom In
            </button>
            <button
              onClick={handleZoomOut}
              className="px-4 py-2 bg-blue text-white rounded"
            >
              Zoom Out
            </button>
          </div>
          {classroom ? (
            <>
              <div className="flex w-[310px] xs:w-[400px] sm:w-[400px] md:w-[752px] h-[654px] overflow-scroll md:overflow-visible border-[#D2C2A4] md:border-none border-[8px]  rounded-[1rem] shadow-inner-md md:shadow-none scrollbar-hide md:scrollbar-auto">
                {/* Classroom Container */}
                <div
                  key={`classroom-${classroomId}`}
                  className={`${
                    Object.keys(selectedStudent).length === 0
                      ? ""
                      : "pointer-events-none"
                  } flex w-[752px] h-[654px] mr-auto ml-auto md:border-[#D2C2A4] md:border-[8px]  md:rounded-[1rem] `}
                  ref={constraintsRef}
                  style={{
                    transform: `scale(${zoom})`
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
                                assignedStudent.avatarImg === "none"
                                  ? SampleAvatar
                                  : assignedStudent.avatarImg
                              }
                              alt={assignedStudent.firstName}
                            />
                          </div>
                          <h3 className="flex h-full text-[10px] font-[Poppins] text-center flex-col-reverse">
                            {assignedStudent.firstName}{" "}
                            {assignedStudent.lastName.charAt(0)}.
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
              Object.keys(selectedStudent).length === 0 ? "hidden" : "fixed top-[35%] sm:top-[40%] md:absolute"
            } flex flex-col w-[80%] sm:w-[500px] z-20`}
          >
            <StudentInfoBox
              student={selectedStudent}
              classroomId={classroomId}
              userData={userData}
              isEditMode={true}
              handleClick={() => closeStudentInfo(selectedStudent)}
            />
          </div>
        </div>
        <div className={`${showMsg ? "absolute" : "hidden"} mt-[350px] px-24`}>
          <h4 className="text-black font-[Poppins] text-[32px] text-center font-semibold bg-notebookPaper">
            Click the Navbar's "Edit" button to add students and furniture to
            your classroom layout!
          </h4>
        </div>
        {/* <div className="bottom-0 fixed w-screen">
        <TeacherNavbar  teacherId={teacherId} classroomId={classroomId} />
        </div> */}
        <div className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 z-20">
          <Nav teacherId={teacherId} classroomId={classroomId} />
        </div>
      </div>
    </>
  );
};

export default withAuth(['teacher'])(ViewClassroom)