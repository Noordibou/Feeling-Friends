import { useEffect, useState } from "react";

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
        <div className="absolute top-60 left-16 z-10 h-[648px] w-[686px] bg-notebookPaper border-sandwich border-4 p-10 rounded">
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
                        className={`mx-1 border-4 ${unassignedStudent.borderColorClass} rounded-lg h-[80px] w-[80px]`}
                    >
                        <h1 className="flex h-full text-center flex-col-reverse bg-lightYellow">
                        
                        </h1>
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