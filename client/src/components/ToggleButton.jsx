import React, { useState } from "react";
import sortByCriteria from "../utils/sortStudents.js";
import aToZIcon from "../images/sort-z-a.png";
import regZoneIcon from "../images/reg_zone_icon.png";
import aToZLigthIcon from "../images/sort-z-a-light.png";

// This is specifically for sorting (sort by regulatory zone and sort by last name)

const ToggleButton = ({ students, setStudents }) => {
  const [sortCriteria, setSortCriteria] = useState();
  const [sortDirection, setSortDirection] = useState("asc");

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
    toggleSortDirection();
    const sorted = sortByCriteria(students, criteria, sortDirection);
    setStudents(sorted);
  };

  return (
    <>
      <div className="flex flex-col justify-center w-[90%] max-w-[700px] sm:w-[80%] mr-auto ml-auto">
        <p className="mb-2 md:my-3 font-semibold md:text-body sm:font-body">
          Sorted By
        </p>

        <div className="flex w-full justify-center">
          <div className="flex pr-[0.5rem] w-full justify-center">
            <button
              className={`flex items-center justify-between rounded-[1.3rem] ${
                sortCriteria === "zor"
                  ? "border-sandwich border-[4px] bg-sandwich font-semibold"
                  : "border-[4px] border-sandwich"
              } px-[1rem] py-[8px] md:w-[20rem] w-full `}
              onClick={() => {
                handleSort("zor");
              }}
            >
              <p className="text-[12px] font-[Poppins] md:text-[18px] sm:font-body text-left">
                Regulatory Zone
              </p>
              <img className="" src={regZoneIcon} alt="" />
            </button>
          </div>

          <div className="pl-[0.5rem] w-full">
            <button
              className={`flex items-center justify-between md:text-body font-body rounded-[1.3rem] ${
                sortCriteria === "lastName"
                  ? "border-sandwich border-[4px] bg-sandwich font-semibold"
                  : "border-[4px] border-sandwich"
              } pl-[1rem] pr-[1rem] py-[8px] md:w-[20rem] w-full `}
              onClick={() => {
                handleSort("lastName");
              }}
            >
              <p className="text-[12px] font-[Poppins] md:text-[18px] sm:font-body text-left">
                Last Name
              </p>
              {sortCriteria === "lastName" ? (
                <img src={aToZLigthIcon} alt="" />
              ) : (
                <img src={aToZIcon} alt="" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToggleButton;
