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
}) => {
  return (
    <>
      <div className="mx-2">
        <button
          className={`text-body text-[Poppins] rounded-xl px-[1rem] flex items-center h-20 w-[270px] border-[5px] border-sandwich justify-around ${
            isSelected ? "underline font-[700] bg-sandwich" : "bg-notebookPaper"
          }`}
          onClick={handleClick}
        >
          <h4 className="pr-2">{buttonText}</h4>
          <img
            src={!isSelected ? defaultBtnImage : btnImageWhenOpen}
            alt={buttonText}
          />
        </button>
      </div>
    </>
  );
};

export default ButtonView;
