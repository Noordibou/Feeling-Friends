import SampleAvatar from "../../images/Sample_Avatar.png";
import { toggleSelected } from "../../utils/editSeatChartUtil";
import { getLastJournalInfo } from "../../utils/editSeatChartUtil";

const UnassignedStudent = ({
  unassignedStudents,
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

          
          const { borderColorClass } = getLastJournalInfo(unassignedStudent)

          return (
            <div
              id={`motion-div-${unassignedStudent._id}`}
              key={`unassigned-${index}`}
              className={`m-2 bg-${
                borderColorClass
              } w-[70px] h-[90px] md:h-[110px] md:w-[94px] 
              rounded-xl ${isSelectedStudent ? `opacity-50 border-black border-2` : ``}`}
              onClick={() => {
                setIsSelected(toggleSelected(newFormat, alreadySelected, isSelected))
              }}
            >
              <div className="flex flex-col w-full justify-center h-full items-center">
                <div className="">
                  <img
                    className={`flex object-cover px-1 md:px-0 md:h-[75px] md:w-[75px] rounded-xl ${borderColorClass === "sandwich" ? "opacity-60" : ""}`}
                    src={SampleAvatar}
                  />
                </div>
                <div className="flex flex-row text-[12px] text-center md:text-[15px]">
                  <h2>{unassignedStudent.firstName} {unassignedStudent.lastName.charAt(0)}.</h2>  
                </div>
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
