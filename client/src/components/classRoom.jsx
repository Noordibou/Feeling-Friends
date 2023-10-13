const rows = 8;
const cols = 8; 

const layout = [];

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    layout.push(`seat-${i}-${j}`);
  } 
}

function getBackgroundColorClass(zor) {
  if (zor === 'Unmotivated' ) return "-blue";
  if (zor === 'Ready to Learn') return "-green";
  if (zor === 'Wiggly') return "-yellow";
  if (zor === 'Explosive') return "-orange";
  return "";
}

function getBorderColorClass(zor) {
  if (zor === 'Unmotivated' ) return "border-blue";
  if (zor === 'Ready to Learn') return "border-green";
  if (zor === 'Wiggly') return "border-yellow";
  if (zor === 'Explosive') return "border-orange";
  return "";
}

module.exports={
    layout,
    rows,
    cols,
    getBackgroundColorClass,
    getBorderColorClass
}