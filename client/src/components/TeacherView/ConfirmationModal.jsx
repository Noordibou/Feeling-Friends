import { forwardRef } from "react";
import { createPortal } from "react-dom";

const ConfirmationModal = forwardRef(
  (
    {
      closeConfirmModal,
      itemFullName,
      deleteMsg,
      inputValue,
      setInputValue,
      removeItemFromSystem,
      inputNeeded,
      itemId,
    },
    confirmRef
  ) => {
    const resetInput = () => {
      if (inputNeeded) {
        setInputValue("");
      }
      closeConfirmModal();
    };

    return createPortal(
      <dialog
        ref={confirmRef}
        className={`border-2 border-darkSandwich bg-lightSandwich rounded-xl`}
      >
        <div className={`flex items-center justify-center z-10`}>
          <div className="relative   sm:w-auto rounded-xl p-6 sm:p-10 font-[Poppins]">
            <button
              onClick={resetInput}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h1 className="select-none pt-6">{deleteMsg}</h1>

            {inputNeeded ? (
              <>
                <h2 className="select-none">Type the below text to confirm.</h2>
                <p id="user-fullname" className="py-5 font-bold">
                  {itemFullName}
                </p>
                <input
                  id="name-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 mt-2 w-full"
                />
              </>
            ) : null}
            <div className="w-full flex justify-end pt-8">
              <button
                type="button"
                className="bg-red-500 text-white font-semibold mt-4 p-2 rounded-md"
                onClick={() => removeItemFromSystem(itemId, itemFullName)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </dialog>,
      document.getElementById("modal")
    );
  }
);

export default ConfirmationModal;
