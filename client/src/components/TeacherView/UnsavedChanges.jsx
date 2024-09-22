import React from 'react'
import QuestionFrog from "../../images/teacher/unsaved_frog.svg"
import { useUnsavedChanges } from '../../context/UnsavedChangesContext';

const UnsavedChanges = () => {
    const { showUnsavedModal, setShowUnsavedModal, confirmChanges } = useUnsavedChanges();

  return (
    <div
      className={`${
        showUnsavedModal ? "flex" : "hidden"
      } fixed inset-0 z-50 flex items-center justify-center`}
    >
      <div
        className="fixed inset-0 bg-graphite opacity-75"
        onClick={() => setShowUnsavedModal(false)}
      ></div>
      <div className="relative bg-notebookPaper w-[80%] sm:w-auto max-w-[500px] rounded-xl px-6 sm:px-10 font-[Poppins]">
        <div className="relative container mx-auto mb-20">
          <img className="block pl-20" src={QuestionFrog} alt="question frog" />
        </div>

        {/* Text section */}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-[20px]">
            Looks like you've got unsaved changes.
          </h2>
          <p>
            Are you sure you'd like to discard them? This action cannot be
            undone.
          </p>
        </div>
        {/* buttons container */}
        <div className="flex flex-col w-full mb-10 gap-4 mt-10">
          <button
            type="button"
            className="border-2 hover:border-4 border-graphite rounded-xl flex flex-row items-center justify-center sm:gap-3 h-12"
            onClick={() => setShowUnsavedModal(false)}
          >
            <svg
              className="pr-4 sm:pr-0" 
              width="30"
              height="30"
              viewBox="0 0 30 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="5"
                y1="30"
                x2="25"
                y2="18"
                stroke="#8D8772"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="5"
                y1="30"
                x2="25"
                y2="42"
                stroke="#8D8772"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            <p className="text-[0.9rem] sm:text-[1rem]">No, take me back!</p>
          </button>

          <button
            type="button"
            className="bg-orange border-4 border-orange hover:border-lightOrange hover: text-white flex flex-row items-center justify-center py-4 rounded-xl gap-2 h-14"
            onClick={confirmChanges}
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
            <p>Discard Changes</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnsavedChanges