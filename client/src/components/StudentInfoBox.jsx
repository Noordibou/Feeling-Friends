import { getBackgroundColorClass } from "../utils/classroomColors";
import { Link } from "react-router-dom";
import avatarImg from "../images/Sample_Avatar.png";
import xButton from "../images/x-button.png";

const StudentInfoBox = ({
  student,
  userData,
  classroomId,
  handleClick,
  isEditMode,
}) => {
  let lastJournal = student.journalEntries
    ? student.journalEntries[student.journalEntries.length - 1]
    : null;

  let bgColorClass = "";
  let lastEmotion = "";
  let lastCheck = "";

  if (lastJournal) {
    if (lastJournal.checkout) {
      let lastCheckout = lastJournal.checkout;
      let zor = lastCheckout.ZOR;
      lastEmotion = lastCheckout.emotion;
      lastCheck = lastCheckout;
      bgColorClass = getBackgroundColorClass(zor);
    } else if (lastJournal.checkin) {
      let lastCheckin = lastJournal.checkin;
      let zor = lastCheckin.ZOR;
      lastEmotion = lastCheckin.emotion;
      lastCheck = lastCheckin;
      bgColorClass = getBackgroundColorClass(zor);
    }
  }
  return (
    <div className="relative flex flex-col h-full w-full" key={`${student.id}`}>
      {/* bg object */}
      <div
        className={`${
          bgColorClass
            ? `bg-${bgColorClass} border-${bgColorClass}`
            : "bg-[#ece6d2] border-sandwich"
        } border-4 shadow-2xl p-2 h-full rounded-lg flex flex-row`}
      >
        {/* student image */}
        <div
          className={`flex h-full my-auto ${
            bgColorClass ? "w-full" : "w-28 opacity-50"
          }`}
        >
          <img
            src={avatarImg}
            alt={`Avatar for ${student.firstName} ${student.lastName}`}
            className="flex w-24 h-24 rounded-2xl mr-4 "
          />
        </div>

        {/* text container */}
        <div className="flex flex-col w-[80%] px-4">
          {/* last emotion */}
          <div className="pb-2 flex justify-between">
            {lastCheck ? (
              <div className="font-[Poppins] text-md">
                <span>
                  {student.firstName} {student.lastName} is feeling{" "}
                </span>
                <b>{lastEmotion}</b>
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* goals & needs */}
          <div
            className={`${
              bgColorClass
                ? "bg-notebookPaper py-2 flex justify-around"
                : "w-full"
            } px-2 rounded-md `}
          >
            {lastCheck ? (
              <div className="flex flex-col w-72">
                <h5 className="font-[Poppins]">Goals: {lastCheck.goal}</h5>
                <h5 className="font-[Poppins]">Needs: {lastCheck.need}</h5>
              </div>
            ) : (
              <div className="flex flex-row">
                <h5 className="font-[Poppins]">
                  {student.firstName} {student.lastName} hasn't checked in
                  today.
                </h5>
              </div>
            )}

            <div
              className={`flex items-center underline text-md ${
                bgColorClass ? "w-24" : "w-full flex justify-end h-full pt-4"
              } px-2`}
            >
              <Link to={`/${userData._id}/${classroomId}/${student._id}`}>
                More &gt;
              </Link>
            </div>
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
