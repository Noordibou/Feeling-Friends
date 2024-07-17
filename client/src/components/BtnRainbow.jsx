import React from 'react'
import saveButton from '../images/button.png'
import { motion } from 'framer-motion'

// This button is the ZOR colors button, it has an image as its background.
// the size is determined by the page it's being used in. Just wrap it in a div and adjust the size that way.

const BtnRainbow = ({textColor, btnText, handleSave}) => {

    return (
      
        <button
          className="relative overflow-hidden rounded-xl"
          onClick={handleSave}
          type="submit"
        >
          <motion.img
            alt="Save Seating Chart"
            className={`object-cover h-12 md:h-20 rounded-xl w-full`}
            src={saveButton}
          />
          <h4 className={`absolute text-[17px] md:text-[23px] font-[Poppins] inset-0 flex items-center justify-center ${textColor} font-bold`}>
            {btnText}
          </h4>
        </button>
      
    );
}

export default BtnRainbow;