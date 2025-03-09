import React, { useState, useEffect, useRef } from "react";
import { getTeacherById } from "../../api/teachersApi";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Logout from "../../components/LogoutButton";
import Nav from "../../components/Navbar/Nav";
import PasswordChange from "../../components/TeacherView/PasswordChangeModal.jsx";
import withAuth from "../../hoc/withAuth";
import Button from "../../components/Button.jsx";
import MsgModal from "../../components/SeatingChart/MsgModal.jsx";
import SmallSaveButton from "../../components/SmallSaveButton.jsx";
import FileBase from "react-file-base64";
import youngStudent from "../../images/young-student.png";
import { getUserByTeacherId, updateTeacherAcct } from "../../api/userApi.js";
import editIcon from "../../images/edit_icon.png";
import { motion } from "framer-motion";
import UnsavedChanges from "../../components/TeacherView/UnsavedChanges.jsx";
import { deleteTeacher } from "../../api/teachersApi";
import ConfirmationModal from "../../components/TeacherView/ConfirmationModal.jsx";
import { useUnsavedChanges } from "../../context/UnsavedChangesContext.js";

const EditTeacher = () => {
  const navigate = useNavigate();
  const { teacherId } = useParams();
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
    username: "",
  });
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { setHasUnsavedChanges } = useUnsavedChanges();
  const confirmRef = useRef(null);
  const pwChangeRef = useRef(null);

  const openPWModal = () => {
    pwChangeRef.current?.showModal();
  };

  const closePWModal = () => {
    pwChangeRef.current?.close();
  };

  const openConfirmModal = () => {
    confirmRef.current?.showModal();
  };

  const closeConfirmModal = () => {
    confirmRef.current?.close();
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await getTeacherById(userData._id);
        const acctResponse = await getUserByTeacherId(userData._id);
        // Combine data from both responses
        const combinedData = {
          ...response,
          email: acctResponse.email,
          username: acctResponse.username,
        };
        setFormData(combinedData);
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
    setHasUnsavedChanges(true);
  };

  const deleteTeacherInSystem = async () => {
    if (inputValue === formData?.firstName + " " + formData?.lastName) {
      console.log("Deleting teacher");
      const response = await deleteTeacher(teacherId);
      if (response === 200) {
        sessionStorage.setItem(
          "teacherDeleteInfo",
          JSON.stringify({
            success: true,
            teacherName: formData?.firstName + " " + formData?.lastName,
          })
        );
        localStorage.removeItem("userData");
        navigate(`/signup`);
      }
    } else {
      console.log("Name does not match");
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { email, username, ...teacherData } = formData;

      // Update teacher-specific fields
      await updateTeacherAcct(userData._id, { email, username });

      await updateUser(teacherData);
      // Show brief save message for 3 secs
      console.log("click click");
      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
      }, 2500);
      setHasUnsavedChanges(false);
      // navigate('/teacher-home');
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
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
        <header className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
          <Nav teacherId={userData._id} />
        </header>
        <div className="flex justify-center lg:justify-end underline mt-10 px-5">
          <Logout location="teacherLogout" userData={userData} />
        </div>
        <main className="flex flex-col items-center pt-8">
          <section className="mt-4 mb-3 max-w-[643px] lg:w-[643px] md:w-[475px] sm:w-[450px] w-[320px] px-5 sm:px-0">
            <h1 className=" font-header1 text-header2 ">Manage settings</h1>
            <p className="text-header3 font-header3 text-start">
              Preferences for your account details and more.
            </p>
          </section>

          <form className="flex flex-col gap-2 sm:h-auto max-h-[1200px] mb-24 sm:mb-0">
            <fieldset className=" p-4 rounded-lg justify-center bg-sandwich lg:w-[643px] md:w-[475px] sm:w-[450px] w-[90%] self-center">
              {/* Account Profile */}
              <section className="w-full">
                <header
                  className="flex w-full justify-between cursor-pointer"
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  aria-expanded={isAccountOpen ? "true" : "false"}
                  aria-controls="account-settings-content"
                >
                  <h2 className="font-header4 text-header3 select-none">
                    Account Settings
                  </h2>
                  <svg
                    className={`transition-transform duration-300 ${
                      isAccountOpen ? "" : "rotate-180"
                    }`}
                    width="33"
                    height="33"
                    viewBox="30 10 40 40"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label={
                      isAccountOpen ? "Collapse section" : "Expand section"
                    }
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
                </header>
              </section>
              {/* Account Profile Contents */}
              <motion.div
                className={`${isAccountOpen ? "" : "hidden"}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isAccountOpen ? "auto" : 0,
                  opacity: isAccountOpen ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex flex-col">
                  <label htmlFor="email">Email </label>
                  <input
                    id="email"
                    type="text"
                    name="email"
                    value={formData?.email || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="username">Username </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData?.username || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phoneNum">Phone </label>
                  <input
                    id="phoneNum"
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex w-full justify-center mt-6 mb-4">
                  <button
                    className="flex self-center items-center justify-center px-8 border-2 border-graphite rounded-[1.2rem] p-[0.6rem] gap-3"
                    type="button"
                    onClick={openPWModal}
                  >
                    <h2 className="text-[14px] font-[Poppins] text-center underline">
                      Change Password
                    </h2>
                    <img src={editIcon} alt="edit icon" className="h-6 w-6" />
                  </button>
                </div>
              </motion.div>
            </fieldset>

            {/* TODO: add way to update teacher image */}
            <fieldset className=" p-4 rounded-lg justify-center bg-sandwich lg:w-[643px] md:w-[475px] sm:w-[450px] w-[90%] self-center">
              {/* User Profile */}
              <section className="w-full">
                <header
                  className="flex w-full justify-between cursor-pointer"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-expanded={isProfileOpen ? "true" : "false"}
                  aria-controls="profile-settings-content"
                >
                  <h2 className="font-header4 text-header3 select-none">
                    User profile
                  </h2>
                  <svg
                    className={`transition-transform duration-300 ${
                      isProfileOpen ? "" : "rotate-180"
                    }`}
                    width="33"
                    height="33"
                    viewBox="30 10 40 40"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label={
                      isProfileOpen ? "Collapse section" : "Expand section"
                    }
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
                </header>
              </section>
              {/* User Profile Contents */}
              <motion.div
                className={`${isProfileOpen ? "" : "hidden"}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isProfileOpen ? "auto" : 0,
                  opacity: isProfileOpen ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
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
                  <label htmlFor="prefix">Prefix </label>
                  <input
                    id="prefix"
                    type="text"
                    name="prefix"
                    value={formData.prefix || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="firstName">First Name </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="lastName">Last Name </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="school">School </label>
                  <input
                    id="school"
                    type="text"
                    name="school"
                    value={formData.school || ""}
                    onChange={handleInputChange}
                    className="rounded-lg px-2 py-0.5"
                  />
                </div>
              </motion.div>
            </fieldset>
            {/* Display Section */}
            <fieldset className="flex flex-col p-4 rounded-lg justify-center bg-sandwich lg:w-[643px] md:w-[475px] sm:w-[450px] w-[90%] self-center cursor-pointer">
              {/* Display Header */}
              <section className="w-full">
                <header
                  className="flex w-full justify-between"
                  onClick={() => setIsDisplayOpen(!isDisplayOpen)}
                  aria-expanded={isDisplayOpen ? "true" : "false"}
                  aria-controls="display-settings-content"
                >
                  <h2 className="font-semibold font-header4 text-header3 font-[Poppins] select-none">
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
                    aria-label={
                      isDisplayOpen ? "Collapse section" : "Expand section"
                    }
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
                </header>
              </section>
              <motion.div
                className={`${isDisplayOpen ? "" : "hidden"}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isDisplayOpen ? "auto" : 0,
                  opacity: isDisplayOpen ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <h2>Coming soon...</h2>
              </motion.div>
            </fieldset>
          </form>

          <div className="flex relative bottom-10 lg:bottom-0 justify-center w-full my-72">
            <button
              onClick={openConfirmModal}
              className="bg-red-500 py-2 px-10 sm:px-24 rounded-lg hover:shadow-[0_0_8px_3px_rgba(200,0,0,0.8)] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 absolute"
              type="button"
            >
              <h3 className="text-white font-semibold">Delete Your Account</h3>
            </button>
          </div>

          <ConfirmationModal
            ref={confirmRef}
            closeConfirmModal={closeConfirmModal}
            itemFullName={formData?.firstName + " " + formData?.lastName}
            deleteMsg={
              "Are you sure you want to delete your account? This cannot be undone."
            }
            inputValue={inputValue}
            setInputValue={setInputValue}
            removeItemFromSystem={deleteTeacherInSystem}
            inputNeeded={true}
          />
          <PasswordChange
            ref={pwChangeRef}
            closePWModal={closePWModal}
            teacherId={userData._id}
            showMsg={showMsg}
            setShowMsg={setShowMsg}
          ></PasswordChange>
          <UnsavedChanges />
          {/* Save Button on Tablet and Phone screens centered*/}
          <div className="lg:hidden flex justify-center items-center ">
            <div
              className="lg:hidden fixed bottom-32 xs:bottom-36 flex items-center justify-center "
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
        </main>
      </div>
    </>
  );
};

export default withAuth(["teacher"])(EditTeacher);
