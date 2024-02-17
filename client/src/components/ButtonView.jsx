import React, { useState } from 'react'

const ButtonView = ({ buttonText, defaultSetting, toggle, btnImage, handleClick, isRosterClick}) => {

  const [isSelected, setIsSelected] = useState(defaultSetting)


    return (
        <>
            <div className="">
              <button className={`text-body text-[Poppins] rounded-xl px-[1rem] flex items-center h-20 w-72 border-[5px] border-sandwich justify-around ${isRosterClick ? "underline font-[700] bg-sandwich" : "bg-notebookPaper"}`}
              onClick={ () => {
                if(toggle) {
                  handleClick(!isRosterClick)
                }
                
              }}
              >
                <h4 className="pr-2">{buttonText}</h4>
                <img src={btnImage} alt="Student Room View" />
              </button>
            </div>
        </>
    )
}

export default ButtonView;