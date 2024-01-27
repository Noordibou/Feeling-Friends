import Exterior from "../images/Exterior.png";
import Classroom from "../images/Classroom.png";
import Goal from "../images/Goal.png";
import Settings from "../images/Settings.png";

export default function TeacherNavbar() {
    return(
    
<div className="flex w-full">

<div className="bg-sky w-1/4 flex flex-col items-center border-[1rem] border-sky rounded-tl-[1rem]">
    <a href="/teacher-home"><div className="flex justify-center items-center"><img src={Exterior} alt="Home Exterior"/></div>
    <div><span className="font-poppins text-notebookPaper text-md nav-text-shadow">Dashboard</span></div></a>
</div>

<div className="bg-grass w-1/4 flex flex-col items-center border-[1rem] border-grass">
    <a href="/teacher-home"><div className="flex justify-center items-center"><img src={Classroom} alt="Classroom"/></div>
    <div><span className="font-poppins text-notebookPaper text-md nav-text-shadow">Edit Classes</span></div></a>
</div>

<div className="bg-schoolBus w-1/4 flex flex-col items-center border-[1rem] border-schoolBus">
    <a href="/editneedsgoals"><div className="flex justify-center items-center"><img src={Goal} alt="Goal Target"/></div>
    <div><span className="font-poppins text-notebookPaper text-md nav-text-shadow">Goals/Needs</span></div></a>
</div>

<div className="bg-apple w-1/4 flex flex-col items-center border-[1rem] border-apple rounded-tr-[1rem]">
    <a href="/edit/:teacherId"><div className="flex justify-center items-center"><img src={Settings} alt="Settings"/></div>
    <div><span className="font-poppins text-notebookPaper text-md nav-text-shadow">Settings</span></div></a>
</div>

</div>

    )
};