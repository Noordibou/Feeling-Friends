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

  const goToNextWeek = () => {
    const nextMonday = new Date(visibleDates.end);
    nextMonday.setDate(nextMonday.getDate() + 1);
    nextMonday.setHours(0, 0, 0, 0);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    nextSunday.setHours(23, 59, 59, 999);
    setVisibleDates({ start: nextMonday, end: nextSunday });
  };

  const goToPreviousWeek = () => {
    const prevSunday = new Date(visibleDates.start);
    prevSunday.setDate(prevSunday.getDate() - 1);
    prevSunday.setHours(23, 59, 59, 999);
    const prevMonday = new Date(prevSunday);
    prevMonday.setDate(prevSunday.getDate() - 6);
    prevMonday.setHours(0, 0, 0, 0);
    setVisibleDates({ start: prevMonday, end: prevSunday });
  };

  useEffect(() => {
    setVisibleDates(getVisibleDates());
  }, []);

  return (
    <div>
      <div>
        <button
          className="react-calendar__navigation__prev-button"
          onClick={goToPreviousWeek}
        >
          Previous Week
        </button>
        <button
          className="react-calendar__navigation__next-button"
          onClick={goToNextWeek}
        >
          Next Week
        </button>
      </div>
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
    </div>
  );
};

export default WeekView;