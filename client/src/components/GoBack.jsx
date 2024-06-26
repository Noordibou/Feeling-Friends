import React from 'react';
import { useNavigate } from "react-router-dom";
import Back from "../images/go-back.png";



const GoBack = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1)
    }

    return (
        <button className="flex justify-center">
            <img src={Back} alt="back arrow" className="h-[24px] w-[20px]" onClick={goBack}/>
        </button>
    )
  }

export default GoBack;