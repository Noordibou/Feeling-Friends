import { useRef, useState } from 'react';
import { motion } from 'framer-motion'

const Slider = () => {
    const [value, setValue] = useState(0)
    let constraintsRef = useRef();
    const handleRef= useRef();
    const progressBarRef = useRef();
    const handleSize = 30;

    const handleDrag = () => {
        let max = 100;
        let min = 0;
        let handleBounds = handleRef.current.getBoundingClientRect();
        let middleOfHandle = handleBounds.x + handleBounds.width / 2;
        let progressBarBounds  = progressBarRef.current.getBoundingClientRect();
        let newProgress = (middleOfHandle - progressBarBounds.x) / progressBarBounds.width;
        // console.log("Position x-axis: " + Math.round(newProgress * 100))
    }

    return (
        <>
            <div className="">
                <div className="relative flex pt-28 flex-col items-center justify-center">
                    
                    {/* slider bar */}
                    <div 
                        className="absolute w-3/4 h-3 bg-lightGray rounded-full" 
                        ref ={progressBarRef}    
                    />

                    {/* for slider progress */}
                    <div 
                        className="absolute flex w-3/4 h-1 bg-darkTeal items-center" 
                    />

                    {/* slider star */}
                    <div className="w-3/4" ref={constraintsRef}>
                        <motion.div 
                            className="relative w-10 h-10 bg-green rounded-full bg-opacity-70" 
                            ref={handleRef}
                            drag="x" 
                            dragMomentum={false} 
                            dragConstraints={constraintsRef}
                            dragElastic={0}
                            onDrag={handleDrag}
                            style={{
                                width: handleSize,
                                height: handleSize
                            }}
                        />
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