import React, { useState } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const Nav = ({ setIsEditMode, teacherId, classroomId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <MobileNav  toggle={toggle} setIsEditMode={setIsEditMode} teacherId={teacherId} classroomId={classroomId} />
      
      <DesktopNav isOpen={isOpen} toggle={toggle} setIsEditMode={setIsEditMode} teacherId={teacherId} classroomId={classroomId} />
    </>
  );
};

export default Nav;
