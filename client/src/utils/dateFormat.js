function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

 
  if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
      age--;
  }

  return age;
};

function formatDate(dateString) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return ""; // or any default value you prefer
}

  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
};

// get current date format just as it is saved in the backend (2-12-2024)
// // the above date formatter uses 2/12/2024 format
function getCurrentDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  
  return `${month}-${day}-${year}`;
}

function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":");

  let formattedHours = parseInt(hours, 10) % 12 || 12;

  const formattedMinutes = minutes ? String(minutes).padStart(2, "0") : "00";
  const period = parseInt(hours, 10) >= 12 ? "PM" : "AM";

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

export { calculateAge, formatDate, getCurrentDate, formatTime };
