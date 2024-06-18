import { getBackgroundColorClass } from "./classroomColors";
import { getCurrentDate } from "./dateFormat";

export function getLastJournalInfo(student) {
  // returns if student has 0 journal entries
  if (!student.journalEntries || student.journalEntries.length === 0) {
    return {
      borderColorClass: "sandwich",
      bgColorClass: "",
      lastCheck: null,
      lastEmotion: "",
    };
  }

  const currentDate = getCurrentDate();
  const todaysEntries = student.journalEntries.filter(entry => entry.date === currentDate);

  if (todaysEntries.length === 0) {
    return {
      borderColorClass: "sandwich",
      bgColorClass: "notebookPaper",
      lastCheck: null,
      lastEmotion: "",
    };
  }

  const lastJournal = todaysEntries[todaysEntries.length - 1];
  const { checkout, checkin } = lastJournal || {};
  const zor = checkout?.ZOR || checkin?.ZOR;

  // formatting exported values
  const borderColorClass = zor ? getBackgroundColorClass(zor) : "sandwich";
  const bgColorClass = getBackgroundColorClass(
    lastJournal.checkout?.ZOR || lastJournal.checkin?.ZOR
  );
  const lastCheck = lastJournal?.checkout || lastJournal?.checkin;
  const lastEmotion = lastCheck?.emotion || "";
  return { borderColorClass, bgColorClass, lastCheck, lastEmotion };
}

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