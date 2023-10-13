import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { getTeacherClassroom } from '../../api/teachersApi';

const ViewClassroom = () => {
    const { teacherId, classroomId } = useParams();
    const { userData } = useUser();
    const [classroom, setClassroom] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classroom = await getTeacherClassroom(teacherId, classroomId);
                setClassroom(classroom);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [teacherId, classroomId]);

    return (
        <>
            <div>
                <div>
                    <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]">
                        Good morning, {userData.firstName}!
                    </h1>
                </div>
                {classroom ? (
                    <>
                        <div className="w-[90%] rounded-[1rem] border-sandwich border-[8px] mr-auto ml-auto p-[2rem]">
                            <h4 className="bg-sandwich text-notebookPaper font-body text-body w-[23rem] rounded-[1rem] text-center ml-auto mr-auto">
                                Smartboard
                            </h4>

                            {/* Classroom layout here */}
                            <div className="text-right text-body font-body text-sandwich pt-[2rem]">
                                <a href="/">Edit seating chart</a>
                            </div>
                        </div>

                        <div className="w-[90%] ml-auto mr-auto mt-[1rem]">
                            <div className="flex justify-between">
                                <div>
                                    <span className="text-header2 font-header2">
                                        <b>{classroom.classSubject}</b>
                                    </span>{' '}
                                    &nbsp;&nbsp;
                                    <span className="font-karla text-lg">{classroom.location}</span>
                                    
                                </div>
                                <div className="text-body font-body">
                                    Check In &nbsp;&nbsp; 8AM - 9AM<br />
                                    Check out &nbsp;&nbsp; 2PM - 3PM
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    'Loading...'
                )}

                <div className="w-[90%] ml-auto mr-auto mt-[1rem]">


                    {/* Div below may need positioned differently later */}
                    <div className="justify-start text-body font-body">
                        <a href="/teacher-home">&lt; All Classes</a>
                    </div>

                    <div className="flex rounded-[1rem] border-sandwich border-[8px] w-[25%] ml-auto mr-auto">
                        <div className="text-body font-body p-[1rem] bg-sandwich">
                            <a href="/viewclassroom">Room</a></div>
                        <div className="text-body font-body p-[1rem]"><a href="/viewclasslist">List</a></div>
                    </div>

                </div>

            </div >

        </>
    );
}

export default ViewClassroom;

{/* <h2>Students</h2> */}
//                     <ul>
//                         {classroom.students.map(student => (
//                             <li key={student.id}>{student.firstName}</li>
//                         ))}
//                     </ul>
