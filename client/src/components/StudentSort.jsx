// import React, { useState } from 'react';
// import sortStudents from './sortByCriteria.jsx';
// import { Link } from 'react-router-dom';
// import { getBackgroundColorClass } from './ClassRoomColors';
// import xButton from '../images/x-button.png';


// const StudentList = ({ isEditMode }) => {
//     const [sortCriteria, setSortCriteria] = useState('zor');
//     const [sortDirection, setSortDirection] = useState('asc');
//     // const [students, setStudents] = useState([]);
//     const sortedStudents = sortStudents(students, sortCriteria, sortDirection);

//     return (
//         <>
//             <StudentSort />
//             <div className='flex justify-center overflow-y-auto custom-scrollbar'>
//                 {sortedStudents.length > 0 ? (
//                     <ul className='w-[70%] '>
//                         {sortedStudents.map((student, index) => {
//                             const lastJournal = student.journalEntries[student.journalEntries.length - 1];

//                             if (lastJournal) {
//                                 const isCheckout = lastJournal.checkout && lastJournal.checkout.emotion;
//                                 const lastEmotion = isCheckout ? lastJournal.checkout.emotion : lastJournal.checkin?.emotion;
//                                 const zor = isCheckout ? lastJournal.checkout.ZOR : lastJournal.checkin?.ZOR;
//                                 const bgColorClass = getBackgroundColorClass(zor);

//                                 return (
//                                     <li key={`${student.id}-${index}`}>
//                                         <div className={`bg-${bgColorClass} my-3 p-4 rounded-lg`}>
//                                             <div className='pb-2 flex justify-between'>
//                                                 <div>
//                                                     {student.firstName} {student.lastName} is feeling <b>{lastEmotion}</b>
//                                                 </div>
//                                                 {isEditMode && (
//                                                     <div className='-mt-8 -mx-8'>
//                                                         <div>
//                                                             {/* <button onClick={() => handleDeleteStudent(student._id)}>
//                                                                 <img src={xButton} alt="xButton" />
//                                                             </button> */}
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <div className='bg-notebookPaper px-2 py-2 rounded-md flex justify-between'>
//                                                 Goals: {isCheckout ? lastJournal.checkout.goal : lastJournal.checkin?.goal}
//                                                 <br />
//                                                 Needs: {isCheckout ? lastJournal.checkout.need : lastJournal.checkin?.need}
//                                                 <div className='pt-3 mr-2 underline'>
//                                                     {/* <Link to={`/${userData._id}/${classroomId}/${student._id}`}>More &gt;</Link> */}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </li>
//                                 );
//                             }

//                             return (
//                                 <li key={`${student.id}-${index}`}>
//                                     <div className={`bg-white p-4 my-3 rounded-lg flex justify-between`}>
//                                         <div className=''>
//                                             {student.firstName} {student.lastName} didn't check in or out yet!
//                                         </div>
//                                         <div className='flex justify-end'>
//                                             {isEditMode && (
//                                                 <div className='-mt-10 -mx-24'>
//                                                     <div>
//                                                         {/* <button onClick={() => handleDeleteStudent(student._id)}>
//                                                             <img src={xButton} alt="xButton" />
//                                                         </button> */}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {/* <Link to={`/${userData._id}/${classroomId}/${student._id}`} className='mr-4 underline'>More &gt;</Link> */}
//                                         </div>
//                                     </div>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 ) : (
//                     <p>No students found.</p>
//                 )}
//             </div>
//         </>
//     );
// };

// export { StudentSort, StudentList };


