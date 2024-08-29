import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTeacherById } from "../../api/teachersApi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import TeacherNavbar from "../../components/Navbar/TeacherNavbar";
import Logout from "../../components/LogoutButton";
import Nav from "../../components/Navbar/Nav";
import withAuth from "../../hoc/withAuth";
import Button from "../../components/Button.jsx";
import MsgModal from '../../components/SeatingChart/MsgModal.jsx'
import SmallSaveButton from "../../components/SmallSaveButton.jsx";
import FileBase from "react-file-base64";
import youngStudent from "../../images/young-student.png";


const EditTeacher = () => {
  const navigate = useNavigate();
  const { userData, updateUser } = useUser();
  const [formData, setFormData] = useState({
    prefix: "",
    avatarImg: "",
    firstName: "",
    lastName: "",
    schoolTeacherId: "",
    school: "",
    phone: "",
    email: "",

  });
  const [isDisplayOpen, setIsDisplayOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [showMsg, setShowMsg] = useState(false)
  
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await getTeacherById(userData._id);
        setFormData(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTeacherData();
  }, [userData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("form adata: " + JSON.stringify(formData))
    try {
      // Update teacher data
      await updateUser(formData);
      // Show brief save message for 3 secs
      console.log('click click')
      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
      }, 2500);
      // navigate('/teacher-home');
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>; // Or redirect to another page, or show an error message
  }

  const handleFileUpload = (file) => {
    setFormData({
      ...formData,
      avatarImg: file.base64,
    });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen w-screen ">
        <div className="flex justify-center lg:justify-end underline mt-10 px-5">
          <Logout location="teacherLogout" userData={userData} />
        </div>
        <div className="flex flex-col items-center pt-8">
          <div className="mt-4 mb-3 max-w-[643px] lg:w-[643px] md:w-[475px] sm:w-[450px] w-[320px] ">
            <h1 className=" font-header1 text-header2 ">Manage settings</h1>
            <p className="text-header3 font-header3 text-start">
              Preferences for your account details and more.
            </p>
          </div>

          <form className="flex flex-col gap-2">
            <div className=" p-4 rounded-lg justify-center bg-sandwich lg:w-[643px] md:w-[475px] sm:w-[450px] w-[320px]">
              {/* Account Profile */}
              <div
                className="flex w-full justify-between"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
              >
                <h2 className="font-header4 text-header3">Account Settings</h2>
                <svg
                  className={`transition-transform duration-300 ${
                    isAccountOpen ? "" : "rotate-180"
                  }`}
                  width="33"
                  height="33"
                  viewBox="30 10 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="50"
                    y1="20"
                    x2="35"
                    y2="40"
                    stroke="#000000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <line
                    x1="50"
                    y1="20"
                    x2="65"
                    y2="40"
                    stroke="#000000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* Account Profile Contents */}
              <div className={`${isAccountOpen ? "" : "hidden"}`}>
                <div className="flex flex-col">
                  <label>Email </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label>Username </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label>Phone </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                {/* TODO: have a separate modal for this? */}
                {/* <div className='flex flex-col'>
                    <label>Password </label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className='rounded-lg px-2 py-0.5'  />
                </div> */}
              </div>
            </div>

            {/* TODO: add way to update teacher image */}
            <div className=" p-4 rounded-lg justify-center bg-sandwich lg:w-[643px] md:w-[475px] sm:w-[450px] w-[320px]">
              {/* Account Profile */}
              <div
                className="flex w-full justify-between"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <h2 className="font-header4 text-header3">User profile</h2>
                <svg
                  className={`transition-transform duration-300 ${
                    isProfileOpen ? "" : "rotate-180"
                  }`}
                  width="33"
                  height="33"
                  viewBox="30 10 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="50"
                    y1="20"
                    x2="35"
                    y2="40"
                    stroke="#000000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <line
                    x1="50"
                    y1="20"
                    x2="65"
                    y2="40"
                    stroke="#000000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* Account Profile Contents */}
              <div className={`${isProfileOpen ? "" : "hidden"}`}>
                <div className="flex my-5">
                  <img
                    src={
                      formData?.avatarImg === ""
                        ? youngStudent
                        : formData?.avatarImg
                    }
                    alt="teacher"
                    className="rounded-md object-fill w-36"
                  />
                  <div className="inline-flex text-[12px] font-header1 items-end ml-5 underline w-36">
                    <FileBase
                      type="file"
                      multiple={false}
                      onDone={({ base64 }) => handleFileUpload({ base64 })}
                    />
                  </div>
                </div>
                <div className={`flex flex-col `}>
                  <label>Prefix </label>
                  <input
                    type="text"
                    name="prefix"
                    value={formData.prefix || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label>First Name </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label>Last Name </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label>School </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label>Email </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label>Phone </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                {/* <div className='flex flex-col'>
                    <label>Password </label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className='rounded-lg px-2 py-0.5'  />
                </div> */}
              </div>
            </div>
            {/* Display Section */}
            <div className="flex flex-col p-4 rounded-lg justify-center bg-sandwich lg:w-[643px] md:w-[475px] sm:w-[450px] w-[320px]">
              {/* Display Header */}
              <div
                className="flex w-full justify-between"
                onClick={() => setIsDisplayOpen(!isDisplayOpen)}
              >
                <h2 className="font-semibold font-header4 text-header3 font-[Poppins]">
                  Display
                </h2>

                <svg
                  className={`transition-transform duration-300 ${
                    isDisplayOpen ? "" : "rotate-180"
                  }`}
                  width="33"
                  height="33"
                  viewBox="30 10 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="50"
                    y1="20"
                    x2="35"
                    y2="40"
                    stroke="#000000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <line
                    x1="50"
                    y1="20"
                    x2="65"
                    y2="40"
                    stroke="#000000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className={`${isDisplayOpen ? "" : "hidden"}`}>
                <h2>Coming soon...</h2>
              </div>
            </div>
          </form>

          {/* Save Button on Tablet and Phone screens centered*/}
          <div className="lg:hidden flex justify-center">
            <div
              className="lg:hidden fixed bottom-36 flex "
              onClick={(e) => handleFormSubmit(e)}
            >
              <Button buttonText="Save" />
            </div>
          </div>
          {/* Small Save button for desktop/large screens to the right */}
          <div>
            <div
              className="hidden lg:fixed lg:bottom-36 lg:right-10 lg:flex "
              onClick={(e) => handleFormSubmit(e)}
            >
              <SmallSaveButton />
            </div>
          </div>
          <div className="flex justify-center">
            <MsgModal msgText="Save Successful!" showMsg={showMsg} />
          </div>
          <div className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
            <Nav teacherId={userData._id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(['teacher'])(EditTeacher)
