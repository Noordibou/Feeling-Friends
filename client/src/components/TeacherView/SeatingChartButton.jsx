import React from "react";

const SeatingChartButton = ({
  buttonText,
  defaultBtnImage,
  handleClick,
  isSelected,
  btnImageWhenOpen,
  flexType,
  buttonSize,
}) => {
  return (
    <>
      <div className={`${buttonSize !== "small" ? "mx-2" : ""}`}>
        <button
          className={`text-[Poppins] rounded-xl flex items-center ${
            buttonSize === "small"
              ? "border-[2px] border-sandwich flex-col-reverse gap-4 py-2 pt-4 w-[130px] text-[13px] justify-center"
              : "text-[16px] border-[4px] border-sandwich h-20 w-[270px] justify-around"
          }   ${
            isSelected ? "underline font-[700] bg-sandwich" : "bg-notebookPaper"
          }`}
          onClick={handleClick}
        >
          <p className="md:pt-2">{buttonText}</p>
          <div className="h-6 flex items-center">
            <img
              className="w-12"
              src={!isSelected ? defaultBtnImage : btnImageWhenOpen}
              alt=""
            />
          </div>
        </button>
      </div>
    </>
  );
};

export default SeatingChartButton;
