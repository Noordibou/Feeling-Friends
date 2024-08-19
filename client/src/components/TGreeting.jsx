import React from "react";
import { Link } from "react-router-dom";
import Logout from "../components/LogoutButton.jsx";

// TODO: make greeting message more dynamic based on time of day

// this is the initial greeting on the teacher home page
// changes based on whether it's in edit or display mode

const Greeting = ({ isEditMode, userData }) => {
  if (isEditMode) {
    return (
      <div className="lg:mt-16 mt-20 md:mt-0 ml-8">
        <div className="hidden md:flex items-start justify-end underline mt-4 lg:mt-0 lg:mb-12 mr-4 ">
          <Logout location="teacherLogout" userData={userData} />
        </div>
        <h1 className="text-header4 font-header4 text-start  mx-6">
          Edit Classes
        </h1>
        <h4 className="text-header3 font-header3 text-start pb-[0.5rem] mx-6">
          Add or remove classes, set a class as the dashboard default, or tap to
          manage student rosters.
        </h4>

        <div className="text-header3 font-inter text-center ">
          <Link className="underline" to={"/createclass"}>
            Add new class
          </Link>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <h1 className="text-header1 font-header1 text-start pt-[4rem] mx-6">
        Loading...
      </h1>
    );
  }

  return (
    
      <div className="font-body text-start lg:mt-16 mt-20 md:mt-0">
        <div className="hidden md:flex items-start justify-end underline lg:-mt-16 lg:mb-20 mr-4 md:pt-8 ">
          <Logout location="teacherLogout" userData={userData} />
        </div>
        <div className="ml-10 mt-4">
        <h1 className="text-header4 md:text-header1 font-header1 text-start">
          Good morning, {userData.prefix} {userData.firstName}!
        </h1>
        {userData && (
          <h2 className="text-button md:text-header4 font-header3 text-start pb-2">
            Your Classes at a Glance
          </h2>
        )}
        </div>
      </div>
  );
};

export default Greeting;
