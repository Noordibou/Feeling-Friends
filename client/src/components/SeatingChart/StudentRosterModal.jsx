import { useState } from "react";
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
  const [isSelected, setIsSelected] = useState([]);

  const handleConfirm = async () => {
    await updateSeatingChart(teacherId, classroomId, isSelected);
    setIsSelected([]);
    updateInfo();
    onClose();
  };

  const onClose = () => {
    setShowStudentRosterModal(false);
    setIsSelected([]);
  };

  return (
    <>
      {/* bg cover over classroom */}
      <div className="bg-[#D2C2A4] border-[8px] border-[#A59F8B] fixed md:absolute mr-auto ml-auto z-30 md:mt-[175px] md:w-[752px] w-screen h-screen md:h-[61%] rounded-lg opacity-90"></div>

      {/* add student modal */}

      <div className="fixed md:absolute top-20 md:top-0 md:mt-[222px] z-30 h-[70%] md:h-[55%] w-[85%] md:w-[686px] bg-notebookPaper border-sandwich border-4 p-10 rounded">
        <div className="flex flex-col w-full items-end">
          <button onClick={onClose}>
            <img
              className="absolute -top-6 -right-6"
              src={CancelImg}
              alt="close student roster"
            />
          </button>
        </div>
        {unassignedStudents.length > 0 ? (
          <div className="flex w-full h-full flex-col">
            <div className="flex flex-row h-[220%] md:h-3/4 flex-wrap overflow-y-auto">
              <UnassignedStudent
                unassignedStudents={unassignedStudents}
                students={students}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
              />
            </div>

            <div className="flex items-end h-72 md:h-1/3 justify-center">
              <button
                id="unassigned-section"
                className="flex items-center h-[50px] md:h-[90px] w-full flex-col rounded-2xl border-4 border-darkSandwich"
                onClick={() => {
                  handleConfirm();
                }}
              >
                <h2 className="flex items-center h-full font-semibold text-[20px] md:text-header2">
                  Confirm
                </h2>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full text-center justify-center pt-20">
            <h2 className="text-black text-[200%]">
              All students have been assigned in the classroom!
            </h2>
          </div>
        )}
      </div>
    </>
  );
};

export default AddStudentModal;
