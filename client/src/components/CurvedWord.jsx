import { useEffect, useState } from "react";


const CurvedWords = ({emotion, image, rotationList, translateList, handleEmotion}) => {

  const emotionArray = emotion.split("")

  return (
    <>
       <button className="rounded-full w-32 h-32" onClick={() => handleEmotion(emotion)}>
        <img src={image} alt="Angry Emoji" />
        <div className="flex flex-row justify-center">
          {rotationList.map((rotation, index) => (
            <h3 key={index} className={`${rotation} ${translateList[index]} text-[1.8rem] font-header2 tracking-[0.2rem]`}>
              {emotionArray[index]}
            </h3>
          ))}
        </div>
      </button>
    </>
  );
};

export default CurvedWords;