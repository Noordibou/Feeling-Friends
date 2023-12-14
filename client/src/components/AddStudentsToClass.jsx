import { useEffect, useState } from "react";
import SampleAvatar from '../images/Sample_Avatar.png'

const AddStudentModal = ({unassignedStudents, students}) => {

// FIXME: might still need, could switch the x and y coords to null 
    // setStudentPositions((prevPositions) => ({
    //     ...prevPositions,
    //     [itemId]: {
    //       x: parseInt(studentCoords[1]),
    //       y: parseInt(studentCoords[2]),
    //       assigned: false,
    //     },
    //   }));


  
  return (
    <>
        <div className="absolute top-60 left-[8.5%] z-10 h-[648px] w-[686px] bg-notebookPaper border-sandwich border-4 p-10 rounded">
            <div className="flex flex-row flex-wrap">
            {unassignedStudents.map((studentId, index) => {
                const unassignedStudent = students.find(
                    (student) => student._id === studentId.student
                );

                if (unassignedStudent) {
                    return (
                    <div
                        id={`motion-div-${unassignedStudent._id}`}
                        key={`unassigned-${index}`}
                        className={`m-2 bg-${unassignedStudent.borderColorClass} h-[99px] w-[99px] rounded-2xl`}
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
            </div>
        </div>
    </>
  );
};

export default AddStudentModal;