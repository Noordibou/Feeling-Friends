import { useState } from "react";
import furniture from "../../../data/furnitureShapes";
import CancelImg from "../../../images/x-button.png";
import { addFurniture } from "../../../api/teachersApi";
import { toggleSelected } from "../../../utils/editSeatChartUtil";

const FurnitureModal = ({
  setShowFurnitureModal,
  teacherId,
  classroomId,
  updateInfo,
}) => {
  const [isSelected, setIsSelected] = useState([]);

  const onConfirm = async () => {
    try {
      await addFurniture(teacherId, classroomId, isSelected);
      setIsSelected([]);
      updateInfo();
      onClose();
    } catch (error) {
      console.error("An error occured adding furniture: ", error);
    }
  };

  const onClose = () => {
    setShowFurnitureModal(false);
    setIsSelected([]);
  };

  return (
    <>
      {/* background to modal */}
      <div className="bg-[#D2C2A4] border-[8px] border-[#A59F8B] fixed md:absolute top-0 z-30 w-full md:w-[752px] h-full rounded-lg opacity-90"></div>

      {/* modal */}
      <div className="w-full md:w-auto flex justify-center items-center ">
        <div className="fixed md:absolute top-32 md:top-8  z-30 mx-5 h-[70%] md:h-[90%] w-[80%] md:w-[686px] bg-notebookPaper border-sandwich border-4 rounded-xl">
          <div className="flex flex-col w-full items-end">
            <button onClick={onClose}>
              <img
                className="absolute -top-6 -right-6"
                src={CancelImg}
                alt="close student roster"
              />
            </button>
          </div>
          <div className="px-4 md:px-10 pb-10 flex h-full flex-col">
            <h2 className="font-[Poppins] text-[20px] md:text-[24px] my-5">
              Tap to add objects to the classroom
            </h2>
            <div className="flex h-full flex-col ">
              {/* Container for Furniture */}
              <div className="flex flex-col md:flex-row w-full md:flex-wrap h-[65%] md:h-96 items-center md:justify-center overflow-x-hidden overflow-y-auto">
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
                        key={`${key}`}
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
                      >
                        <img
                          id={`furniture-img-${key}`}
                          key={`img-${key}`}
                          className={`flex rounded-2xl  md:w-full h-[60%] md:h-full`}
                          src={item.src}
                          alt={item.alt}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center h-1/3 justify-center pb-6">
                <button
                  id="unassigned-section"
                  className="flex items-center md:h-[90px] w-full flex-col rounded-2xl border-4 mt-4 mb-10 border-darkSandwich"
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
    </>
  );
};

export default FurnitureModal;
