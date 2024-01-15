import { getBackgroundColorClass } from "../components/classRoomColors";

// This transforms application state to presentation state
// // means that this is something that can be unit tested
export const applyColorsToStudents = (classroomStudents) => {
  // Calculate the border color for each student
  const studentsWithBorderColor = classroomStudents.map((student) => {
    const lastJournal =
      student.journalEntries[student.journalEntries.length - 1];
    if (lastJournal) {
      const lastCheckin = lastJournal.checkin;
      const lastCheckout = lastJournal.checkout;
      if (lastCheckout && lastCheckout.ZOR) {
        const zor = lastCheckout.ZOR;
        student.borderColorClass = getBackgroundColorClass(zor);
      } else if (lastCheckin && lastCheckin.ZOR) {
        const zor = lastCheckin.ZOR;
        student.borderColorClass = getBackgroundColorClass(zor);
      } else {
        student.borderColorClass = "darkSandwich";
      }
    } else {
      student.borderColorClass = "darkSandwich";
    }
    return student;
  });
  return studentsWithBorderColor
};