import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { getAllStudentsClassroom } from "../../api/teachersApi";
import { applyColorsToStudents } from "../../utils/utils";
import furnitureShapes from "../../data/furnitureShapes";
import SampleAvatar from "../../images/Sample_Avatar.png";



const DisplaySeatingChart = () => {
  const { userData, updateUser } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const { teacherId, classroomId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);


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

      // setStudentPositions(positions);

      // setUnassignedStudents(unassigned);
      // // organizing all assigned seats to an array
      const assigned = classroom.students.filter(
        (student) => student.seatInfo.assigned === true
      );
      setAssignedStudents(assigned);
    } catch (error) {
      console.log("oof error ");
      console.log(error);
    }
  }

  useEffect(() => {
    getClassroomData();
  }, [])

  return (
    <>
    <div className="flex min-h-screen min-w-screen justify-center">
      <div className="">
        {classroom ? (
          <>
            <div
              className="flex w-[752px] h-[61%] rounded-[1rem] mt-10 mr-auto ml-auto border-[#D2C2A4] border-[8px]"
              // ref={constraintsRef}
            >
              {/* Classroom layout here */}

              {classroom.furniture.map((item, index) => {
                const shape = furnitureShapes.find(
                  (shape) => shape.name === item.name
                );
                const initialX = item.x;
                const initialY = item.y;

                const selectedStyling = selectedItems.some((selectedId) => {
                  return selectedId === item._id;
                });
                const alreadySelected = selectedItems.some(
                  (furnitureId) => furnitureId === item._id
                );
                return (
                  <div
                    id={`furniture-${item._id}`}
                    key={`${item._id}`}
                    initial={{
                      x: Math.max(0, initialX),
                      y: Math.max(0, initialY),
                      rotate: item.rotation || 0,
                    }}
                    onClick={() => {
                      console.log("click click")
                    }}
                    className={`absolute ${shape.style.width} ${
                      shape.style.height
                    } ${selectedStyling ? "border-4 border-black" : ""}`}
                  >
                    <img
                      className="flex w-full h-full"
                      src={shape.src}
                      alt={shape.alt}
                    />
                  </div>
                );
              })}

              {/* Assigned Students here */}

              {assignedStudents.map((studentObj, index) => {
                const initialX = studentObj.seatInfo.x;
                const initialY = studentObj.seatInfo.y;

                const assignedStudent = students.find(
                  (student) => student._id === studentObj.student
                );

                if (assignedStudent) {
                  const selectedStyling = selectedStudents.some(
                    (selected) => selected.student === studentObj.student
                  );

                  const newFormat = {
                    student: studentObj.student,
                    seatInfo: {
                      x: null,
                      y: null,
                      assigned: false,
                    },
                  };

                  const alreadySelected = selectedStudents.some(
                    (student) => student.student === studentObj.student
                  );

                  return (
                    <div
                      id={`motion-div-${studentObj.student}`}
                      key={`${studentObj.student}-${index}`}
                      initial={{
                        x: Math.max(0, initialX),
                        y: Math.max(0, initialY),
                      }}
                      className={`absolute mx-1 bg-${
                        assignedStudent.borderColorClass
                      } pb-1 px-[6px] rounded-2xl ${
                        selectedStyling ? "border-4 border-black" : ""
                      }`}
                      onClick={() => {
                        console.log("click click 2")
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
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </>
        ) : (
          "Loading..."
        )}
      </div>
      </div>
    </>
  );
};

export default DisplaySeatingChart;
