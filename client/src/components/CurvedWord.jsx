import { useEffect, useState } from "react";

  // TODO: 
  // can start degree at 18 and keep doing -8 each time
  // // if any different, provide an array of values
  
  // TODO:
  // but for translate, might need to have an array of set values, 
  // // 0.5, 0.2 0.1
  // // if any different, provide an array

const CurvedWords = ({emotion, image, rotationList, translateList, handleEmotion}) => {

  const emotionArray = emotion.split("")

  return (
    <>
       <button className="rounded-full w-32 h-32" onClick={() => handleEmotion(emotion)}>
        <img src={image} alt={`${emotion} Emoji`} />
        <div className="flex flex-row justify-center">
          {emotionArray.map((emotionLetter, index) => (
            <h3 key={index} className={`${rotationList[index]} ${translateList[index]} text-[1.8rem] font-header2 tracking-[0.2rem]`}>
              {emotionLetter}
            </h3>
          ))}
        </div>
      </button>
    </>
  );
};

export default CurvedWords;