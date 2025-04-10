import { useState, useEffect, forwardRef } from "react";
import furniture from "../../../data/furnitureShapes";
import CancelImg from "../../../images/x-button.png";
import { addFurniture } from "../../../api/teachersApi";
import { toggleSelected } from "../../../utils/editSeatChartUtil";
import { createPortal } from "react-dom";

const FurnitureModal = forwardRef(
  (
    { closeFurnitureModal, teacherId, classroomId, updateInfo },
    furnitureModalRef
  ) => {
    const [isSelected, setIsSelected] = useState([]);

    const onConfirm = async () => {
      try {
        await addFurniture(teacherId, classroomId, isSelected);
        setIsSelected([]);
        updateInfo();
        onClose();
      } catch (error) {
        console.error("An error occurred adding furniture: ", error);
      }
    };

    const onClose = () => {
      closeFurnitureModal();
      setIsSelected([]);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    useEffect(() => {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    return createPortal(
      <dialog ref={furnitureModalRef} className="rounded overflow-visible">
        <div className="w-full md:w-auto flex justify-center items-center border-4 bg-notebookPaper border-sandwich">
          <div className="relative h-[70%] md:h-[90%] w-full sm:w-[85%] md:w-[686px] p-5 sm:p-10 rounded">
            <div className="flex justify-end">
              <button onClick={onClose}>
                <img
                  className="absolute -top-6 -right-4 sm:-right-16 md:-right-6"
                  src={CancelImg}
                  alt="close furniture modal"
                  tabIndex="0"
                />
              </button>
            </div>
            <div className="px-4 md:px-10 sm:pb-10 flex h-full flex-col">
              <h2 className="font-[Poppins] text-[20px] md:text-[24px] my-5">
                Tap to add objects to the classroom
              </h2>
              <div className="flex h-full flex-col">
                {/* Container for Furniture */}
                <div className="flex flex-col md:flex-row w-full md:flex-wrap max-h-[330px] md:max-h-96 items-center md:justify-center overflow-x-hidden overflow-y-auto">
                  {furniture.map((item, key) => {
                    const isSelectedItem = isSelected.some(
                      (selectedItem) => selectedItem.name === item.name
                    );
                    const newFormat = {
                      name: item.name,
                      x: 0,
                      y: 0,
                      assigned: true,
                      rotation: 0,
                    };

                    const alreadySelected = isSelected.some(
                      (furnitureItem) => furnitureItem.name === item.name
                    );

                    return (
                      <div
                        className="flex justify-center"
                        key={`furniture-${key}-container`}
                      >
                        <div
                          id={`furniture-${key}`}
                          className={`flex rounded-2xl ${item.style.width} ${
                            item.style.height
                          } ${
                            isSelectedItem ? "border-2 border-black" : ""
                          } justify-center my-3 md:m-5`}
                          onClick={() => {
                            setIsSelected(
                              toggleSelected(
                                newFormat,
                                alreadySelected,
                                isSelected
                              )
                            );
                          }}
                          tabIndex={0}
                        >
                          <img
                            id={`furniture-img-${key}`}
                            className="flex rounded-2xl md:w-full h-[60%] md:h-full"
                            src={item.src}
                            alt={item.alt}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center h-1/3 justify-center pb-4">
                  <button
                    id="unassigned-section"
                    className="flex items-center md:h-[90px] w-full flex-col rounded-2xl border-4 mt-8 border-darkSandwich"
                    onClick={() => onConfirm()}
                  >
                    <h2 className="flex items-center h-full font-semibold py-2 md:py-0 text-[20px] md:text-header2">
                      Confirm
                    </h2>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>,
      document.getElementById("modal")
    );
  }
);

export default FurnitureModal;
