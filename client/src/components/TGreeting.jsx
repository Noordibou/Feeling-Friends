
import React from 'react';
import { Link } from 'react-router-dom';
import Logout from '../components/LogoutButton.jsx';



const Greeting = ({ isEditMode, userData }) => {
    if (isEditMode) {
        return (
            <div>
                <h1 className="text-header1 font-header1 text-center pt-[4rem] mx-6">
                    Add/remove classes
                </h1>
                <div className="text-header3 font-inter text-center pt-[2rem] ">
                    <Link className="underline" to={'/createclass'}>
                        Add new class
                    </Link>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <h1 className="text-header1 font-header1 text-center pt-[4rem] mx-6">
                Loading...
            </h1>
        );
    }

    return (
        <div>
            <h1 className="text-header1 font-header1 text-center pt-[3rem] mx-6">
                Good morning, {userData.prefix} {userData.firstName}!
            </h1>
            <h2 className="font-body text-body text-center">
                <div className="flex items-center justify-center underline">
                    {`Logged in as ${userData.firstName} ${userData.lastName} - `}
                    <Logout location="teacherLogout" />
                    ?
                </div>
                {userData && (
                    <h2 className="text-header4 font-header4 text-center pb-[0.5rem]">
                        All Classes at a Glance
                    </h2>
                )}
            </h2>
            <div className="text-header3 font-inter text-center ">
                <Link className="underline" to={'/createclass'}>
                    Add new class
                </Link>
            </div>
        </div>
    );
};

export default Greeting;