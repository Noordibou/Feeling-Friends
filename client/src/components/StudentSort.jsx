import React, { useState } from 'react';
//not working yet
export default function StudentSort() {
    const [students, setStudents] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('zor');
    const [sortDirection, setSortDirection] = useState('asc');

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortStudents = () => {
        const zorOrder = ['Unmotivated', 'Wiggly', 'Ready to Learn', 'Explosive'];

        const sortedStudents = [...students].sort((a, b) => {
            if (sortCriteria === 'lastName') {
                return sortDirection === 'desc'
                    ? a.lastName.localeCompare(b.lastName)
                    : b.lastName.localeCompare(a.lastName);
            } else if (sortCriteria === 'zor') {
                const zorA = a.journalEntries[a.journalEntries.length - 1]?.checkout?.ZOR || a.journalEntries[a.journalEntries.length - 1]?.checkin?.ZOR;
                const zorB = b.journalEntries[b.journalEntries.length - 1]?.checkout?.ZOR || b.journalEntries[b.journalEntries.length - 1]?.checkin?.ZOR;

                const indexA = zorOrder.indexOf(zorA);
                const indexB = zorOrder.indexOf(zorB);


                if (indexA === -1 && indexB === -1) {
                    return 0;
                } else if (indexA === -1) {
                    return 1;
                } else if (indexB === -1) {
                    return -1;
                } else {
                    return indexA - indexB;
                }
            }

            return 0;
        });

        if (sortCriteria === 'zor' && sortDirection === 'desc') {
            sortedStudents.reverse();
        }

        return sortedStudents;
    };

    const sortedStudents = sortStudents();
    // return (
    //     <div className="flex justify-center w-[70%] mr-auto ml-auto z-30">
    //         <div className="flex">
    //             <div className="pr-[0.5rem]">
    //                 <button
    //                     className="text-body font-body rounded-[1rem] border-sandwich border-[4px] pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] w-[21rem]"
    //                     onClick={() => {
    //                         setSortCriteria('zor');
    //                         toggleSortDirection();
    //                     }}
    //                 >
    //                     Sort by Regulatory Zone
    //                 </button>
    //             </div>
    //             <div className="pl-[0.5rem]">
    //                 <button
    //                     className="text-body font-body rounded-[1rem] border-sandwich border-[4px] pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] w-[21rem]"
    //                     onClick={() => {
    //                         setSortCriteria('lastName');
    //                         toggleSortDirection();
    //                     }}
    //                 >
    //                     Sort by Last Name
    //                 </button>
    //             </div>
    //         </div>

    //     </div>

    // );
}