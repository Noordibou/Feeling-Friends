import React from 'react';
import {AnimatePresence, motion} from 'framer-motion'
import saveBg from '../../images/saveModalBg.png'
import successFrog from '../../images/successFrog.png'

// How to use this temporary message modal:
// Please follow the below instructions. All of the following should go on the page where it will be used
// -- make a useState on the page (I defined it as showMsg and setShowMsg) and an onClick function (or equivalent)
// -- in onClick function, use the setShowMsg (or whatever your useState is) to true
// -- use the below builtin js method to make it disappear (3000 = 3 seconds):
// setTimeout(() =>{
//     setShowMsg(false);
// }, 3000)

// Ex: <MsgModal showMsg={showMsg} msgText="anything you want as text" textColor="textwhite" />


// * Can also be used as a normal permanent Msg modal. To do this, do the following:
// <MsgModal showMsg={true} msgText="anything you want as text" />

// TODO: might use tailwind animations instead of framer for this to make this component even more reusable https://tailwindcss.com/docs/animation

const MsgModal = ({ msgText, showMsg }) => {

  return (
    <>
      <AnimatePresence>
        {showMsg && (
          <motion.div
            className={`fixed bottom-0 z-50 w-full max-w-[1024px] lg:max-w-[780px] object-cover rounded-t-[1rem] h-44 sm:h-36`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "tween", stiffness: 120, damping: 15 }}
          >
            <div className="absolute top-0 left-0 w-full h-full flex justify-center pt-10 sm:mt-2">
              <h3
                className={`text-black relative text-center font-[Poppins] font-semibold text-[1.65rem]`}
              >
                {msgText}
              </h3>
            
            <div className="flex sm:hidden absolute bottom-0 left-0 w-full items-center justify-center">
                <img src={successFrog} className="mt-4 sm:mt-2" alt="Success Frog" />
              </div>
              </div>
            <img alt="save success" src={saveBg} className={`w-full h-full sm:h-[200px]`} />
            <div className="sm:absolute hidden bottom-0 left-12 sm:flex items-end h-full">
              <img src={successFrog} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MsgModal;