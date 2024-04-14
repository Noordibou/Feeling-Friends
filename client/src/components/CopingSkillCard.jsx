import React, { useRef, useState, useEffect } from "react";
import question_crab from "../images/question_crab.png";
import question_dog from "../images/question_dog.png";
import question_mouse from "../images/question_mouse.png";
import question_dino from "../images/question_dino.png";
import question_rabbit from "../images/question_rabbit.png";
import question_frog from "../images/Question_Frog.png";
import coping_crab from "../images/copingSkill/crab_coping_skill_card.png";
import coping_dino from "../images/copingSkill/dino_coping_skill_card.png";
import coping_dog from "../images/copingSkill/dog_coping_skill_card.png";
import coping_frog from "../images/copingSkill/frog_coping_skill_card.png";
import coping_mouse from "../images/copingSkill/mouse_coping_skill_card.png";
import coping_rabbit from "../images/copingSkill/rabbit_coping_skill_card.png";
import downArrow from "../images/down_arrow.png";
import subEmotionInfo from "../data/subEmotions";

const CopingSkillCard = ({ emotion, emotionColor }) => {
  const [mainEmotion, setMainEmotion] = useState("");
  const [copingText, setCopingText] = useState("");

  const bottomContentRef = useRef();

  const emotionAvatar = {
    angry: question_crab,
    happy: question_dog,
    sad: question_mouse,
    scared: question_dino,
    proud: question_rabbit,
    nervous: question_frog,
  };

  const copingSkills = {
    angry: coping_crab,
    happy: coping_dog,
    sad: coping_mouse,
    scared: coping_dino,
    proud: coping_rabbit,
    nervous: coping_frog,
  };
  const avatarImageName = emotionAvatar[mainEmotion] || "";
  const copingSkillCard = copingSkills[mainEmotion] || "";

  const findMainEmotion = (subEmotion) => {
    
    for (const emotionInfo of subEmotionInfo) {
      if (
        emotionInfo.subEmotions.includes(
          subEmotion.charAt(0).toUpperCase() + subEmotion.slice(1)
        )
      ) {
        setCopingText(emotionInfo.advice);
        return emotionInfo.emotion.toLowerCase();
      }
    }
    return null;
  };

  useEffect(() => {
    setMainEmotion(findMainEmotion(emotion));
  }, []);

  return (
    <div
      className={`bg-${emotionColor} w-full h-8/12 rounded-[2rem] p-[1.5rem] flex flex-col
             rounded-b justify-center items-center`}
    >
      <div className="max-w-[700px]">
        {/* Learn more */}
        <section className="flex flex-row justify-around mt-2">
          <div className="w-8/12">
            <h2 className="text-[1.75rem] font-semibold font-karla">
              Getting to know our emotions can help with school success
            </h2>
            <button
              className="flex flex-row"
              onClick={() => {
                if (bottomContentRef.current) {
                  window.scrollTo({
                    top: bottomContentRef.current.offsetTop,
                    behavior: "smooth",
                  });
                }
              }}
            >
              <h2 className="text-header2 font-karla font-body font-semibold mt-7">
                Learn more
              </h2>
              <img src={downArrow} className="flex self-end h-6 pl-10 mb-2" alt="learn more arrow"/>
            </button>
          </div>
          <div className="">
            <img
              src={avatarImageName}
              alt="wondering avatar"
              className="h-60 -mr-10"
            />
          </div>
        </section>

        {/* Coping Skills Section */}
        <section
          className="flex flex-col mb-24 mt-28 w-full justify-center  items-center"
          ref={bottomContentRef}
        >
          <div className="flex flex-col justify-center items-center max-w-[580px]">
            <h3 className="text-[1.75rem] font-semibold font-karla mb-5 self-start w-9/12 -ml-10">
              {copingText}
            </h3>

            <img
              className="min-w-[700px]"
              src={copingSkillCard}
              alt="coping skill explained"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default CopingSkillCard;
