import { getBackgroundColorClass } from "../utils/classroomColors";
import { Link } from "react-router-dom";
import avatarImg from '../images/Sample_Avatar.png'
import xButton from "../images/x-button.png"

const StudentInfoBox = ({ student, userData, classroomId, setSelectedStudent }) => {
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
  } else {
    console.log("oh well")
  }
  return (
    <>
      <div className="flex flex-col h-full w-full" key={`${student.id}`}>
        {/* bg object */}
        <div className={`${bgColorClass ? `bg-${bgColorClass}` : "bg-graphite border-black"} shadow-2xl my-3 p-4 h-full rounded-lg flex flex-row items-center`}>
          {/* student image */}
          <div className="flex h-full w-full">
            <img
              src={avatarImg}
              alt={`Avatar for ${student.firstName} ${student.lastName}`}
              className="flex w-24 h-24 rounded-2xl mr-4 items-center"
            />
          </div>

          {/* text container */}
          <div className="flex flex-col w-96 px-4">
            {/* last emotion */}
            <div className="pb-2 flex justify-between">
            {lastCheck ? 
              <div className="font-[Poppins] text-md">
                <span>{student.firstName} {student.lastName} is feeling{" "}</span>
                <b>{lastEmotion}</b>
              </div>
              :
              <></>
            }
            </div>

            {/* goals & needs */}
            <div className="bg-notebookPaper px-2 py-2 rounded-md flex justify-around ">
              {lastCheck ? 
                <div className="flex flex-col w-72">
                  <h5 className="font-[Poppins]">Goals: {lastCheck.goal}</h5>
                  <h5 className="font-[Poppins]">Needs: {lastCheck.need}</h5>
                </div> :
                <div className="flex flex-col w-60">
                  <h5 className="font-[Poppins]">{student.firstName} {student.lastName} didn't
                  check in or out yet!</h5>
                </div>
              }
              
              <div className="flex items-center underline text-md w-24 px-2">
                <Link to={`/${userData._id}/${classroomId}/${student._id}`}>
                  More &gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-3 -right-5">
          <button
            onClick={() =>
              setSelectedStudent({})
            }
          >
            <img src={xButton} alt="x Button" />
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentInfoBox;