import { getBorderColorClass, cols } from './classRoomColors';

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
        <div
            key={`${student.id}-${index}`}
            className={`min-w-fit border-4 ${bgColorClass} p-3 m-4 rounded-lg px-2`}
            style={{
                gridRowStart: `${Math.floor(student.seatNumber / cols) + 1}`,
                gridColumnStart: `${student.seatNumber % cols + 1}`,
            }}
        >
            {student.firstName}
        </div>
    );
};

export default StudentBox;