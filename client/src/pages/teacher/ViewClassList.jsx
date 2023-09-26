import React from "react";

export default function viewClassList() {
    return ( <>
        <div>
        <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]">Good morning, name!</h1>

        <div className="w-[90%] mr-auto ml-auto p-[2rem]">

        <div className="flex">
            <div className="pr-[0.5rem]"><button className="text-body font-body rounded-[1rem] border-sandwich border-[4px] pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] w-[21rem]">Sort by Regulatory Zone</button></div>
            <div className="pl-[0.5rem]"><button className="text-body font-body rounded-[1rem] border-sandwich border-[4px] pl-[1rem] pr-[1rem] pb-[2px] pt-[2px] w-[21rem]">Sort by Last Name</button></div>
        </div>

{/* Scrollable list of students */}

        </div>

<div className="w-[90%] ml-auto mr-auto mt-[1rem]">

    <div className="text-left">
    <div><span className="text-header2 font-header2"><b>Class Name</b></span> &nbsp;&nbsp; <span className="font-karla text-lg">Room 101</span></div>
    </div>

    <div className="flex justify-between text-body font-body">
        <div><a href="/editneedsgoals">Set class goals and needs</a></div>
        <div><a href="/">Edit roster</a></div>
    </div>

</div>

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

        </div>

        </>
    );
    }