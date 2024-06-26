import { useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import SampleAvatar from "../../images/Sample_Avatar.png";
import { toggleSelected } from "../../utils/editSeatChartUtil";
import { getLastJournalInfo } from "../../utils/editSeatChartUtil";

const AssignedStudent = ({
  assignedStudents,
  students,
  constraintsRef,
  selectedStudents,
  setSelectedStudents,
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

          const alreadySelected = selectedStudents.some(
            (student) => student.student === studentObj.student
          );

          const { borderColorClass } = getLastJournalInfo(assignedStudent)

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
              className={`absolute border-4 px-[4px] rounded-2xl ${
                selectedStyling ? "border-black" : ` border-${borderColorClass}`
              } ${borderColorClass === "sandwich" ? "bg-[#ece6d2]" : `bg-${borderColorClass}`}`}
              onDoubleClick={() => {
                setSelectedStudents(toggleSelected(newFormat, alreadySelected, selectedStudents));
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
                    draggable={false}
                    className={`flex object-cover mt-1 w-[70px] h-[65px] rounded-2xl ${borderColorClass === "sandwich" ? "opacity-50" : ""}`}
                    src={assignedStudent.avatarImg === "none" ? SampleAvatar : assignedStudent.avatarImg}
                    alt={assignedStudent.firstName}
                  />
                </div>
                <h3 className="flex h-full text-[12px] font-[Poppins] text-center flex-col-reverse">
                  {assignedStudent.firstName} {assignedStudent.lastName.charAt(0)}.
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
