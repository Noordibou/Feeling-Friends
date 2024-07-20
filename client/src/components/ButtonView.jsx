import React from "react";

// This component is for the buttons that are sandwich/notepaper color
// // mainly the two buttons in manage class list and classroom, 
// // as well as in the edit seating chart for student roster and classroom furniture

const ButtonView = ({
  buttonText,
  defaultBtnImage,
  handleClick,
  isSelected,
  btnImageWhenOpen,
  flexType,
  buttonSize
}) => {
  return (
    <>
      <div className={`${buttonSize !== "small" ? "mx-2" : ""}`}>
        <button
          className={`text-[Poppins] rounded-xl flex items-center ${buttonSize === "small" ? "border-[2px] border-sandwich flex-col-reverse h-[80px] md:h-24 w-20 text-[13px] justify-center" : "text-[16px] border-[4px] border-sandwich h-20 w-[270px] justify-around" }   ${
            isSelected ? "underline font-[700] bg-sandwich" : "bg-notebookPaper"
          }`}
          onClick={handleClick}
        >
          <h4 className="pt-2">{buttonText}</h4>
          <div className="h-6 flex items-center">
          <img
          className="w-6"
            src={!isSelected ? defaultBtnImage : btnImageWhenOpen}
            alt={buttonText}
          />
          </div>
        </button>
      </div>
    </>
  );
};

export default ButtonView;
