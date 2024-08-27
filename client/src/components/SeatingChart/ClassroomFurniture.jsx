import { useState } from "react";
import { motion } from "framer-motion";
import furnitureShapes from "../../data/furnitureShapes";
import { toggleSelected } from "../../utils/editSeatChartUtil";
import xButton from "../../images/x-button.png"

const ClassroomFurniture = ({
  classroom,
  setFurniturePositions,
  furniturePositions,
  constraintsRef,
  handleDragEnd,
  selectedItems,
  setSelectedItems
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      {classroom.furniture.map((item, index) => {
        const shape = furnitureShapes.find((shape) => shape.name === item.name);
        const initialX = item.x;
        const initialY = item.y;

        const selectedStyling = selectedItems.some(
          (selectedId) => {
            return selectedId === item._id}
        );
        const alreadySelected = selectedItems.some(
          (furnitureId) => furnitureId === item._id
        );

        const radians = ((furniturePositions[item._id]?.rotation || item?.rotation) * Math.PI) / 180;
        const sinTheta = Math.abs(Math.sin(radians));
        const cosTheta = Math.abs(Math.cos(radians));

        const constraintsFurnWidth = shape.style.width.split("[")[1].split("px]")[0]/2
        const constraintsFurnHeight = shape.style.height.split("[")[1].split("px]")[0]/2

        let dragConstraints = {};
        if ((furniturePositions[item._id]?.rotation || item?.rotation) % 360 === 90 || (furniturePositions[item._id]?.rotation || item?.rotation) % 360 === 270) {
          dragConstraints = {
            left: -constraintsFurnWidth -(constraintsFurnWidth * cosTheta)+10,
            right: 710 - constraintsFurnWidth - (constraintsFurnHeight * cosTheta), 
            top: (constraintsFurnWidth) - (constraintsFurnHeight * sinTheta) - 10,
            bottom: 710 - (constraintsFurnHeight) - (constraintsFurnWidth * sinTheta),
          };
        } else {
          dragConstraints = constraintsRef;
        }

        return (
          <motion.div
            id={`furniture-${item._id}`}
            key={`${item._id}`}
            dragMomentum={false}
            initial={{
              x: initialX,
              y: initialY,
              rotate: item.rotation || 0,
            }}
            animate={{
              rotate: furniturePositions[item._id]?.rotation || item.rotation,
            }}
            drag
            dragElastic={0}
            dragPropagation={false}
            dragConstraints={dragConstraints}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
              handleDragEnd(item._id, "furniture");
              setIsDragging(false);
            }}
            className={`absolute rounded-xl ${shape.style.width} ${shape.style.height}`}
          >
            <div className="relative">
              <button
                className="absolute -top-2 -left-2 z-10"
                onClick={() => {
                  if (!isDragging) {
                    setFurniturePositions((prevPositions) => {
                      const prevRotation =
                        furniturePositions[item._id]?.rotation ||
                        item.rotation ||
                        0;
                      const newRotation = prevRotation + 90;

                      return {
                        ...prevPositions,
                        [item._id]: {
                          x: item.x,
                          y: item.y,
                          assigned: true,
                          rotation: newRotation,
                        },
                      };
                    });
                  }
                }}
              >
                <span className="material-symbols-outlined  text-[30px]">
                  refresh
                </span>
              </button>
                <button
                  className={`absolute -top-2 -right-2 mt-1 ml-1 rounded-full h-6 w-6 flex items-center justify-center ${selectedStyling ? "bg-emerald-500" : "bg-red-500"} z-20`}
                  onClick={() => {
                    setSelectedItems(toggleSelected(item._id, alreadySelected, selectedItems));
                  }}
                >
                  {/* <img src={xButton} alt="remove item" className="h-6 w-6" /> */}
                  <p className="flex items-center font-bold text-white text-lg h-full -mt-1">{ selectedStyling ? "+" : "-"}</p>
                </button>

              <img
                draggable={false}
                className={`flex w-full h-full ${ selectedStyling ? "opacity-50" : ""}`}
                src={shape.src}
                alt={shape.alt}
              />
            </div>
          </motion.div>
        );
      })}
    </>
  );
};

export default ClassroomFurniture;
