import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../pages/teacher/studentProfile/StudentProfile.css";


/* 
  FIXME: 
  when you go forward and find a week that is in 2 different months, and then go backward, it doesn't show the calendar.
  
  same when you go backward, find a week that's in 2 different months, and then go forward. 
*/

const WeekView = ({ events, handleDateClick, isMonthView }) => {
  const [visibleDates, setVisibleDates] = useState(getVisibleDates());
  const [currMonth, setCurrMonth] = useState("")

  function getVisibleDates() {
    let today = new Date();
    let dayOfWeek = today.getDay();

    let daysToLastMonday = (dayOfWeek + 6) % 7;
    let lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysToLastMonday);
    lastMonday.setHours(0, 0, 0, 0);

    let daysToThisSunday = (7 - dayOfWeek) % 7;
    let thisSunday = new Date(today);
    thisSunday.setDate(today.getDate() + daysToThisSunday);
    thisSunday.setHours(23, 59, 59, 999);

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
  
    console.log("Next Monday:", nextMonday);
    console.log("Next Sunday:", nextSunday);
    
    const curentMonth = document.querySelector('.react-calendar__navigation__label__labelText');
    const currentMonthText = curentMonth.textContent.split(" ")[0];
    setCurrMonth(currentMonthText)
  
    // Check if nextMonday is in the next month
    if (nextSunday.getMonth() !== visibleDates.end.getMonth() || (visibleDates.start.getMonth() !== visibleDates.end.getMonth() && currentMonthText.substring(0, 3) !== visibleDates.end.toString().split(" ")[1])) {
      console.log("Transitioning to next month" + JSON.stringify(nextSunday.getMonth()));
      // Trigger click event on the next button
      const nextButton = document.querySelector(".react-calendar__navigation__next-button");
      if (nextButton) {
        nextButton.click();
      }
    }
  
    setVisibleDates({ start: nextMonday, end: nextSunday });
  };

  const goToPrevWeek = () => {
    const prevSunday = new Date(visibleDates.start);
    prevSunday.setDate(prevSunday.getDate() - 1);
    prevSunday.setHours(23, 59, 59, 999);
  
    const prevMonday = new Date(prevSunday);
    prevMonday.setDate(prevSunday.getDate() - 6);
    prevMonday.setHours(0, 0, 0, 0);
  
    console.log("Prev Sunday:", prevSunday);
    console.log("Prev Monday:", prevMonday);
  
    const curentMonth = document.querySelector('.react-calendar__navigation__label__labelText');
    const currentMonthText = curentMonth.textContent.split(" ")[0];
    setCurrMonth(currentMonthText)

    if ((prevMonday.getMonth() !== visibleDates.start.getMonth()) || (visibleDates.start.getMonth() !== visibleDates.end.getMonth() && currentMonthText.substring(0, 3) !== visibleDates.start.toString().split(" ")[1])) {
      console.log("Transitioning to previous month" + JSON.stringify(prevMonday.getMonth()));
      // Trigger click event on the prev button
      const prevButton = document.querySelector(".react-calendar__navigation__prev-button");
      if (prevButton) {
        prevButton.click();
      }
    } 
    setVisibleDates({ start: prevMonday, end: prevSunday });
  };

  useEffect(() => {
    setVisibleDates(getVisibleDates());
  }, [isMonthView]);
  

  return (
    <div>
      <div className="relative top-6">
        <button
          alt="previous-week"
          className="absolute left-6 py-3 px-5 bg-white"
          onClick={goToPrevWeek}
        >
          &lt;
        </button>
        <button
          alt="next-week"
          className="absolute right-6 py-3 px-5 bg-white"
          onClick={goToNextWeek}
        >
          &gt;
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