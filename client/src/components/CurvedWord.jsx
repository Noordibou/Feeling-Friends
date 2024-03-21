import { useEffect, useState } from "react";

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