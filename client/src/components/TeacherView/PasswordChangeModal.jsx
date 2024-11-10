import React, { useState, forwardRef } from "react";
import { createPortal } from "react-dom";
import { updatePassword } from "../../api/userApi";
import xButton from "../../images/x-button.png";
import Button from "../Button";
import SmallSaveButton from "../SmallSaveButton";

const PasswordChangeModal = forwardRef(
  ({ closePWModal, teacherId, showMsg, setShowMsg }, pwChangeRef) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    // Single state to manage visibility of all password fields
    const [showPassword, setShowPassword] = useState({
      current: false,
      new: false,
      confirm: false,
    });

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (newPassword !== confirmNewPassword) {
        console.log("New passwords do not match");
        return;
      }

      try {
        const response = await updatePassword(teacherId, {
          currentPassword,
          newPassword,
          confirmNewPassword,
        });
        if (response.status === 200) {
          setShowMsg(true);
          setTimeout(() => {
            setShowMsg(false);
          }, 2500);
          closePWModal();
        }
      } catch (error) {
        console.error("oops somethign wrong with updating password");
      }
    };

    const handleCloseModal = () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      closePWModal();
    };

    // Toggle the visibility for a specific field
    const togglePasswordVisibility = (field) => {
      setShowPassword((prevState) => ({
        ...prevState,
        [field]: !prevState[field], // Toggle the specific field's visibility
      }));
    };

    return createPortal(
      <dialog ref={pwChangeRef} className={`rounded-xl`}>
        <div
          className="fixed inset-0 flex items-center justify-center z-10"
          role="dialog"
          aria-modal="true"
        >
          {/* Background overlay */}
          <div className="fixed inset-0 bg-graphite opacity-75"></div>
          <div className="relative bg-sandwich w-[80%] sm:w-auto rounded-xl p-6 sm:p-10">
            <button
              className="absolute -right-4 -top-4"
              onClick={handleCloseModal}
              aria-label="Close password change modal"
            >
              <img src={xButton} alt="close password change modal" />
            </button>
            <h2 className="flex my-8 text-[1.3rem] font-[Poppins]">
              Update Password
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 font-[Poppins]">
                <div className="relative flex flex-col">
                  <label htmlFor="current-password">Current Password:</label>
                  <input
                    id="current-password"
                    className="rounded-md pl-2 py-1"
                    type={showPassword.current ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <div
                    className="absolute right-3 top-7 cursor-pointer"
                    onClick={() => togglePasswordVisibility("current")}
                    aria-label={
                      showPassword.current
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showPassword.current ? (
                      <span className="material-symbols-outlined select-none">
                        visibility
                      </span>
                    ) : (
                      <span className="material-symbols-outlined select-none">
                        visibility_off
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative flex flex-col">
                  <label htmlFor="new-password">New Password:</label>
                  <input
                    id="new-password"
                    className="flex rounded-md pl-2 py-1"
                    type={showPassword.new ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <div
                    className="absolute right-3 top-7 cursor-pointer"
                    onClick={() => togglePasswordVisibility("new")}
                    aria-label={
                      showPassword.new
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showPassword.new ? (
                      <span className="material-symbols-outlined select-none">
                        visibility
                      </span>
                    ) : (
                      <span className="material-symbols-outlined select-none">
                        visibility_off
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative flex flex-col">
                  <label htmlFor="confirm-new-password">
                    Confirm New Password:
                  </label>
                  <input
                    id="confirm-new-password"
                    className="rounded-md pl-2 py-1"
                    type={showPassword.confirm ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                  <div
                    className="absolute right-3 top-7 cursor-pointer"
                    onClick={() => togglePasswordVisibility("confirm")}
                    aria-label={
                      showPassword.current
                        ? "Hide confirm new password"
                        : "Show confirm new password"
                    }
                  >
                    {showPassword.confirm ? (
                      <span className="material-symbols-outlined select-none">
                        visibility
                      </span>
                    ) : (
                      <span className="material-symbols-outlined select-none">
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
      </dialog>,
      document.getElementById("modal")
    );
  }
);

export default PasswordChangeModal;
