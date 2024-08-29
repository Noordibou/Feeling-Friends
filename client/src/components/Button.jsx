import { motion } from "framer-motion"
import Background from "../images/button.png"

export default function Button({ buttonText }) {
  return (
    <>
      <div
        style={{
          backgroundImage: `url('${Background}')`,
          backgroundSize: "350px 50px",
        }}
        className="w-[80%] sm:w-[350px] h-[50px] rounded-xl overflow-hidden cursor-pointer"
      >
        <div className="w-350px h-50px flex justify-center">
          <span className="font-poppins text-white text-md font-semibold absolute z-20 mt-[12px]">
            {buttonText}
          </span>
        </div>
        <motion.div
          whileHover={{ x: 70 }}
          transition={{ ease: "linear", duration: 0.3 }}
          style={{
            backgroundImage: `url('${Background}')`,
            backgroundSize: "350px 50px",
          }}
          className="rounded-xl w-[350px] h-[50px] z-10"
        ></motion.div>
      </div>
    </>
  );
}