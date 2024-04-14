import { motion } from "framer-motion"
import Background from "../images/button.png"

export default function SaveButton() {
    return (
        <>
        
        
        <div 
        style={{ backgroundImage: `url('${Background}')` }} 
        className="w-[700px] h-[80px] rounded-xl overflow-hidden cursor-pointer">
        <div className="w-700px h-80px flex justify-center">
        <span className="font-poppins text-white text-lg font-semibold absolute z-20 mt-[20px]">Save</span>
        </div>
        <motion.div 
        whileHover={{ x: 70 }}
        transition={{ ease: "linear", duration: 0.3 }}
        style={{ backgroundImage: `url('${Background}')` }} 
        className="rounded-xl w-[700px] h-[80px] z-10">
        </motion.div>

        </div>
        
        </>
    );
}