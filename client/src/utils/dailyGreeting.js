
export const checkTimeOfDay = () => {
  let date = new Date();
  let hour = date.getHours();

  if (hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};
