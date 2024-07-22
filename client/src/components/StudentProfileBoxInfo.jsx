import { useEffect, useState } from "react"
import { getBackgroundColorClass } from "../utils/classroomColors";
import { Link } from "react-router-dom";
import avatarImg from "../images/Sample_Avatar.png";
import xButton from "../images/x-button.png";
import { getLastJournalInfo } from "../utils/editSeatChartUtil";

// NOTE: this is a temporary file 
// originally setting this up so it's easier to fix this file for Student Profile page, and not to muddle or undo too much code in the Student Profile page. 


// TODO: 
// // lastCheck, bgColorClass, and lastEmotion cannot work with getLastJournalInfo. Need to create separate logic in this component.

// // NOTE: Events is being passed through but still need to get the specific event pertaining to the selected date (in selected Entry ) 


const StudentProfileBoxInfo = ({
  student,
  selectedEntry,
  setOpenStudentInfoModal
}) => {

  const [bgColorClass, setBgColorClass] = useState("sandwich");
  
  useEffect(() => {
    if (selectedEntry) {
      const color = getBackgroundColorClass(selectedEntry.ZOR);
      setBgColorClass(color);
    } else {
      setBgColorClass("sandwich")
    }

  }, [selectedEntry])


  return (
    <div className="relative flex flex-col w-[85%] md:w-[450px]" key={`${student?._id}`}>
      {/* bg object */}
      <div
        className={`${
          bgColorClass
            ? `bg-${bgColorClass} border-${bgColorClass}`
            : "bg-[#ece6d2] border-sandwich"
        } border-4 shadow-2xl p-2 h-full rounded-lg flex flex-row`}
      >

        {/* text container */}
        <div className="flex flex-col px-4">
          <h5 className="pl-5 font-[Poppins] text-[12px] md:text-[16px]">{selectedEntry ? selectedEntry.date : null}</h5>
          {/* last emotion */}
          <div className="pb-2">
            {selectedEntry ? (
              <div className="font-[Poppins] text-[14px] md:text-[16px] ml-5">
                <span>
                  {student?.firstName} {student?.lastName} is feeling{" "}
                </span>
                <b>{selectedEntry.emotion}</b>
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* goals & needs */}
          <div
            className={`${
              bgColorClass
                ? "bg-notebookPaper py-2 ml-5 flex"
                : "w-full"
            } px-5 rounded-md `} 
          >
            {selectedEntry ? (
              <div className="flex flex-col text-[12px] md:text-[16px] w-full md:w-72">
                <h5 className="font-[Poppins]">Goals: {selectedEntry.goal}</h5>
                <h5 className="font-[Poppins]">Needs: {selectedEntry.need}</h5>
              </div>
            ) : (
              <div className="flex flex-col text-[14px] md:text-[16px] w-full md:w-72 h-16">
                <h5 className="font-[Poppins]">
                  {student?.firstName} {student?.lastName} didn't check in or out.
                </h5>
              </div>
            )}
          </div>
        </div>
      </div>
        <div className="absolute -top-5 self-end -right-5">
          <button onClick={() => setOpenStudentInfoModal(false)}>
            <img src={xButton} alt="x Button" />
          </button>
        </div>

    </div>
  );
};

export default StudentProfileBoxInfo;
