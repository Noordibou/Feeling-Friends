import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../pages/teacher/studentProfile/StudentProfile.css";

const WeekView = ({ events, handleDateClick }) => {

  const [visibleDates, setVisibleDates] = useState(getVisibleDates());
  function getVisibleDates() {
    let today = new Date();
    console.log("today: " + today);
    let dayOfWeek = today.getDay();
    console.log("day of week: " + dayOfWeek);
     
    // Calculate last Monday
    let daysToLastMonday = (dayOfWeek + 6) % 7;    
    let lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysToLastMonday);
    lastMonday.setHours(0, 0, 0, 0); // Set time to midnight
    console.log("Last Monday:", lastMonday);
    
    // Calculate this Sunday
    let daysToThisSunday = (7 - dayOfWeek) % 7;
    let thisSunday = new Date(today);
    thisSunday.setDate(today.getDate() + daysToThisSunday);
    thisSunday.setHours(23, 59, 59, 999); // Set time to end of day
    console.log("This Sunday:", thisSunday);
    
    return { start: lastMonday, end: thisSunday };
  }

  // function handleDateChange(date) {
  //   setVisibleDates(getVisibleDates(date));
  // }

  function isDateVisible(date) {
    console.log("other dates??: "+ JSON.stringify(date))
    if(date >= visibleDates.start && date <= visibleDates.end) {
      // console.log("date: "+ JSON.stringify(date))
      console.log("visibleDates: "+ JSON.stringify(visibleDates))
      return date >= visibleDates.start && date <= visibleDates.end;
    }
    
  }

  useEffect(() => {
    getVisibleDates();
    console.log("visible dates" + JSON.stringify(visibleDates))
  }, [])

  return (
    <Calendar
      className="react-calendar"
      tileClassName={({ date }) => {
        const event = events.find(
          (event) => event.date.toDateString() === date.toDateString()
        );
        if (event) {
          return `${event.className} `;
        }
        return "";
      }}
      tileDisabled={({ date }) => !isDateVisible(date)}
      onClickDay={handleDateClick}
    />
  );
};

export default WeekView;
