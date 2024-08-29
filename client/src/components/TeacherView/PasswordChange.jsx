import React, {useState} from "react";
import { updatePassword } from "../../api/userApi"
import xButton from "../../images/x-button.png"
import Button from "../Button";
import SmallSaveButton from "../SmallSaveButton"

const PasswordChange = ({showModal, setShowModal, teacherId, showMsg, setShowMsg}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      console.log("New passwords do not match");
      return;
    }

    try {
      const response = await updatePassword( teacherId, {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
    if (response.status === 200) {
        setShowMsg(true);
        setTimeout(() => {
          setShowMsg(false);
        }, 2500);
        setShowModal(false)
    }

    } catch (error) {
      console.error("oops somethign wrong with updating password")
    }
  };

  const handleCloseModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowModal(false);
  };


  return (
    <div className={`${showModal ? "flex" : "hidden"}`}>
      <div className="fixed inset-0 flex items-center justify-center z-10">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-graphite opacity-75"></div>
        <div className="relative bg-sandwich w-[80%] sm:w-auto rounded-xl p-6 sm:p-10">
          <button
            className="absolute -right-4 -top-4"
            onClick={handleCloseModal}
          >
            <img src={xButton} alt="close password change modal" />
          </button>
          <h2 className="flex my-8 text-[1.3rem] font-[Poppins]">
            Update Password
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 font-[Poppins]">
              <div className="relative flex flex-col">
                <label>Current Password:</label>
                <input
                  className="rounded-md pl-2 py-1"
                  type={showPassword === "CurrentPW" ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute right-3 top-7 cursor-pointer"
                  onMouseDown={() => setShowPassword("CurrentPW")}
                  onMouseUp={() => setShowPassword("false")}
                  onMouseLeave={() => setShowPassword("false")}
                >
                  {showPassword === "CurrentPW" ? (
                    <span class="material-symbols-outlined select-none">visibility</span>
                  ) : (
                    <span class="material-symbols-outlined select-none">
                      visibility_off
                    </span>
                  )}
                </div>
              </div>
              <div className="relative flex flex-col">
                <label>New Password:</label>
                <input
                  className="flex rounded-md pl-2 py-1"
                  type={showPassword === "NewPW" ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <div
                  className="absolute right-3 top-7 cursor-pointer"
                  onMouseDown={() => setShowPassword("NewPW")}
                  onMouseUp={() => setShowPassword("false")}
                  onMouseLeave={() => setShowPassword("false")}
                >
                  {showPassword === "NewPW" ? (
                    <span class="material-symbols-outlined select-none">visibility</span>
                  ) : (
                    <span class="material-symbols-outlined select-none">
                      visibility_off
                    </span>
                  )}
                </div>
              </div>
              <div className="relative flex flex-col">
                <label>Confirm New Password:</label>
                <input
                  className="rounded-md pl-2 py-1"
                  type={showPassword === "ConfirmNewPW" ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute right-3 top-7 cursor-pointer"
                  onMouseDown={() => setShowPassword("ConfirmNewPW")}
                  onMouseUp={() => setShowPassword("false")}
                  onMouseLeave={() => setShowPassword("false")}
                >
                  {showPassword === "ConfirmNewPW" ? (
                    <span class="material-symbols-outlined select-none">visibility</span>
                  ) : (
                    <span class="material-symbols-outlined select-none">
                      visibility_off
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button className="hidden sm:flex mt-10" type="submit">
              <Button buttonText="Save" />
            </button>
            <div className="flex sm:hidden w-full justify-center mt-10">
              <button type="submit">
                <SmallSaveButton />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
