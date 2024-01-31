// import React, { useState} from 'react';
// const { sortByCriteria } = require('../utils/sortByCriteria');


// const ToggleButton = ({ students, setStudents }) => {
//     const [sortCriteria, setSortCriteria] = useState();
//     const [sortDirection, setSortDirection] = useState('asc');

//     const toggleSortDirection = () => {
//         setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     };
    

//       const handleSort = (criteria) => {
//         setSortCriteria(criteria);
//         toggleSortDirection();  
//         const sorted = sortByCriteria(students, criteria, sortDirection);
//         setStudents(sorted);
//       };
    
//     return (
//         <>
//             <div className="flex justify-center w-[70%] mr-auto ml-auto">
//                 <div className="flex">
//                     <div className="pr-[0.5rem]">
//                         <button
//                             className={`md:text-body font-body rounded-[0.7rem] ${sortCriteria === 'zor' ? 'border-sandwich border-[4px] bg-sandwich' : 'border-[4px] border-sandwich'
//                                 } pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] md:w-[20rem] w-[16rem]`}
//                             onClick={() => {
//                                 handleSort('zor');
//                             }}
//                         >
//                             Sort by Regulatory Zone
//                         </button>
//                     </div>
//                     <div className="pl-[0.5rem]">
//                         <button
//                             className={`md:text-body font-body rounded-[0.7rem] ${sortCriteria === 'lastName' ? 'border-sandwich border-[4px] bg-sandwich' : 'border-[4px] border-sandwich'
//                                 } pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] md:w-[20rem] w-[16rem] `}
//                             onClick={() => {
//                                 handleSort('lastName');
//                             }}
//                         >
//                             Sort by Last Name
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ToggleButton;
