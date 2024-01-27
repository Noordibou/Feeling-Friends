import { getBackgroundColorClass } from "../components/ClassRoomColors";

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

// FIXME: too many exceptions (long if else chain). Need to figure a way for this to be more generic
export const toggleSelected = (objItem, alreadySelected, isSelected) => {
  if (!alreadySelected) {
    return [...isSelected, objItem];
  } else if (alreadySelected){
    // need to get it unselected, remove it from isSelected Array
    console.log("objItem: " + JSON.stringify(objItem))
    let updatedSelection = null
    if(objItem.student) {
      updatedSelection = isSelected.filter(
        (item) => item.student !== objItem.student
      );
    } else if (objItem._id) {
      updatedSelection = isSelected.filter(
        (item) => item._id !== objItem._id
      );
    } else if (objItem.name) {
      updatedSelection = isSelected.filter(
        (item) => item.name !== objItem.name
      );
    } else {
      updatedSelection = isSelected.filter(
        (itemId) => itemId !== objItem
      );
    }
    return updatedSelection;
  }
};