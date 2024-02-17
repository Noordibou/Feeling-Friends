import React, { useState } from 'react'

const ButtonView = ({ buttonText, defaultBtnImage, handleClick, isSelected, btnImageWhenOpen}) => {

  console.log("isSelected: " + isSelected)

    return (
        <>
            <div className="">
              <button className={`text-body text-[Poppins] rounded-xl px-[1rem] flex items-center h-20 w-72 border-[5px] border-sandwich justify-around ${ isSelected ? "underline font-[700] bg-sandwich" : "bg-notebookPaper"}`}
              onClick={handleClick}
              >
                <h4 className="pr-2">{buttonText}</h4>
                <img src={!isSelected ? defaultBtnImage : btnImageWhenOpen} alt={buttonText} />
              </button>
            </div>
        </>
    )
}

export default ButtonView;