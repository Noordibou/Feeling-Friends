import React, { useRef, useState, useEffect } from 'react';
import question_crab from "../images/question_crab.png"
import question_dog from "../images/question_dog.png"
import question_mouse from "../images/question_mouse.png"
import question_dino from "../images/question_dino.png"
import question_rabbit from "../images/question_rabbit.png"
import question_frog from "../images/Question_Frog.png"
import coping_crab from "../images/copingSkill/crab_coping_skill_card.png"
import coping_dino from "../images/copingSkill/dino_coping_skill_card.png"
import coping_dog from "../images/copingSkill/dog_coping_skill_card.png"
import coping_frog from "../images/copingSkill/frog_coping_skill_card.png"
import coping_mouse from "../images/copingSkill/mouse_coping_skill_card.png"
import coping_rabbit from "../images/copingSkill/rabbit_coping_skill_card.png"
import subEmotionInfo from '../data/subEmotions';

const CopingSkillCard = ({emotion, emotionColor}) => {

    const [mainEmotion, setMainEmotion] = useState("")
    const [copingText, setCopingText] = useState("")

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
    }
      const avatarImageName = emotionAvatar[mainEmotion] || "";
      const copingSkillCard = copingSkills[mainEmotion] || "";

      const findMainEmotion = (subEmotion) => {
        console.log("sadf")
        // Iterate through the subEmotionInfo array
        for (const emotionInfo of subEmotionInfo) {
          // Check if the subEmotion exists in the subEmotions array
          if (emotionInfo.subEmotions.includes(subEmotion.charAt(0).toUpperCase() + subEmotion.slice(1))) {
            setCopingText(emotionInfo.advice)
            return emotionInfo.emotion.toLowerCase();
          }
        }
        // Return null if subEmotion is not found
        return null;
      };

      useEffect(() => {
        const temp = findMainEmotion(emotion)
        console.log("temp" + temp)
        setMainEmotion(temp)  
      }, [])

    return (
        <div>
            <div
          className={`bg-${emotionColor} w-full h-8/12 rounded-[2rem] p-[2rem] flex flex-col
             rounded-b`}
        >
          {/* Learn more */}
          <section className="flex flex-row justify-around mt-2">
            <div className="w-8/12">
              <h2 className="text-[1.75rem] font-semibold font-karla">
                Getting to know our emotions can help with school success
              </h2>
              <h2
                className="underline text-header2 font-karla font-body font-semibold mt-7"
                onClick={() => {
                    console.log("Bottom Content Ref:", bottomContentRef.current);
                  if (bottomContentRef.current) {
                    window.scrollTo({
                      top: bottomContentRef.current.offsetTop,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                Learn more
              </h2>
            </div>
            <div className="">
                <img src={avatarImageName} alt="wondering avatar" className="h-25 w-25"/>
            </div>
          </section>

          {/* Coping Skills Section */}
          <section className="mb-24 mt-14" ref={bottomContentRef}>


            <h3 className="text-[1.75rem] font-semibold font-karla w-2/3 mb-5 ml-3">{copingText}</h3>
            <div className="w-full flex justify-center">
                <img src={copingSkillCard} alt="coping skill explained"/>
            </div>

          </section>         
        </div>
            
        </div>
    )
  }

export default CopingSkillCard;