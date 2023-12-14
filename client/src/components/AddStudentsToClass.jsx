import { useEffect, useState } from "react";

const AddStudentModal = ({unassignedStudents, students}) => {

  
  return (
    <>
        <div className="absolute top-60 left-32 z-10 h-[500px] w-[500px] bg-sandwich border-darkSandwich p-10">
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
                        <span className="bg-white">
                            {unassignedStudent.firstName}
                        </span>
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