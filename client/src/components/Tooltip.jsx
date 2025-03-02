import { useState } from "react";

const Tooltip = ({ children, content, side }) => {
  const [isHovered, setIsHovered] = useState(false);
  //  hello
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {isHovered && (
        <div
          className={`absolute bottom-full mb-2 ${side} py-3 transform -translate-x-1/2 bg-graphite text-white text-sm px-5 rounded-3xl shadow-lg z-30 underline whitespace-nowrap`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
