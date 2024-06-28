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
          className={`text-[16px]  text-[Poppins] rounded-xl flex items-center ${buttonSize === "small" ? "flex-col-reverse pt-3 pb-1 h-[80px] md:h-24 w-24 text-[13px]" : "h-20 w-[270px] border-[4px] border-sandwich" }  justify-around ${
            isSelected ? "underline font-[700] bg-sandwich" : "bg-notebookPaper"
          }`}
          onClick={handleClick}
        >
          <h4 className="">{buttonText}</h4>
          <img
          className="w-10"
            src={!isSelected ? defaultBtnImage : btnImageWhenOpen}
            alt={buttonText}
          />
        </button>
      </div>
    </>
  );
};

export default ButtonView;
