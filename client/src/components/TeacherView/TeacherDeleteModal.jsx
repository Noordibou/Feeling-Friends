import { useState } from 'react'
import { deleteTeacher } from "../../api/teachersApi"
import { useNavigate } from 'react-router-dom';

const TeacherDeleteModal = ({ showDeleteModal, setShowDeleteModal, teacherFullName, teacherId }) => {

    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    const resetInput = () => {
        setInputValue('');
        setShowDeleteModal(false);
    };

    const deleteTeacherInSystem = async () => {
      if (inputValue === teacherFullName) {
        console.log('Deleting teacher');
        const response = await deleteTeacher(teacherId)
        if (response === 200) {
          sessionStorage.setItem('teacherDeleteInfo', JSON.stringify({
            success: true,
            teacherName: teacherFullName
          }));
          navigate(`/signup`)
        }
      } else {
        console.log('Name does not match');
      }
    };

  return (
    <div className={`${showDeleteModal ? "flex" : "hidden"}`}>
      <div className={`fixed inset-0 flex items-center justify-center z-10`}>
        <div
          className="fixed inset-0 bg-graphite opacity-75"
          onClick={resetInput}
        ></div>
        <div className="relative bg-sandwich w-[80%] sm:w-auto max-w-[500px] rounded-xl p-6 sm:p-10 font-[Poppins]">
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
          
          <h1 className="select-none pt-6">
            Are you sure you want to delete your account and info from the system? This cannot be undone.
          </h1>
          <h2 className="select-none py-2">Type the your full name to confirm.</h2>
          <p className="py-5">{teacherFullName}</p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mt-2 w-full"
          />
          <div className="w-full flex justify-end pt-8">
            <button
            type="button"
            className="bg-red-500 text-white font-semibold mt-4 p-2 rounded-md"
            onClick={() => deleteTeacherInSystem()}
            >
            Delete Your Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDeleteModal