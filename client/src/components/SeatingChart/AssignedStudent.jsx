import { useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import SampleAvatar from "../../images/Sample_Avatar.png";

const AssignedStudent = ({
  assignedStudents,
  students,
  constraintsRef,
  selectedStudents,
  handleStudentClick,
  handleDragEnd,
}) => {
  return (
    <>
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
            }
          }

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
              className={`absolute mx-1 bg-${
                assignedStudent.borderColorClass
              } pb-1 px-[6px] rounded-2xl ${
                selectedStyling ? "border-4 border-black" : ""
              }`}
              onClick={() => {
                handleStudentClick(newFormat);
              }}
              onDragEnd={(event, info) => {
                const containerBounds =
                  constraintsRef.current.getBoundingClientRect();

                const containerX =
                  Math.max(0, info.point.x - containerBounds.left) - 40;
                const containerY =
                  Math.max(0, info.point.y - containerBounds.top) - 40;
                console.log(
                  "Dragged to x:",
                  containerX,
                  "y:",
                  containerY,
                  ", for " + assignedStudent.firstName
                );
                handleDragEnd(studentObj.student, "assigned", containerY);
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
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

export default AssignedStudent;
