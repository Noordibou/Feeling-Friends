import React, { useState } from 'react';
import  sortByCriteria  from '../utils/sortStudents.js';
import aToZIcon from "../images/sort-z-a.png"
import regZoneIcon from '../images/reg_zone_icon.png'
import aToZLigthIcon from "../images/sort-z-a-light.png"

// This is specifically for sorting (sort by regulatory zone and sort by last name)

const ToggleButton = ({ students, setStudents }) => {
    const [sortCriteria, setSortCriteria] = useState();
    const [sortDirection, setSortDirection] = useState('asc');

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };


    const handleSort = (criteria) => {
        setSortCriteria(criteria);
        toggleSortDirection();
        const sorted = sortByCriteria(students, criteria, sortDirection);
        setStudents(sorted);
    };

    return (
        <>
            <div className="flex justify-center w-[90%] sm:w-[80%] mr-auto ml-auto ">
                <div className="flex w-full">


                    <div className="pr-[0.5rem] w-full ">
                        <button
                            className={`flex items-center justify-between rounded-[1.3rem] ${sortCriteria === 'zor' ? 'border-sandwich border-[4px] bg-sandwich font-semibold' : 'border-[4px] border-sandwich'
                                } px-[1rem] py-[8px] md:w-[20rem] w-full `}
                            onClick={() => {
                                handleSort('zor');
                            }}
                        >
                            <p className="text-[12px] md:text-body sm:font-body text-left">Regulatory Zone</p>
                            <img className="" src={regZoneIcon} alt="" />
                        </button>
                    </div>


                    <div className="pl-[0.5rem] w-full">
                        <button
                            className={`flex items-center justify-between md:text-body font-body rounded-[1.3rem] ${sortCriteria === 'lastName' ? 'border-sandwich border-[4px] bg-sandwich font-semibold' : 'border-[4px] border-sandwich'
                                } pl-[1rem] pr-[1rem] py-[8px] md:w-[20rem] w-full `}
                            onClick={() => {
                                handleSort('lastName');
                            }}
                        >
                            <p className="text-[12px] md:text-body sm:font-body text-left">Last Name</p>
                            { sortCriteria === 'lastName' ? <img src={aToZLigthIcon} alt="" /> : <img src={aToZIcon} alt="" />}
                        </button>
                    </div>


                </div>
            </div>
        </>
    );
};

export default ToggleButton;
