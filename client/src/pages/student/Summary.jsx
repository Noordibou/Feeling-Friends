import React from "react";
import Avatar from "../../images/avatar.png";
import Anxious from "../../images/anxiousAvatar.png";

const Summary = () => {
  return (
    <>
    <div className="pt-[12rem]">
<div className="flex items-center justify-center">
  <div><img src={Anxious} /></div><div><img src={Avatar} /></div>
</div>

<div className="w-9/12 text-center ml-auto mr-auto pt-[1.5rem]">
    <h1 className="font-header1 text-header1 leading-tight">Thanks Jimmy - Have a good day at school!</h1>
</div>

<div className="bg-lightOrange w-11/12 pt-[1.5rem] rounded-[2rem] p-[2rem] mt-[4rem] ml-auto mr-auto">
    <h2 className="font-header2 text-header2 leading-tight">Coping skill of the day</h2>
    <span className="block font-body text-body leading-relaxed mt-[1rem]">Take 5 deep breaths- breathe in for 5, hold for 5 and breathe out for 10. Repeat.</span>
</div>

    </div>
    </>
  );
}

export default Summary;