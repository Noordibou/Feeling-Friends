import { useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import furnitureShapes from "../../data/furnitureShapes";
import { toggleSelected } from "../../utils/utils";

const ClassroomFurniture = ({
  classroom,
  setFurniturePositions,
  furniturePositions,
  constraintsRef,
  handleDragEnd,
  handleStudentClick,
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

        // console.log("selected Items: " + JSON.stringify(selectedItems))

        const selectedStyling = selectedItems.some(
          (selectedId) => {
            // console.log("selected._id: " + selected._id)
            // console.log("item._id: " + item._id)
            return selectedId === item._id}
        );
        // console.log("selected styling: " + selectedStyling)
        const alreadySelected = selectedItems.some(
          (furnitureId) => furnitureId === item._id
        );
        return (
          <motion.div
            id={`furniture-${item._id}`}
            key={`${item._id}`}
            dragMomentum={false}
            initial={{
              x: Math.max(0, initialX),
              y: Math.max(0, initialY),
              rotate: item.rotation || 0,
            }}
            animate={{
              rotate:
                furniturePositions[item._id]?.rotation || item.rotation || 0,
            }}
            drag
            dragElastic={0.1}
            dragPropagation={false}
            dragConstraints={constraintsRef}
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
            className={`absolute ${shape.style.width} ${shape.style.height} ${
              selectedStyling ? "border-4 border-black" : ""
            }`}
          >
            <img
              className="flex w-full h-full"
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
