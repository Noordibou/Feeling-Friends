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
import ClassInfoNavbar from "../../components/ClassInfoNavbar";
import ButtonView from "../../components/ButtonView";
import { getLastJournalInfo } from "../../utils/editSeatChartUtil";

const DisplaySeatingChart = () => {
  const { userData } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const { teacherId, classroomId } = useParams();
  const [students, setStudents] = useState([]);
  const constraintsRef = useRef(null);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [showMsg, setShowMsg] = useState(false)

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


  useEffect(() => {
    if(assignedStudents.length > 0) {
      setShowMsg(false)
    } else {
      setShowMsg(true)
    }
  }, [assignedStudents])

  return (
    <>
      <div className="flex h-screen min-w-screen justify-center">
        <div className="flex flex-col items-center max-w-4xl ">
          {/* Top Navbar */}
          <ClassInfoNavbar teacherId={teacherId} classroomId={classroomId} />

          {classroom ? (
            <>
              {/* Classroom Container */}
              <div
                key={`classroom-${classroomId}`}
                className={`${
                  Object.keys(selectedStudent).length === 0
                    ? ""
                    : "pointer-events-none"
                } flex w-[752px] h-[61%] rounded-[1rem] mt-2 mr-auto ml-auto border-[#D2C2A4] border-[8px]`}
                ref={constraintsRef}
              >
                <div
                  className={`${
                    Object.keys(selectedStudent).length === 0
                      ? "hidden"
                      : "flex"
                  } bg-graphite z-10 w-[752px] h-[100%] rounded-[0.5rem] mr-auto ml-auto border-[#D2C2A4] opacity-50 `}
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

                  const { borderColorClass } = getLastJournalInfo(assignedStudent)

                  return (
                      <motion.div
                        id={`motion-div-${studentObj.student}`}
                        key={`${studentObj.student}-${index}`}
                        initial={{
                          x: Math.max(0, initialX),
                          y: Math.max(0, initialY),
                        }}
                        className={`absolute mx-1 bg-${
                          borderColorClass
                        } ${
                          borderColorClass === "sandwich"
                            ? "bg-opacity-30 border-4 border-sandwich"
                            : `border-4 border-${borderColorClass}`
                        } px-[2px] rounded-2xl`}
                        onClick={() => {
                          setSelectedStudent(assignedStudent);
                        }}
                      >
                        <div className="">
                          <div className="flex w-full justify-center h-full items-center">
                            <img
                              alt="student"
                              className={`flex object-cover mt-1 w-[72px] h-[65px] rounded-2xl ${
                                borderColorClass ===
                                "sandwich"
                                  ? "opacity-50"
                                  : ""
                              }`}
                              src={SampleAvatar}
                            />
                          </div>
                          <h3 className="flex h-full text-[12px] font-[Poppins] text-center flex-col-reverse">
                            {assignedStudent.firstName} {assignedStudent.lastName.charAt(0)}.
                          </h3>
                        </div>
                      </motion.div>
                  );
                })}
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
              Object.keys(selectedStudent).length === 0 ? "hidden" : "absolute"
            }  flex-col mt-[340px] w-[500px] z-20`}
          >
            <StudentInfoBox
              student={selectedStudent}
              classroomId={classroomId}
              userData={userData}
              isEditMode={true}
              handleClick={() => closeStudentInfo(selectedStudent)}
            />
          </div>

          {/* Room View & List Buttons */}
          <div className="flex justify-around w-full mt-10 items-center ">
            <ButtonView
              buttonText="Room View"
              btnImageWhenOpen={classBoxesIcon}
              isSelected={true}
            />
            <Link
              className="flex items-center h-16"
              to={`/viewclasslist/${userData._id}/${classroomId}`}
            >
              <ButtonView
                buttonText="List View"
                defaultBtnImage={listIcon}
                isSelected={false}
              />
            </Link>
          </div>
        </div>
        <div className={`${showMsg ? "absolute" : "hidden"} mt-[350px] px-24`}>
          <h4 className="text-black font-[Poppins] text-[32px] text-center font-semibold bg-notebookPaper">
            Click the Navbar's "Edit" button to add students and furniture to
            your classroom layout!
          </h4>
        </div>
        <div className="bottom-0 fixed w-screen">
        <TeacherNavbar  teacherId={teacherId} classroomId={classroomId} />
        </div>
      </div>
    </>
  );
};

export default DisplaySeatingChart;
