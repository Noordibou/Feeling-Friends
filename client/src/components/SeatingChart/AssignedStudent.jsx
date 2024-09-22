import { useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import SampleAvatar from "../../images/Sample_Avatar.png";
import { toggleSelected } from "../../utils/editSeatChartUtil";
import { getLastJournalInfo } from "../../utils/editSeatChartUtil";
import xButton from "../../images/x-button.png"

const AssignedStudent = ({
  assignedStudents,
  students,
  constraintsRef,
  selectedStudents,
  setSelectedStudents,
  handleDragEnd
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
              className={`absolute border-4 border-${borderColorClass} px-[4px] rounded-2xl ${
                borderColorClass === "sandwich"
                  ? "bg-[#ece6d2]"
                  : `bg-${borderColorClass}`
              }`}
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
              <div className="relative">
                {/* Add to Removal List Button */}

                <button
                  className={`absolute -top-4 left-12 mt-1 ml-1 rounded-full h-6 w-6 flex items-center justify-center ${selectedStyling ? "bg-emerald-500" : "bg-red-500"} z-20 `}
                  onClick={() => {
                    setSelectedStudents(
                      toggleSelected(
                        newFormat,
                        alreadySelected,
                        selectedStudents
                      )
                    );
                  }}
                >
                  <p className="flex items-center font-bold text-white text-lg h-full -mt-1">
                    {selectedStyling ? "+" : "-"}
                  </p>
                </button>
                <div className="flex w-full justify-center h-full items-center">
                  <img
                    draggable={false}
                    className={`flex object-cover mt-1 w-[55px] h-[50px] rounded-2xl ${
                      borderColorClass === "sandwich" ? "opacity-50" : ""
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

              {/* Overlay */}
              {selectedStyling ? (
                <div
                  className={`absolute w-[112%] h-[111%] rounded-xl -m-[4px] px-[4px] border-4 border-sandwich bg-sandwich opacity-50 border-opacity-50 inset-0 z-10`}
                ></div>
              ) : (
                <div></div>
              )}
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
