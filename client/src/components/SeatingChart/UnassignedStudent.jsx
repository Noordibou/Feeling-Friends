import { useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import SampleAvatar from "../../images/Sample_Avatar.png"

const UnassignedStudent = ({ unassignedStudents, students, selectedStudent, addSelectedStudent }) => {
  
  return (
    <>
    {unassignedStudents.map((studentObj, index) => {
        const unassignedStudent = students.find(
            (student) => student._id === studentObj.student
        );

        if (unassignedStudent) {
            return (
            <div
                id={`motion-div-${unassignedStudent._id}`}
                key={`unassigned-${index}`}
                className={`m-2 bg-${unassignedStudent.borderColorClass} h-[99px] w-[99px] ${
                    selectedStudent.includes(studentObj.student) 
                    ? "opacity-50"
                    : ""
                } rounded-2xl`}
                onClick={() => addSelectedStudent(studentObj)}
            >
                <div className="flex w-full justify-center h-full items-center">
                    <img className="flex object-cover h-[84px] w-[84px] rounded-2xl" src={SampleAvatar} />
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
