import React from 'react'

const ButtonView = ({ buttonText, fontDeco, btnImage, bgColor}) => {

    return (
        <>
            <div className="">
              <button className={`text-body font-body rounded-xl px-[1rem] ${bgColor} flex items-center h-20 w-72 border-[5px] border-sandwich justify-center ${fontDeco ? "underline font-[900]" : ""}`}>
                <h4 className="pr-2">{buttonText}</h4>
                <img src={btnImage} alt="Student Room View" />
              </button>
            </div>
        </>
    )
}

export default ButtonView;