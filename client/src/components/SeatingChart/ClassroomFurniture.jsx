import { useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import furnitureShapes from "../../data/furnitureShapes";

const ClassroomFurniture = ({
  classroom,
  setFurniturePositions,
  furniturePositions,
  constraintsRef,
  handleDragEnd,
}) => {
  const [isDragging, setIsDragging] = useState(false);


  return (
    <>
      {classroom.furniture.map((item, index) => {
        const shape = furnitureShapes.find((shape) => shape.name === item.name);
        console.log("Item: " + JSON.stringify(item.name))
        // console.log("shape: " + JSON.stringify(shape))
        const initialX = item.x;
        const initialY = item.y;
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
              if (!isDragging) {
                setFurniturePositions((prevPositions) => {
                  console.log(
                    "furniture positions rotatteeetet: " +
                      furniturePositions[item._id]?.rotation
                  );
                  const prevRotation =
                    furniturePositions[item._id]?.rotation ||
                    item.rotation ||
                    0;
                  const newRotation = prevRotation + 90;
                  console.log("prevRotation: " + prevRotation);
                  console.log("newRotation: " + newRotation);

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
            className={`absolute ${shape.style.width} ${shape.style.height}`}
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
