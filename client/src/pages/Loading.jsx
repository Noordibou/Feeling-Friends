import React from 'react'
import FriendsLogo from "../images/logo.png"
import FriendWheel from "../images/friendwheel.png";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen justify-center items-center">
      <div className="mx-10 -mt-20">
        <img
          src={FriendsLogo}
          alt="feeling friends logo"
          className="w-40 sm:w-60"
        />
      </div>
      <div className="flex justify-center my-10 sm:my-20 mx-2 sm:mx-10">
        <motion.div
          className="w-[85%] sm:w-[75%] max-sm:w-[90%] max-sm:mt-[2rem] max-sm:ml-auto max-sm:mr-auto"
          animate={{ rotate: [0, 360] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <img
            src={FriendWheel}
            alt="Friend Wheel"
            className="w-[80%] ml-auto mr-auto"
          />
        </motion.div>
      </div>
      <div className="flex items-center">
        <p className="text-gray font-semibold font-[Poppins] text-[16px] sm:text-[20px]">Loading...be there soon!</p>
      </div>
    </div>
  );
}

export default Loading