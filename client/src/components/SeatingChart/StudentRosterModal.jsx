import { useEffect, useState } from "react";
import SampleAvatar from '../../images/Sample_Avatar.png'
import UnassignedStudent from "./UnassignedStudent";
import CancelImg from "../../images/x-button.png"

const AddStudentModal = ({unassignedStudents, students, onClose, onConfirm}) => {

// FIXME: might still need, could switch the x and y coords to null 
    // setStudentPositions((prevPositions) => ({
    //     ...prevPositions,
    //     [itemId]: {
    //       x: parseInt(studentCoords[1]),
    //       y: parseInt(studentCoords[2]),
    //       assigned: false,
    //     },
    //   }));

    // TODO: Need to be able to add students back to the assigned students array

    const [selectedStudent, setSelectedStudent] = useState("")


    const addSelectedStudent = (currentStudentObj) => {

        console.log("1")
        setSelectedStudent((prevSelected) => {
            let isAlreadySelected = ""
            console.log("2")
            console.log("prevSelected: " + JSON.stringify(prevSelected))
            if (prevSelected) {
                isAlreadySelected = prevSelected.some(
                    (student) => student.student === currentStudentObj.student
                  );
            }
        
              if (isAlreadySelected) {
                console.log("3")
                return prevSelected.filter(
                  (student) => student.student !== currentStudentObj.student
                );
              } else {
                console.log("4")
                return [...prevSelected, currentStudentObj];
              }
        })
    }

    const handleConfirm = () => {
        // updateSeatingChart(selectedStudent);
        onConfirm(selectedStudent);
        onClose();
      };

  return (
    <>
        <div className="absolute top-60 left-[8.5%] z-10 h-[648px] w-[686px] bg-notebookPaper border-sandwich border-4 p-10 rounded">
        <div className="flex flex-col w-full bg-darkTeal items-end">
        <button onClick={() => console.log("Click click")}>
            <img className="absolute -top-6 -right-6" src={CancelImg} alt="close student roster" />
        </button>
      </div>
          <div className="flex h-full flex-col">
            <div className="flex flex-row h-3/4 flex-wrap overflow-y-auto">
                <UnassignedStudent unassignedStudents={unassignedStudents} students={students} selectedStudent={selectedStudent} addSelectedStudent={addSelectedStudent}/>
            </div>

            <div className="flex items-center h-1/3 justify-center">
            <button
              id="unassigned-section"
              className="flex items-center h-[90px] w-full flex-col rounded-2xl border-4 border-darkSandwich"
              onClick={() => {
                onConfirm(selectedStudent)
                onClose()
            }}
            >
              <h2 className="flex items-center h-full font-semibold text-header2">
                Confirm
              </h2>
            </button>
          </div>

            </div>
        </div>
    </>
  );
};

export default AddStudentModal;