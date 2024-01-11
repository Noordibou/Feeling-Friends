import { useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import furniture from "../../data/furnitureShapes";
import CancelImg from "../../images/x-button.png"

const AddFurnitureToClassroom = ({}) => {
  // TODO: How to do this
  // // when user clicks on a certain furniture, it will be added to the furniture list array and be submitted to backend.
  // // need furniture to refresh based on backend, does it already do that?




  return (
    <>
      {/* Modal */}
      <div className="absolute top-60 left-[8.5%] z-10 h-[648px] w-[686px] bg-notebookPaper border-sandwich border-4 rounded">
      <div className="flex flex-col w-full bg-darkTeal items-end">
        <button onClick={() => console.log("Click click")}>
            <img className="absolute -top-6 -right-6" src={CancelImg} alt="close student roster" />
        </button>
      </div>
      <div className="px-10 pb-10 flex h-full flex-col">
        <h2 className="font-[Poppins] text-[24px] my-5">
          Tap to add objects to the classroom
        </h2>
        <div className="flex h-full flex-col ">
          {/* Container for Furniture */}
          <div className="flex flex-row flex-wrap h-96 items-center justify-center overflow-y-auto">
            {furniture.map((item, key) => {
              return (
                <>
                  <div
                    id={`furniture-${key}`}
                    key={`${key}`}
                    className={`flex ${item.style.width} ${item.style.height} m-5`}
                  >
                    <img
                      className="flex w-full h-full"
                      src={item.src}
                      alt={item.alt}
                    />
                  </div>
                </>
              );
            })}
          </div>
          <div className="flex items-center h-1/3 justify-center">
            <button
              id="unassigned-section"
              className="flex items-center h-[90px] w-full flex-col rounded-2xl border-4 border-darkSandwich"
            >
              <h2 className="flex items-center h-full font-semibold text-header2">
                Confirm
              </h2>
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default AddFurnitureToClassroom;
