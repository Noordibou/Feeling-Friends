import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../images/button.png";

const SignupSuccess = () => {
  const navigate = useNavigate();


  return (
    <>
        {/* page container */}
        <div className="flex flex-col min-w-screen min-h-screen justify-center items-center">
            <h1 className="text-header1 font-header1 mb-20">Success!</h1>
            

            <button
              className="w-8/12 border h-20 rounded-2xl mt-[2rem] font-button text-button text-notebookPaper bg-no-repeat bg-center bg-contain my-20"
              type="submit"
              style={{ backgroundImage: `url(${Button})` }}
            >
              <h4 className="w-full">Continue</h4>
            </button>
            
        </div>
    </>
  );
}

export default SignupSuccess;