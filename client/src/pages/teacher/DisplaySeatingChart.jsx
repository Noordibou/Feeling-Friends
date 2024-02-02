import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { getAllStudentsClassroom } from "../../api/teachersApi";
import { applyColorsToStudents } from "../../utils/utils";
import furnitureShapes from "../../data/furnitureShapes";
import SampleAvatar from "../../images/Sample_Avatar.png";
import { motion } from "framer-motion";
import StudentInfoBox from "../../components/StudentInfoBox";
import { Link } from "react-router-dom";
import classBoxesIcon from '../../images/ClassBoxesIcon.png'
import listIcon from '../../images/ListIcon.png'

const DisplaySeatingChart = () => {
  const { userData } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const { teacherId, classroomId } = useParams();
  const [students, setStudents] = useState([]);
  const constraintsRef = useRef(null);
  const [selectedStudent, setSelectedStudent] = useState({});

  const getClassroomData = async () => {
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
  }, []);

  return (
    <>
      <div className="flex min-h-screen min-w-screen">
        <div className="flex flex-col items-center w-full">
          {classroom ? (
            <>
              {/* Classroom Container */}
              <div
                className={`${
                  Object.keys(selectedStudent).length === 0
                    ? ""
                    : "pointer-events-none"
                } flex w-[752px] h-[61%] rounded-[1rem] mt-10 mr-auto ml-auto border-[#D2C2A4] border-[8px]`}
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
                        x: Math.max(0, initialX),
                        y: Math.max(0, initialY),
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

                  return (
                    <>
                      <motion.div
                        id={`motion-div-${studentObj.student}`}
                        key={`${studentObj.student}-${index}`}
                        initial={{
                          x: Math.max(0, initialX),
                          y: Math.max(0, initialY),
                        }}
                        className={`absolute mx-1 bg-${assignedStudent.borderColorClass} pb-1 px-[6px] rounded-2xl`}
                        onClick={() => {
                          setSelectedStudent(assignedStudent);
                        }}
                      >
                        <div className="">
                          <div className="flex w-full justify-center h-full items-center">
                            <img
                              className="flex object-cover mt-2 w-[72px] h-[65px] rounded-2xl"
                              src={SampleAvatar}
                            />
                          </div>
                          <h3 className="flex h-full text-[12px] font-[Poppins] text-center flex-col-reverse">
                            {assignedStudent.firstName}
                          </h3>
                        </div>
                      </motion.div>
                    </>
                  );
                })}
              </div>
              <div className="flex flex-row">
                <div
                  className={`${
                    Object.keys(selectedStudent).length === 0
                      ? "hidden"
                      : "absolute"
                  } top-[25%] left-[20%] flex-col w-[500px] z-20`}
                >
                  <StudentInfoBox
                    student={selectedStudent}
                    classroomId={classroomId}
                    userData={userData}
                    setSelectedStudent={setSelectedStudent}
                  />
                </div>
              </div>
            </>
          ) : (
            "Loading..."
          )}

          <div className="flex justify-around w-full mt-8 items-center ">
            <div className="">
              <button className="text-body font-body rounded-xl px-[1rem] bg-sandwich flex items-center h-16 border-[5px] border-sandwich ">
                <h4 className="pr-2">Room View</h4>
                <img src={classBoxesIcon} alt="Student Room View"/>
              </button>
            </div>
            <div className="">
              <button className="text-body font-body border-[5px] border-sandwich rounded-xl px-[1rem] flex items-center">
                <Link className="flex items-center px-[1rem] h-16" to={`/viewclasslist/${userData._id}/${classroomId}`}>
                  <h4 className="pr-5">List View</h4>
                  <img src={listIcon} alt="Student List View"/>
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplaySeatingChart;
