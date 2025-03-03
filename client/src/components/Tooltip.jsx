import { useState } from "react";
import { motion } from "framer-motion";

const Tooltip = ({ children, content, tooltipStyling }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {isHovered && (
        <motion.div
          className={`absolute bottom-full mb-2 py-3 h-12 ${tooltipStyling} bg-graphite text-white text-sm px-5 rounded-3xl shadow-lg z-30 underline whitespace-nowrap`}
          initial={{ opacity: 0, x: -10 }} // Start from a slightly off position and transparent
          animate={{ opacity: 1, x: 0 }} // Animate to visible position
          exit={{ opacity: 0, x: -10 }} // Exit with fade and shift
          transition={{ duration: 0.3, ease: "easeInOut" }} // Set duration and easing
        >
          {content}
        </motion.div>
      )}
    </div>
  );
};

export default Tooltip;
