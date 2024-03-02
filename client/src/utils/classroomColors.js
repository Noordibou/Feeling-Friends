import subEmotionInfo from "../data/subEmotions";
import { getCurrentDate } from "./dateFormat";

export const rows = 8;
export const cols = 8; 

export const layout = [];

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    layout.push(`seat-${i}-${j}`);
  } 
}

export function getEmotionColor(chosenEmotion) {
  const emotionColors = {
    Nervous: "lightOrange",
    Sad: "lightBlue",
    Angry: "pink",
    Scared: "lightLavender",
    Happy: "darkTeal",
    Proud: "lightYellow",
  };

  for (const emotionInfo of subEmotionInfo) {
    if (emotionInfo.subEmotions.includes(chosenEmotion)) {
      const mainEmotion = emotionInfo.emotion;
      return emotionColors[mainEmotion];
    }
  }
  return "darkSandwich";
}

export function getBackgroundColorClass(zor) {
  if (zor === "Unmotivated") return "blue";
  if (zor === "Ready to Learn") return "green";
  if (zor === "Wiggly") return "yellow";
  if (zor === "Explosive") return "orange";
  return "sandwich";
};

export function getBorderColorClass(zor) {
  if (zor === 'Unmotivated' ) return "border-blue";
  if (zor === 'Ready to Learn') return "border-green";
  if (zor === 'Wiggly') return "border-yellow";
  if (zor === 'Explosive') return "border-orange";
  return "";
};

export const calculateZorPercentage = (classroom) => {
  if (classroom.students && classroom.students.length > 0) {
    const currentDate = getCurrentDate();
    const totalStudents = classroom.students.length;
    const zorCounts = {
      'Unmotivated': 0,
      'Ready to Learn': 0,
      'Wiggly': 0,
      'Explosive': 0,
    };

    classroom.students.forEach((student) => {
      if (student.journalEntries && student.journalEntries.length > 0) {
        const todaysEntries = student.journalEntries.filter(entry => entry.date === currentDate);

        if (todaysEntries.length > 0) {
          const lastJournal = todaysEntries[todaysEntries.length - 1];
          const zor = lastJournal.checkout?.ZOR || lastJournal.checkin?.ZOR;
          if (zor) {
            zorCounts[zor]++
          }
        }
      }
    });

    const percentages = {};
    for (const zor in zorCounts) {
      const percentage = Math.round((zorCounts[zor] / totalStudents) * 100);
      if (zorCounts[zor] !== 0) {
        percentages[zor] = percentage;
      }
    }
    
    return percentages;
  }
  return {};
};