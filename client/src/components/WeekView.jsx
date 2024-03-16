import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../pages/teacher/studentProfile/StudentProfile.css";

const WeekView = ({ events, handleDateClick }) => {
  let today = new Date('March 20, 2024');
  let dayOfWeek = today.getDay();

  let daysToLastMonday = (dayOfWeek + 6) % 7;
  let lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysToLastMonday);

  console.log("Last Monday:", lastMonday);

  let daysToThisSunday = (7 - dayOfWeek) % 7;
  let thisSunday = new Date(today);
  thisSunday.setDate(today.getDate() + daysToThisSunday);

  console.log("This Sunday:", thisSunday);

  // Function to calculate the date for the next Monday (start of next week)
  const getNextMonday = (currentMonday) => {
    let nextMonday = new Date(currentMonday);
    nextMonday.setDate(currentMonday.getDate() + 7);
    return nextMonday;
  };

  // Function to calculate the date for the previous Monday (start of previous week)
  const getPreviousMonday = (currentMonday) => {
    let previousMonday = new Date(currentMonday);
    previousMonday.setDate(currentMonday.getDate() - 7);
    return previousMonday;
  };

  // Handle click event for the back arrow button (move to previous week)
  const handleBackButtonClick = () => {
    lastMonday = getPreviousMonday(lastMonday);
    thisSunday = new Date(lastMonday);
    thisSunday.setDate(thisSunday.getDate() + 6);
    console.log("Previous Week:", lastMonday, "-", thisSunday);
  };

  // Handle click event for the forward arrow button (move to next week)
  const handleForwardButtonClick = () => {
    lastMonday = getNextMonday(lastMonday);
    thisSunday = new Date(lastMonday);
    thisSunday.setDate(thisSunday.getDate() + 6);
    console.log("Next Week:", lastMonday, "-", thisSunday);
  };

  const backArrowButtons = document.getElementsByClassName(
    "react-calendar__navigation__prev-button"
  );
  for (let button of backArrowButtons) {
    button.removeAttribute("disabled");
    button.addEventListener("click", handleBackButtonClick);
  }

  // Example: Get all elements with class 'forward-arrow' and bind click event handler
  const forwardArrowButtons = document.getElementsByClassName(
    "react-calendar__navigation__next-button"
  );
  for (let button of forwardArrowButtons) {
    button.removeAttribute("disabled");
    button.addEventListener("click", handleForwardButtonClick);
  }

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
      onClickDay={handleDateClick}
      minDate={lastMonday}
      maxDate={thisSunday}
    />
  );
};

export default WeekView;
