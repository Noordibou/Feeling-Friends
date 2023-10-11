import { useRef, useState } from 'react';
import { motion } from 'framer-motion'

const Slider = () => {
    const [value, setValue] = useState(0)
    let constraintsRef = useRef();

    const handleDrag = () => {

    }

    return (
        <>
            <div className="">
                <div className="relative flex pt-28 flex-col items-center justify-center">
                    <div className="absolute w-3/4 h-2 bg-lightGray rounded-full" />
                    <div className="w-3/4" ref={constraintsRef}>
                        <motion.div 
                            className="relative w-6 h-6 bg-green rounded-full" 
                            drag="x" 
                            dragMomentum={false} 
                            dragConstraints={constraintsRef}
                            dragElastic={0}
                            onDrag={handleDrag}
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