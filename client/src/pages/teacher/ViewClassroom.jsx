import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { getTeacherClassroom, getAllStudentsClassroom } from '../../api/teachersApi';
import StudentBox from '../../components/StudentBox';
import TeacherNavbar from '../../components/TeacherNavbar';

const ViewClassroom = () => {
    const { teacherId, classroomId } = useParams();
    const { userData } = useUser();
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classroom = await getTeacherClassroom(teacherId, classroomId);
                setClassroom(classroom);
                const classroomStudents = await getAllStudentsClassroom(teacherId, classroomId);
                setStudents(classroomStudents);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [teacherId, classroomId]);

    return (
        <>
        <div className='h-screen'>
            <div>
                <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem] ">
                    Good morning, {userData.firstName}!
                </h1>
            </div>
            {classroom ? (
                <>
                    <div className="w-[90%] rounded-[1rem] border-sandwich border-[8px] mr-auto ml-auto p-[2rem]">
                        <h4 className="bg-sandwich text-notebookPaper font-body text-body w-[23rem] rounded-[1rem] text-center ml-auto mr-auto">
                            Smartboard
                        </h4>
                        <div className="grid grid-rows-8 grid-cols-8 grid-flow-col auto-cols-auto py-4 ">
                            {students.map((student, index) => (
                                <StudentBox key={index} student={student} index={index} />
                            ))}
                        </div>
                    </div>
                    <div className="text-right text-body font-body text-darkSandwich pt-[2rem]">
                        <a href={`/edit-seating-chart/${teacherId}/${classroomId}`}>edit seating chart</a>
                    </div>


                    <div className="w-[90%] ml-auto mr-auto mt-[1rem]">
                        <div className="flex justify-between">
                            <div>
                                <span className="text-header2 font-header2">
                                    <b>{classroom.classSubject}</b>
                                </span>{' '}
                                &nbsp;&nbsp;
                                <span className="font-karla text-lg px-6">{classroom.location}</span>
                            </div>
                            <div className="text-body font-body">
                                Check In &nbsp;&nbsp; {classroom.checkIn}AM <br />
                                Check out &nbsp;&nbsp; {classroom.checkOut}2PM
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                'Loading...'
            )}

            <div className="w-[90%] ml-auto mr-auto mt-[1rem]">
                <div className="justify-start text-body font-body">
                    <a href="/teacher-home">&lt; All Classes</a>
                </div>

                <div className="flex rounded-[1rem] border-sandwich border-[8px] w-[25%] ml-auto mr-auto">
                    <div className="text-body font-body p-[1rem] bg-sandwich">
                        Room
                    </div>
                    <div className="text-body font-body p-[1rem]">
                        <Link to={`/viewclasslist/${userData._id}/${classroomId}`}>List</Link>
                    </div>
                </div>
            </div>
        </div >
        <div className="fixed -bottom-0 sticky">
            <TeacherNavbar />
        </div>
        </>
    );
}

export default ViewClassroom;