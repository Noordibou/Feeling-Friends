import React from "react";

const SeatingChartButton = ({
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
          className={`text-[Poppins] rounded-xl flex items-center ${buttonSize === "small" ? "border-[2px] border-sandwich flex-row-reverse md:flex-col-reverse h-[50px] md:h-24 w-[140px] xs:w-[150px] md:w-20 text-[13px] justify-center" : "text-[16px] border-[4px] border-sandwich h-20 w-[270px] justify-around" }   ${
            isSelected ? "underline font-[700] bg-sandwich" : "bg-notebookPaper"
          }`}
          onClick={handleClick}
        >
          <h4 className="pl-2 md:pl-0 md:pt-2">{buttonText}</h4>
          <div className="h-6 flex items-center">
          <img
          className="w-10 pl-2"
            src={!isSelected ? defaultBtnImage : btnImageWhenOpen}
            alt={buttonText}
          />
          </div>
        </button>
      </div>
    </>
  );
};

export default SeatingChartButton;
