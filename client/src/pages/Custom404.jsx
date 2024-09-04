import React from 'react';
import { Link } from 'react-router-dom';
import QuestionFrog from "../images/student/characters/Question_Frog.png"
import Button from '../components/Button';

function Custom404() {
  return (
    <div className="text-center pt-10 sm:pt-40 flex flex-col md:flex-row items-center justify-center ">
      <img className="w-52 sm:w-auto" src={QuestionFrog} alt="question frog" />
      <div className="flex flex-col justify-center mt-10 md:mt-0 md:items-center gap-5 font-[Poppins]">
        <h1 className="text-2xl sm:text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-md px-5 sm:px-0 sm:text-lg mt-5 mb-5">
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="flex justify-center">
          <Button buttonText="Home" />
        </Link>
      </div>
    </div>
  );
}

export default Custom404;