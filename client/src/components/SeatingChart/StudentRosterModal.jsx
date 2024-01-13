import { useEffect, useState } from "react";
import SampleAvatar from "../../images/Sample_Avatar.png";
import UnassignedStudent from "./UnassignedStudent";
import CancelImg from "../../images/x-button.png";
import { updateSeatingChart } from "../../api/teachersApi";

const AddStudentModal = ({
  unassignedStudents,
  students,
  setShowStudentRosterModal,
  teacherId,
  classroomId,
  fetchData
}) => {
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


  const [studentSelection, setStudentSelection] = useState([])

  const unassignedStudSelection = (studentObj) => {
    const alreadySelected = studentSelection.find((student) => student.student === studentObj.student)

    console.log("student Obj: " + JSON.stringify(studentObj))
    if(!alreadySelected) {
      const updatedStudentObj = {
        student: studentObj.student,
        seatInfo: {
          x: 0,
          y: 0,
          assigned: true,
        }
      };
      setStudentSelection([...studentSelection, updatedStudentObj])
    } else {
      const updatedSelection = studentSelection.filter((student) => student.student !== alreadySelected.student)
      setStudentSelection(updatedSelection)
    }
    console.log("student selection: " + JSON.stringify(studentSelection))
  }

  // TODO: save studentSelection array to backend
  // TODO: check if I need to add the student Selection to assignedStudents array, or if it's already set up to do so?
  const handleConfirm = () => {
    updateSeatingChart(teacherId, classroomId, studentSelection);
    fetchData();
    // I think I need to save to selected students
    // onConfirm();
    onClose();
  };

  const onClose = () => {
    setShowStudentRosterModal(false);
    setStudentSelection([])
  };

  return (
    <>
      <div className="absolute top-44 left-[8.5%] z-10 h-[648px] w-[686px] bg-notebookPaper border-sandwich border-4 p-10 rounded">
        <div className="flex flex-col w-full bg-darkTeal items-end">
          <button onClick={onClose}>
            <img
              className="absolute -top-6 -right-6"
              src={CancelImg}
              alt="close student roster"
            />
          </button>
        </div>
        <div className="flex h-full flex-col">
          <div className="flex flex-row h-3/4 flex-wrap overflow-y-auto">
            <UnassignedStudent
              unassignedStudents={unassignedStudents}
              students={students}
              unassignedStudSelection={unassignedStudSelection}
              studentSelection={studentSelection}
              // selectedStudent={selectedStudent} probably don't need this?
              // addSelectedStudent={addSelectedStudent} Probably need this
            />
          </div>

          <div className="flex items-center h-1/3 justify-center">
            <button
              id="unassigned-section"
              className="flex items-center h-[90px] w-full flex-col rounded-2xl border-4 border-darkSandwich"
              onClick={() => {
                handleConfirm();
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
