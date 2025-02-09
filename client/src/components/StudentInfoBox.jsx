import { getBackgroundColorClass } from "../utils/classroomColors";
import { Link } from "react-router-dom";
import avatarImg from "../images/Sample_Avatar.png";
import xButton from "../images/x-button.png";
import { getLastJournalInfo } from "../utils/editSeatChartUtil";

const StudentInfoBox = ({
  student,
  userData,
  classroomId,
  handleClick,
  isEditMode,
}) => {
  const { bgColorClass, lastCheck, lastEmotion, borderColorClass } =
    getLastJournalInfo(student);

  return (
    <div className="relative flex flex-col h-full w-full" key={`${student.id}`}>
      {/* bg object */}
      <div
        className={`${
          bgColorClass
            ? `bg-notebookPaper border-${borderColorClass}`
            : "bg-[#ece6d2] border-sandwich"
        } border-4 shadow-2xl h-full w-full rounded-lg flex flex-row `}
      >
        {/* student image */}
        <div
          className={`flex ${
            bgColorClass
              ? `w-28 md:w-32 bg-${bgColorClass} justify-center border-${borderColorClass}`
              : "w-28 md:w-32 opacity-50 bg-[#ece6d2] justify-center border-sandwich"
          }`}
        >
          <img
            src={student.avatarImg === "none" ? avatarImg : student.avatarImg}
            alt={student.firstName}
            className={`flex w-20 h-20 md:w-24 md:h-24 rounded-2xl p-2 self-center  ${
              borderColorClass === "sandwich" ? "opacity-50" : ""
            }`}
          />
        </div>

        {/* text container */}
        <div className="flex flex-col justify-between sm:flex-row w-full sm:w-[80%] px-2 sm:px-4 my-2 sm:my-5">
          <div>
            {/* last emotion */}
            <div className="md:pb-2 flex justify-between">
              {lastCheck ? (
                <div className="font-[Poppins] text-[14px] sm:text-[17px] px-2">
                  <h4>
                    {student.firstName} {student.lastName}
                  </h4>
                  <span>is feeling </span>
                  <b className="font-semibold underline">{lastEmotion}</b>
                </div>
              ) : (
                <></>
              )}
            </div>

            {/* goals & needs */}
            <div
              className={`flex px-2 rounded-md ${
                bgColorClass ? "bg-notebookPaper py-2 sm:justify-around" : ""
              }`}
            >
              {lastCheck ? (
                <div className="hidden xs:flex flex-col sm:w-60">
                  <h5 className="font-[Poppins] text-[12px] md:text-[14px]">
                    <b>Goals:</b> {lastCheck.goal}
                  </h5>
                  <h5 className="font-[Poppins] text-[12px] md:text-[14px]">
                    <b>Needs:</b> {lastCheck.need}
                  </h5>
                </div>
              ) : (
                <div className="flex flex-col sm:w-60 sm:h-16">
                  <h5 className="font-[Poppins] text-[14px] sm:text-[17px] w-24 xs:w-44 sm:w-60">
                    {student.firstName} {student.lastName} hasn't checked in
                    today.
                  </h5>
                </div>
              )}
            </div>
          </div>
          <div
            className={`flex items-center justify-center sm:justify-end underline text-[14px] sm:text-[17px] ${
              bgColorClass ? "w-16" : "w-16"
            }`}
          >
            <Link to={`/${userData._id}/${classroomId}/${student._id}`}>
              More &gt;
            </Link>
          </div>
        </div>
      </div>
      {isEditMode ? (
        <div className="absolute -top-5 self-end -right-5">
          <button onClick={handleClick}>
            <img src={xButton} alt="x Button" />
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default StudentInfoBox;
