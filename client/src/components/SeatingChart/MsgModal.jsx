import React from 'react';
import {AnimatePresence, motion} from 'framer-motion'

// How to use this temporary message modal:
// -- Please follow the below instructions. All of the following should go on the page where it will be used
// -- make a useState on the page with the onClick (or equivalent)
// -- in onClick function, use the setShowMsg (or whatever your useState is) to true
// -- use this builtin js method to make it disappear (3000 = 3 seconds):
// setTimeout(() =>{
//     setShowMsg(false);
// }, 3000)


const MsgModal = ({ msgText, showMsg }) => {

  return (
    <>
      <AnimatePresence>
        {showMsg &&(
        <motion.div
          className="text-center bg-black bg-opacity-70 py-6 rounded-xl px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-white font-[Poppins] text-[1.85rem]">
            {msgText}
          </h3>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MsgModal;