import { useRef, useState } from 'react';
import { motion } from 'framer-motion'
import Star from "../images/star.png";

const Slider = ({ updateSliderValue }) => {
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
        updateSliderValue(Math.round(newProgress * 100))
        // console.log("Position x-axis: " + Math.round(newProgress * 100))
    }

    return (
        <>
            <div className="">
                <div className="relative flex pt-32 flex-col items-center justify-center">
                    
                    {/* slider bar */}
                    <div 
                        className="absolute w-11/12 h-3 bg-sandwich rounded-full" 
                        ref ={progressBarRef}    
                    />

                    {/* slider star */}
                    <div className="w-full" ref={constraintsRef}>
                        <motion.img 
                            className="relative" 
                            ref={handleRef}
                            src={Star}
                            drag="x" 
                            dragMomentum={false} 
                            dragConstraints={constraintsRef}
                            dragElastic={0}
                            onDrag={handleSlide}
                            style={{
                                width: handleSize,
                                height: handleSize
                            }}
                        />
                    </div>
                    
                </div>
                {/* <div className="flex pt-10 justify-center">
                    <h1 className="text-body">{value}</h1>
                </div> */}
            </div>
        </>
    )

}

export default Slider;