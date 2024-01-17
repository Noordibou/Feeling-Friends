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
  updateInfo,
}) => {
  const [studentSelection, setStudentSelection] = useState([]);

  // ✅ refactored
  const unassignedStudSelection = (studentObj) => {
    const alreadySelected = studentSelection.find(
      (student) => student.student === studentObj.student
    );

    console.log("student Obj: " + JSON.stringify(studentObj));
    if (!alreadySelected) {
      setStudentSelection([...studentSelection, studentObj]);
    } else {
      const updatedSelection = studentSelection.filter(
        (student) => student.student !== alreadySelected.student
      );
      setStudentSelection(updatedSelection);
    }
    console.log("student selection: " + JSON.stringify(studentSelection));
  };

  const handleConfirm = async () => {
    await updateSeatingChart(teacherId, classroomId, studentSelection);
    setStudentSelection([]);
    updateInfo();
    onClose();
  };

  const onClose = () => {
    setShowStudentRosterModal(false);
    setStudentSelection([]);
  };

  return (
    <>
    <div className="bg-[#D2C2A4] border-[8px] border-[#A59F8B] absolute top-[11.9%] left-[4.3%] z-10 w-[752px] h-[61%] rounded-lg opacity-90"></div>
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
