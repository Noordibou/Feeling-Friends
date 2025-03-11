import { Link } from "react-router-dom";
import { checkTimeOfDay } from "../utils/dailyGreeting.js";
import Logout from "../components/LogoutButton.jsx";

const Greeting = ({ isEditMode, userData }) => {
  const greeting = checkTimeOfDay();

  if (isEditMode) {
    return (
      <section className="flex flex-col lg:mt-16 mt-10 md:mt-0 ml-8 ">
        <header className="hidden md:flex items-start justify-end underline mt-4 lg:mt-0 lg:mb-12 mr-4 ">
          <Logout location="teacherLogout" userData={userData} />
        </header>
        <h1 className="font-[Poppins] text-[32px] sm:mx-6">Edit Classes</h1>
        <h4 className="font-[Poppins] sm:text-[20px] pb-[0.5rem] sm:mx-6">
          Add or remove classes, set a class as the dashboard default, or tap to
          manage student rosters.
        </h4>

        <div className="flex justify-center self-center text-center bg-sandwich py-2 mt-6 mb-2 w-[200px] rounded-2xl font-[Poppins]">
          <Link className="underline" to={"/createclass"}>
            + Add new class
          </Link>
        </div>
      </section>
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
    <section className="font-body text-start lg:mt-16 mt-10 md:mt-0">
      <div className="hidden md:flex items-start justify-end underline lg:-mt-16 lg:mb-20 mr-4 md:pt-8 ">
        <Logout location="teacherLogout" userData={userData} />
      </div>
      <div className="sm:ml-10 mt-4">
        <h1 className="text-[32px] font-bold">
          {greeting}, {userData.prefix} {userData.firstName}!
        </h1>
      </div>
    </section>
  );
};

export default Greeting;
