import { getBackgroundColorClass } from "./ClassRoomColors";
import { Link } from "react-router-dom";
import avatarImg from '../images/Sample_Avatar.png'

const StudentInfoBox = ({ student, userData, classroomId }) => {
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
        <div className={`bg-${bgColorClass} my-3 p-4 h-full rounded-lg flex flex-row items-center`}>
          {/* student image */}
          <div className="flex h-full">
            <img
              src={avatarImg}
              alt={`Avatar for ${student.firstName} ${student.lastName}`}
              className="flex w-20 h-20 rounded-full mr-4 items-center"
            />
          </div>

          {/* text container */}
          <div className="flex flex-col">
            {/* last emotion */}
            <div className="pb-2 flex justify-between">
              <div>
                {student.firstName} {student.lastName} is feeling{" "}
                <b>{lastEmotion}</b>
              </div>
            </div>

            {/* goals & needs */}
            <div className="bg-notebookPaper px-2 py-2 rounded-md flex justify-between">
              Goals: {lastCheck.goal}
              <br />
              Needs: {lastCheck.need}
              <div className="pt-3 mr-2 underline">
                <Link to={`/${userData._id}/${classroomId}/${student._id}`}>
                  More &gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentInfoBox;