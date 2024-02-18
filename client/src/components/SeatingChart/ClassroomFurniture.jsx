import { useState } from "react";
import { motion } from "framer-motion";
import furnitureShapes from "../../data/furnitureShapes";
import { toggleSelected } from "../../utils/editSeatChartUtil";

const ClassroomFurniture = ({
  classroom,
  setFurniturePositions,
  furniturePositions,
  constraintsRef,
  handleDragEnd,
  selectedItems,
  setSelectedItems,
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
              rotate:
                furniturePositions[item._id]?.rotation || item.rotation,
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
            onClick={() => {
              setSelectedItems(toggleSelected(item._id, alreadySelected, selectedItems))
            }}
            onDoubleClick={() => {
              if (!isDragging) {
                setFurniturePositions((prevPositions) => {
                  const prevRotation =
                    furniturePositions[item._id]?.rotation ||
                    item.rotation ||
                    0;
                  const newRotation = prevRotation + 90;

                  console.log("furniture position? " + JSON.stringify(furniturePositions))
                  console.log("New rotation: " + newRotation)
                  console.log("item.x: " + item.x)
                  console.log("item.y: " + item.y)

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
            className={`absolute border-4 rounded-xl ${shape.style.width} ${shape.style.height} ${
              selectedStyling ? "border-black" : " border-notebookPaper border-opacity-0"
            }`}
          >
            <img
              className="flex w-full h-full border-pink"
              src={shape.src}
              alt={shape.alt}
            />
          </motion.div>
        );
      })}
    </>
  );
};

export default ClassroomFurniture;
