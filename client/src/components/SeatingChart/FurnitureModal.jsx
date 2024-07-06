import { useState, useRef } from "react";
import furniture from "../../data/furnitureShapes";
import CancelImg from "../../images/x-button.png";
import { addFurniture } from "../../api/teachersApi";
import { toggleSelected } from "../../utils/editSeatChartUtil";

const FurnitureModal = ({ setShowFurnitureModal, teacherId, classroomId, updateInfo }) => {
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
      {/* Modal */}
      <div className="bg-[#D2C2A4] border-[8px] border-[#A59F8B] absolute mr-auto ml-auto mt-[188px] z-10 w-[752px] h-[61%] rounded-lg opacity-90"></div>
        <div className="absolute mt-[222px] z-20 h-[55%] w-[686px] bg-notebookPaper border-sandwich border-4 rounded-xl">
          <div className="flex flex-col w-full bg-darkTeal items-end">
            <button onClick={onClose}>
              <img
                className="absolute -top-6 -right-6"
                src={CancelImg}
                alt="close student roster"
              />
            </button>
          </div>
          <div className="px-10 pb-10 flex h-full flex-col">
            <h2 className="font-[Poppins] text-[24px] my-5">
              Tap to add objects to the classroom
            </h2>
            <div className="flex h-full flex-col ">
              {/* Container for Furniture */}
              <div className="flex flex-row w-full flex-wrap h-96 items-center justify-center overflow-y-auto">
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
                    
                    <div key={`furniture-${key}-container`}>
                      <div
                        id={`furniture-${key}`}
                        key={`${key}`}
                        className={`flex rounded-2xl ${item.style.width} ${
                          item.style.height
                        } ${isSelectedItem ? "border-2 border-black" : ""} m-5`}
                        onClick={ () => {
                          setIsSelected(toggleSelected(newFormat, alreadySelected, isSelected))
                        }}
                      >
                        <img
                          id={`furniture-img-${key}`}
                          key={`img-${key}`}
                          className={`flex rounded-2xl w-full h-full`}
                          src={item.src}
                          alt={item.alt}
                        />
                      </div>
                      </div>
                    
                  );
                })}
              </div>
              <div className="flex items-center h-1/3 justify-center">
                <button
                  id="unassigned-section"
                  className="flex items-center h-[90px] w-full flex-col rounded-2xl border-4 border-darkSandwich"
                  onClick={() => onConfirm()}
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

export default FurnitureModal;
