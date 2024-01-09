import { useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

const PlaygroundTest = () => {
  const [isActive, setIsActive] = useState(false);
  const [rotatePosition, setRotatePosition] = useState({x: 50, y: 50})
  const divRef = useRef(null);

  const handleDragEnd = () => {
    if(divRef.current) {
    const furnitureDiv = document.getElementById("test-div");

    let furnishCoords = furnitureDiv.style.transform.match(
        /^translateX\((.+)px\) translateY\((.+)px\) translateZ/
      );


        if(furnishCoords){
            console.log("x hmmm" + JSON.stringify(furnishCoords))
            setRotatePosition({
                x: parseInt(furnishCoords[1]),
                y: parseInt(furnishCoords[2])
            })
        }
    }
  }

  return (
    <>
      <motion.div
        ref={divRef}
        className="w-40 h-20 flex justify-center items-center bg-darkTeal"
        id="test-div"
        dragMomentum={false}
        drag
        dragElastic={0}
        dragPropagation={false}
        onDragEnd={handleDragEnd}
        style={{
          x: rotatePosition.x,
          y: rotatePosition.y,
          rotate: isActive ? 90 : 0,
        }}
        onClick={() => {
          setIsActive(!isActive);
        }}
      >
        <h3>Rotate pls</h3>
      </motion.div>
    </>
  );
};

export default PlaygroundTest;