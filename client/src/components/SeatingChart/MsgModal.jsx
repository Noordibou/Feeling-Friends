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
// Ex: <MsgModal showMsg={showMsg} msgText="anything you want as text" bgColor="bg-gray" textColor="textwhite" />
// // (bgColor is optional)


// * Can also be used as a normal permanent Msg modal. To do this, do the following:
// <MsgModal showMsg={true} msgText="anything you want as text" bgColor="bg-gray" textColor="text-white" />

// TODO: might use tailwind animations instead of framer for this to make this component even more reusable https://tailwindcss.com/docs/animation

const MsgModal = ({ msgText, showMsg, bgColor, textColor }) => {

  return (
    <>
      <AnimatePresence>
        {showMsg &&(
        <motion.div
          className={`text-center ${bgColor} bg-opacity-70 py-6 rounded-xl px-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <h3 className={`${textColor} font-[Poppins] text-[1.85rem]`}>
            {msgText}
          </h3>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MsgModal;