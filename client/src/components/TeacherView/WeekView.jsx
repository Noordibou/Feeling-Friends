import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../pages/teacher/studentProfile/StudentProfile.css";

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

  document.querySelector('.react-calendar__navigation__prev-button').style.display = 'none';
  document.querySelector('.react-calendar__navigation__next-button').style.display = 'none';

  useEffect(() => {
    setVisibleDates(getVisibleDates());
  }, [isMonthView]);
  

  return (
    <div className="w-[280px] xs:w-[330px] sm:w-[400px] md:w-[530px]">
      <div className="relative top-[22px]">
        <button
          type="button"
          alt="previous-week"
          className="absolute font-arrow text-gray text-[16px] font-semibold left-[19.5px] py-3 px-5 bg-notebookPaper "
          onClick={goToPrevWeek}
        >
          ‹
        </button>
        <button
          type="button"
          alt="next-week"
          className="absolute font-arrow text-gray text-[16px] font-semibold right-[15.5px] md:right-[49.5px] py-3 px-5 bg-notebookPaper"
          onClick={goToNextWeek}
        >
          ›
        </button>
      </div>
      <Calendar
        className="react-calendar week-view"
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