import React from 'react'
import RainbowBtn from '../components/BtnRainbow'

const TestPlayground = () => {

    return (
        <div className="flex flex-col h-screen w-screen justify-center items-center">
            <h1 className="text-center mb-20 text-[50px]">let's test this</h1>
            {/* normal size/large button */}
            <div className="w-[500px]">
                <RainbowBtn btnText="Continue" handleSave={console.log("ooo saved")} />
            </div>
            {/* smaller btn */}
            <div className="">
                <div className="h-full w-44">
                    <RainbowBtn btnText="Save" handleSave={console.log("click click nice")}/>
                </div>
            </div>
        </div>
    )
}

export default TestPlayground