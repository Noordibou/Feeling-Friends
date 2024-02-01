import { getBorderColorClass, cols } from '../utils/classroomColors';
import youngStudent from "../images/young-student.png";
const StudentBox = ({ student, index }) => {
    const lastJournal = student.journalEntries[student.journalEntries.length - 1];
    let zor, bgColorClass;

    if (lastJournal) {
        const lastCheckin = lastJournal.checkin;
        const lastCheckout = lastJournal.checkout;

        if (lastCheckout && lastCheckout.ZOR) {
            zor = lastCheckout.ZOR;
        } else if (lastCheckin && lastCheckin.ZOR) {
            zor = lastCheckin.ZOR;
        }

        if (zor) {
            bgColorClass = getBorderColorClass(zor);
        }
    }

    return (
        <>
        <div style={{
                gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                gridColumnStart: `${student.seatNumber % cols + 1}`,
            }}>
        <div
            key={`${student.id}-${index}`}
            className={`min-w-fit border-4 ${bgColorClass} rounded-lg m-2 `}
            
        >
            <img
  src={student.avatarImg === "none" ? youngStudent : student.avatarImg}
                alt={student.firstName}
            />

        </div>
        <div className="text-center font-body text-">
            {student.firstName}
        </div>
        </div>
        </>
    );
};

export default StudentBox;