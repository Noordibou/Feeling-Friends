import { motion } from "framer-motion"
import Background from "../images/smallbutton.svg"

export default function SmallSaveButton() {
    return (
        <>
        
        
        <div 
        style={{ backgroundImage: `url('${Background}')` }} 
        className="w-[168px] h-[51px] rounded-xl overflow-hidden cursor-pointer drop-shadow-lg">
        <div className="w-186px h-51px flex justify-center">
        <span className="font-poppins text-white text-md font-semibold drop-shadow-lg absolute z-20 mt-[12px]">Save</span>
        </div>
        <motion.div 
        whileHover={{ x: 24 }}
        transition={{ ease: "linear", duration: 0.3 }}
        style={{ backgroundImage: `url('${Background}')` }} 
        className="rounded-xl w-[168px] h-[51px] z-10">
        </motion.div>

        </div>
        
        </>
    );
}