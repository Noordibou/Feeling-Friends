import React, { useEffect, useState } from "react";
import {
  proudZorImages,
  angryZorImages,
  sadZorImages,
  nervousZorImages,
  scaredZorImages,
  happyZorImages,
  girlZorImages
} from "../data/zorImages";
import subEmotionInfo from "../data/subEmotions";

const ZorImageRender = ({ sliderValue, chosenSubEmotion }) => {
  const [mainEmotion, setMainEmotion] = useState("");
  const [zone, setZone] = useState("");

  const findMainEmotion = (subEmotion) => {
    for (const emotionInfo of subEmotionInfo) {
      if (
        emotionInfo.subEmotions.includes(
          subEmotion.charAt(0).toUpperCase() + subEmotion.slice(1)
        )
      ) {
        return emotionInfo.emotion.toLowerCase();
      }
    }
    return null;
  };

  useEffect(() => {
    setMainEmotion(findMainEmotion(chosenSubEmotion));
  });

  const getZone = (sliderValue) => {
    if (sliderValue <= 23) {
      return "Unmotivated";
    } else if (sliderValue <= 50) {
      return "readytolearn";
    } else if (sliderValue <= 77) {
      return "Wiggly";
    } else {
      return "Explosive";
    }
  };

  useEffect(() => {
    const newZone = getZone(sliderValue);
    setZone(newZone);
  }, [sliderValue]);

  const getImage = (mainEmotion, zone) => {
    switch (mainEmotion) {
      case "happy":
        return happyZorImages.find((image) => image.includes(zone.toLowerCase()));
      case "angry":
        return angryZorImages.find((image) => image.includes(zone.toLowerCase()));
      case "sad":
        return sadZorImages.find((image) => image.includes(zone.toLowerCase()));
      case "nervous":
        return nervousZorImages.find((image) => image.includes(zone.toLowerCase()));
      case "scared":
        return scaredZorImages.find((image) => image.includes(zone.toLowerCase()));
      case "proud":
        return proudZorImages.find((image) => image.includes(zone.toLowerCase()));
      case "girl":
        return girlZorImages.find((image) => image.includes(zone.toLowerCase()));
      default:
        return null;
    }
  };

  const emotionImagePath = getImage(mainEmotion, zone);
  const girlImage = getImage("girl", zone);

  return (
    <div className="w-full h-full flex items-center">
      <div className="flex flex-row max-w-[750px] justify-center w-full ">
        <div className="flex flex-col justify-between sm:justify-around sm:flex-row sm:w-[50%]">
          <h6 className="text-[15px] sm:h-[250px] self-start sm:text-[1.5rem] xl:text-lg font-normal w-[60%]">
            I'm feeling {zone === "readytolearn" ? "ready to learn" : zone} !
          </h6>
          {girlImage && (
            <img
              src={girlImage}
              alt="Girl Zor Image"
              className="h-40 sm:h-52 xl:h-58 mt-5 sm:mt-0 self-end mx-3"
            />
          )}
        </div>
        <div className="flex flex-col-reverse justify-between sm:justify-around sm:flex-row sm:w-[50%] sm:px-10 ">
          {emotionImagePath && (
            <img
              src={emotionImagePath}
              alt="Emotion Image"
              className="h-28 sm:h-36 xl:h-40 self-end mx-3"
            />
          )}
          <h6 className="text-[15px] self-end sm:self-baseline sm:text-[1.5rem] xl:text-lg font-normal ">
            Me too!
          </h6>
        </div>
      </div>
    </div>
  );
};

export default ZorImageRender;
