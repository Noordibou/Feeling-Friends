// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getStudentProfile } from '../../api/teachersApi';

// export default function StudentProfile() {
//     const { teacherId, classroomId, studentId } = useParams();
//     const [studentProfile, setStudentProfile] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchStudentProfile = async () => {
//             try {
//                 const profile = await getStudentProfile(teacherId, classroomId, studentId);
//                 setStudentProfile(profile);
//             } catch (error) {
//                 setError('An error occurred while fetching the student profile.');
//                 console.error(error);
//             }
//         };

//         fetchStudentProfile();
//     }, [teacherId, classroomId, studentId]);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     if (!studentProfile) {
//         return <div>Loading...</div>;
//     }
//     console.log(studentProfile.firstName)

//     return (
//         <div className='flex w-screen flex-col items-center bg-notebookPaper h-screen'>
//             <div className='flex flex-row '>
//                 <div>{studentProfile.avatarImg}</div>
//                 <div>
//                     <h2 className='text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]'><strong>{studentProfile.firstName} {studentProfile.lastName}</strong></h2>
//                     <p>Age: {studentProfile.age}</p>
//                     <p>Grade: {studentProfile.gradeYear}th</p>
//                     <p>Student ID: {studentProfile.schoolStudentId} </p>
//                     <p>Birthday: {studentProfile.birthday}</p>
//                     <p>IEP: {studentProfile.iepStatus}</p>
//                 </div>
//             </div>
//             <div >
//                 {/* calender space */}
//             </div>
//             <div >
//               <h3>Individual Education Program (IEP)</h3>

//             </div>

//         </div>
//     );
// }

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getStudentProfile } from '../../api/teachersApi';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// const localizer = momentLocalizer(moment);

// export default function StudentProfile() {
//     const { teacherId, classroomId, studentId } = useParams();
//     const [studentProfile, setStudentProfile] = useState(null);
//     const [error, setError] = useState(null);
//     const [events, setEvents] = useState([]);

//     function getBackgroundColorClass(zor) {
//         if (zor === 'Unmotivated') return 'blue';
//         if (zor === 'Ready to Learn') return 'green';
//         if (zor === 'Wiggly') return 'yellow';
//         if (zor === 'Explosive') return 'orange';
//         return '';
//     }

//     useEffect(() => {
//         const fetchStudentProfile = async () => {
//             try {
//                 const profile = await getStudentProfile(teacherId, classroomId, studentId);
//                 setStudentProfile(profile);

//                 const studentEvents = profile.journalEntries.map((entry) => ({
//                     title: `ZOR: ${entry.checkin.ZOR}`,
//                     start: new Date(entry.date),
//                     end: new Date(entry.date),
//                 }));
//                 setEvents(studentEvents);
//             } catch (error) {
//                 setError('An error occurred while fetching the student profile.');
//                 console.error(error);
//             }
//         };

//         fetchStudentProfile();
//     }, [teacherId, classroomId, studentId]);

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     if (!studentProfile) {
//         return <div>Loading...</div>;
//     }

//     // Custom dayPropGetter function to set background color of days
//     const dayPropGetter = (date) => {
//         const eventsForDay = events.filter(
//             (event) =>
//                 moment(event.start).isSame(date, 'day') &&
//                 event.title.startsWith('ZOR:')
//         );

//         if (eventsForDay.length > 0) {
//             const zor = eventsForDay[0].title.split('ZOR: ')[1];
//             return {
//                 style: {
//                     backgroundColor: getBackgroundColorClass(zor),
//                 },
//             };
//         }

//         return {};
//     };

//     return (
//         <div className="flex w-screen flex-col items-center bg-notebookPaper h-screen">
//             <div className="flex flex-row">
//                 <div>{studentProfile.avatarImg}</div>
//                 <div>
//                     <h2 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]">
//                         <strong>{studentProfile.firstName} {studentProfile.lastName}</strong>
//                     </h2>
//                     <p>Age: {studentProfile.age}</p>
//                     <p>Grade: {studentProfile.gradeYear}th</p>
//                     <p>Student ID: {studentProfile.schoolStudentId} </p>
//                     <p>Birthday: {studentProfile.birthday}</p>
//                     <p>IEP: {studentProfile.iepStatus}</p>
//                 </div>
//             </div>
//             <div className="m-6">
//                 <Calendar
//                     localizer={localizer}
//                     events={events}
//                     startAccessor="start"
//                     endAccessor="end"
//                     views={['month', 'week']}
//                     style={{ height: 500 }}
//                     dayPropGetter={dayPropGetter}
//                 />
//             </div>
//             <div>
//                 <h3>Individual Education Program (IEP)</h3>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentProfile } from '../../api/teachersApi';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';
import { getBackgroundColorClass } from '../../components/classRoom';

export default function StudentProfile() {
  const { teacherId, classroomId, studentId } = useParams();
  const [studentProfile, setStudentProfile] = useState(null);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const profile = await getStudentProfile(teacherId, classroomId, studentId);
        setStudentProfile(profile);

        const studentEvents = profile.journalEntries.map((entry) => ({
          title: '',
          date: new Date(entry.date), 
          className: getBackgroundColorClass(entry.checkin.ZOR), 
        }));
        setEvents(studentEvents);
      } catch (error) {
        setError('An error occurred while fetching the student profile.');
        console.error(error);
      }
    };

    fetchStudentProfile();
  }, [teacherId, classroomId, studentId]);

  return (
    <div className="flex w-screen flex-col items-center bg-notebookPaper h-screen">
      <div className="flex flex-row">
        <div>{studentProfile && <img src={studentProfile.avatarImg} alt="Student Avatar" />}</div>
        <div>
          <h2 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]">
            <strong>{studentProfile?.firstName} {studentProfile?.lastName}</strong>
          </h2>
          <p>Age: {studentProfile?.age}</p>
          <p>Grade: {studentProfile?.gradeYear}th</p>
          <p>Student ID: {studentProfile?.schoolStudentId}</p>
          <p>Birthday: {studentProfile?.birthday}</p>
          <p>IEP: {studentProfile?.iepStatus}</p>
        </div>
      </div>
      <div className="m-6">
        {studentProfile && (
          <div className=" mt-12 rounded-lg bg-white border-4 border-sandwich p-6">
            <Calendar
              className="react-calendar" 
              tileContent={({ date, view }) => {
                const event = events.find((event) => event.date.toDateString() === date.toDateString());
                if (event) {
                  return (
                    <div className={`rounded-md p-2 bg-${event.className}`}>
                      {event.title}
                    </div>
                  );
                }
                return null;
              }}
            />
          </div>
        )}
      </div>
      <div>
        <h3>Individual Education Program (IEP)</h3>
      </div>
    </div>
  );
}

