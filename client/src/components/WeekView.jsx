import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../pages/teacher/studentProfile/StudentProfile.css";

const WeekView = ({ events, handleDateClick }) => {

  const [visibleDates, setVisibleDates] = useState(getVisibleDates());
  function getVisibleDates() {
    let today = new Date();
    let dayOfWeek = today.getDay();
     
    // Calculate last Monday
    let daysToLastMonday = (dayOfWeek + 6) % 7;    
    let lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysToLastMonday);
    lastMonday.setHours(0, 0, 0, 0); // Set time to midnight
    
    // Calculate this Sunday
    let daysToThisSunday = (7 - dayOfWeek) % 7;
    let thisSunday = new Date(today);
    thisSunday.setDate(today.getDate() + daysToThisSunday);
    thisSunday.setHours(23, 59, 59, 999); // Set time to end of day
    
    return { start: lastMonday, end: thisSunday };
  }

  function isDateVisible(date) {
    return date >= visibleDates.start && date <= visibleDates.end;    
  }

  useEffect(() => {
    getVisibleDates();
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
