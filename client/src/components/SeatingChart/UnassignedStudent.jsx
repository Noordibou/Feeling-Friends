import { useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import SampleAvatar from "../../images/Sample_Avatar.png";
import { toggleSelected } from "../../utils/utils";

const UnassignedStudent = ({
  unassignedStudents,
  unassignedStudSelection,
  students,
  isSelected,
  setIsSelected
}) => {
  return (
    <>
      {unassignedStudents.map((studentObj, index) => {
        const unassignedStudent = students.find(
          (student) => student._id === studentObj.student
        );

        if (unassignedStudent) {
          const isSelectedStudent = isSelected.some(
            (selected) => selected.student === studentObj.student
          );

          const newFormat = {
            student: studentObj.student,
            seatInfo: {
              x: 0,
              y: 0,
              assigned: true,
            }
          }

          const alreadySelected = isSelected.some(
            (student) => student.student === studentObj.student
          );

          return (
            <div
              id={`motion-div-${unassignedStudent._id}`}
              key={`unassigned-${index}`}
              className={`m-2 bg-${
                unassignedStudent.borderColorClass
              } h-[99px] w-[99px] 
                rounded-2xl ${isSelectedStudent ? `opacity-50` : ``}`}
              onClick={() => {
                setIsSelected(toggleSelected(newFormat, alreadySelected, isSelected))
              }}
            >
              <div className="flex w-full justify-center h-full items-center">
                <img
                  className="flex object-cover h-[84px] w-[84px] rounded-2xl"
                  src={SampleAvatar}
                />
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

export default UnassignedStudent;
