const rows = 8;
const cols = 8; 

const layout = [];

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    layout.push(`seat-${i}-${j}`);
  } 
}

function getBackgroundColorClass(zor) {
  if (zor === 'Unmotivated' ) return "blue";
  if (zor === 'Ready to Learn') return "green";
  if (zor === 'Wiggly') return "yellow";
  if (zor === 'Explosive') return "orange";
  return "";
};

function getBorderColorClass(zor) {
  if (zor === 'Unmotivated' ) return "border-blue";
  if (zor === 'Ready to Learn') return "border-green";
  if (zor === 'Wiggly') return "border-yellow";
  if (zor === 'Explosive') return "border-orange";
  return "";
};

const calculateZorPercentage = (classroom) => {
  if (classroom.students && classroom.students.length > 0) {
    const totalStudents = classroom.students.length;
    const zorCounts = {
      'Unmotivated': 0,
      'Ready to Learn': 0,
      'Wiggly': 0,
      'Explosive': 0,
    };

    classroom.students.forEach((student) => {
      if (student.journalEntries && student.journalEntries.length > 0) {
        const lastJournal = student.journalEntries[student.journalEntries.length - 1];
        if (lastJournal.checkout && lastJournal.checkout.ZOR) {
          const zor = lastJournal.checkout.ZOR;
          zorCounts[zor]++;
        }
      }
    });

    const percentages = {};
    for (const zor in zorCounts) {
      percentages[zor] = Math.round((zorCounts[zor] / totalStudents) * 100);
    }

    return percentages;
  }
  return {};
};

module.exports={
    layout,
    rows,
    cols,
    getBackgroundColorClass,
    getBorderColorClass,
    calculateZorPercentage,

}