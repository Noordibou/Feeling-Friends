import { useRef, useState } from 'react';
import { motion } from 'framer-motion'
import Star from "../images/star.png";

const Slider = () => {
    const [value, setValue] = useState(0)
    let constraintsRef = useRef();
    const handleRef= useRef();
    const progressBarRef = useRef();
    const handleSize = 120;

    const handleSlide = () => {
        let handleBounds = handleRef.current.getBoundingClientRect();
        let middleOfHandle = handleBounds.x + handleBounds.width / 2;
        let progressBarBounds  = progressBarRef.current.getBoundingClientRect();
        let newProgress = (middleOfHandle - progressBarBounds.x) / progressBarBounds.width;

        setValue(Math.round(newProgress * 100))
        // console.log("Position x-axis: " + Math.round(newProgress * 100))
    }

    return (
        <>
            <div className="">
                <div className="relative flex pt-28 flex-col items-center justify-center">
                    
                    {/* slider bar */}
                    <div 
                        className="absolute w-3/4 h-3 bg-sandwich rounded-full" 
                        ref ={progressBarRef}    
                    />

                    {/* slider star */}
                    <div className="w-10/12" ref={constraintsRef}>
                        <motion.div 
                            className="relative" 
                            ref={handleRef}
                            drag="x" 
                            dragMomentum={false} 
                            dragConstraints={constraintsRef}
                            dragElastic={0}
                            onDrag={handleSlide}
                            style={{
                                width: handleSize,
                                height: handleSize
                            }}
                        >
                            <img src={Star} />
                        </motion.div>
                    </div>
                    
                </div>
                <div className="flex pt-20 justify-center">
                    <h1 className="text-body">{value}</h1>
                </div>
            </div>
        </>
    )

}

export default Slider;