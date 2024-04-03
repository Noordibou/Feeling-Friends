import { motion } from "framer-motion"
import Background from "../images/smallbutton.png"

export default function SmallSaveButton() {
    return (
        <>
        
        
        <div 
        style={{ backgroundImage: `url('${Background}')` }} 
        className="w-[200px] h-[88px] rounded-xl overflow-hidden cursor-pointer">
        <div className="w-200px h-88px flex justify-center">
        <span className="font-poppins text-white text-lg font-semibold absolute z-20 mt-[24px]">Save</span>
        </div>
        <motion.div 
        whileHover={{ x: 24 }}
        transition={{ ease: "linear", duration: 0.3 }}
        style={{ backgroundImage: `url('${Background}')` }} 
        className="rounded-xl w-[200px] h-[88px] z-10">
        </motion.div>

        </div>
        
        </>
    );
}