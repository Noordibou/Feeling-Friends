// import React, {useEffect, useState} from "react";
// import { useNavigate, useLocation  } from "react-router-dom";
// import { useStudentCheckin } from "../../context/CheckInContext";
// import Avatar from "../../images/avatar.png";
// import Star from "../../images/star.png";

// const RegZone = () => {
//   const navigate = useNavigate();
//   const { studentCheckinData, updateFormState } = useStudentCheckin();
//   const [emotion, setEmotion] = useState("");
//   const location = useLocation();
//   const emotionFromLocation = location.state?.emotion || "";

//   const handleZoneClick = (zone) => {
//     updateFormState("ZOR", zone);
//     navigate("/goalsneeds");
//   };

//   useEffect(() => {
//     const emotionFromParams = location.state?.emotion;
//     if (emotionFromParams) {
//       setEmotion(emotionFromParams);
//     }
//   }, []);



//   const emotionsExplained = [
//     {
//       emotion: "Anxiety",
//       tips: [
//         "It helps alert us to danger.",
//         "Some times, their stories about danger are not based in reality!"
//       ]
//     },
//     {
//       emotion: "embarrased",
//       tips: [
//         "It makes us feel good and motivated.",
//         "It can be contagious, so spread it around!"
//       ]
//     },
//   ]

//   const getEmotionTips = () => {
//     const emotionObject = emotionsExplained.find((emotionObject) => emotionObject.emotion === emotion);
//     if (emotionObject) {
//       return emotionObject.tips;
//     } else {
//       return [];
//     }
//   };

//   useEffect(() => {

//   }, []);

//   return (
//     <>
//     <div className="bg-notebookPaper pt-[3.5rem]">
//       <div className="w-6/12 text-center ml-auto mr-auto"><h1 className="font-header1 text-header1 leading-tight">It’s normal to feel {emotionFromLocation}.</h1></div>
//       <div className="w-6/12 text-center ml-auto mr-auto pt-[1.5rem]"><h2 className="font-header2 text-header2 leading-tight">Getting to know our emotions can help!</h2></div>


//       <div className="bg-lightOrange w-11/12 pt-[1.5rem] rounded-[2rem] p-[2rem] mt-[4rem] ml-auto mr-auto flex items-center">
//         <div className="pl-[1rem]">
//           <h2 className="font-header2 text-header2 leading-tight">What is {emotionFromLocation}?</h2>
//         <ul className="font-body text-body leading-relaxed">
//         {/* {getEmotionTips().map((tip) => (
//           <li className="list-disc mt-[1rem]" key={tip}>
//             {tip}
//           </li>
//         ))} */}

//             <li className="list-disc mt-[1rem]">It helps alert us to danger.</li>
//             <li className="list-disc mt-[1rem]">Some times, their stories about danger are not based in reality!</li>
//         </ul>
//         </div>
//         <div className="mr-auto ml-auto">
//           <img src={Avatar} alt="avatar" className=" ml-auto mr-auto" />
//         </div>
//       </div>

//       <div className="w-7/12 text-center ml-auto mr-auto pt-[5rem]">
//       <h2 className="font-header2 text-header2 leading-tight">Check in with your body- what zone are you in? </h2>
//       <h2 className="font-header2 text-header2 leading-tight">Drag the slider to that zone.</h2>
//     </div>

//     <div className="absolute bottom-[7.5rem]">
//       <hr className="border-8 w-screen border-white"></hr>
//     </div>
//     <div className="absolute bottom-[4.5rem] left-[43%]">
//       <img src={Star} />
//       </div>

//     <div className="mt-[2rem] flex items-center">
//         <div className="bg-blue w-1/4 h-[20rem] rounded-tl-[2rem]" onClick={() => handleZoneClick("Low energy/Unmotivated")}>
//             <span className="block font-body text-white mt-[5rem] ml-[1.5rem]">Low energy</span>
//             <span className="block font-regZone text-regZone text-white  mt-[7rem] ml-[1.5rem]">Unmotivated</span></div>


//         <div className="bg-green w-1/4 h-[20rem]" onClick={() => handleZoneClick("Ready to learn/Wiggly")}><span className="block font-regZone text-regZone text-white mt-[13.4rem] ml-[1rem]">Ready to learn</span></div>

//         <div className="bg-yellow w-1/4 h-[20rem]"><span className="block font-regZone text-regZone text-white mt-[13.4rem] ml-[3.5rem]">Wiggly</span></div>

//         <div className="bg-orange w-1/4 h-[20rem] rounded-tr-[2rem]" onClick={() => handleZoneClick("High energy/Explosive")}>
//         <span className="block font-body text-white mt-[5rem] ml-[5rem]">High energy</span>
//         <span className="block font-regZone text-regZone text-white mt-[7rem] ml-[3.5rem]">Explosive</span></div>
//     </div>

//     </div>
//     </>
//   );
// }

// export default RegZone;

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStudentCheckin } from "../../context/CheckInContext";
import Avatar from "../../images/avatar.png";
import Star from "../../images/star.png";

const RegZone = () => {
  const navigate = useNavigate();
  const { studentCheckinData, updateFormState } = useStudentCheckin();
  const [emotion, setEmotion] = useState("");
  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";

  const handleZoneClick = (zone) => {
    updateFormState("ZOR", zone);
    navigate("/goalsneeds");
  };

  useEffect(() => {
    const emotionFromParams = location.state?.emotion;
    if (emotionFromParams) {
      setEmotion(emotionFromParams);
    }
  }, []);

  const emotionsExplained = [
    {
      emotion: "Embarrassed",
      tips: [
        "Feeling embarrassed is like when you blush or feel shy because you think others noticed something you did.",
        "It's okay to make mistakes, and feeling embarrassed can help you learn and grow.",
        "Share your feelings with someone you trust, and remember, everyone makes mistakes sometimes.",
      ],
    },
    {
      emotion: "Confused",
      tips: [
        "Feeling confused is like when you're trying to put together a big puzzle, and some pieces are missing.",
        "Ask questions, talk to someone you trust, and take your time. It's okay not to have all the answers right away; you're still learning!",
      ],
    },
    {
      emotion: "Pressured",
      tips: [
        "Feeling pressured is when you have a lot to do, and it feels like you're in a hurry.",
        "Remember, it's okay to take breaks and ask for help. You're doing your best, and it's okay to take things one step at a time.",
      ],
    },
    {
      emotion: "Overwhelmed",
      tips: [
        "Overwhelm is when you have so many things to do that it feels like a big wave crashing over you.",
        "Make a list of what you need to do, and start with one thing at a time. Don't be afraid to ask for help; you're not alone in this!",
      ],
    },
    {
      emotion: "Worried",
      tips: [
        "Worrying is when you think about things that might go wrong or make you feel sad.",
        "Share your worries with someone who cares about you. They can give you hugs and help you find ways to feel better.",
      ],
    },
    {
      emotion: "Anxious",
      tips: [
        "Anxiety is when you feel really, really worried and your tummy might feel funny.",
        "Take deep breaths and think about happy things. It's okay to feel anxious sometimes, and it will get better.",
      ],
    },
    {
      emotion: "Glad",
      tips: [
        "Feeling glad is like having a warm and happy feeling inside because something good happened.",
        "Celebrate and share your happiness with others. It's a wonderful feeling to spread!",
      ],
    },
    {
      emotion: "Thrilled",
      tips: [
        "Being thrilled is when you're super excited and happy about something amazing that happened.",
        "Jump for joy and share your excitement with friends and family. It's a fantastic feeling!",
      ],
    },
    {
      emotion: "Confident",
      tips: [
        "Feeling confident is when you believe in yourself and know that you can do things well.",
        "Keep practicing and trying new things to build your confidence even more. You're capable of great things!",
      ],
    },
    {
      emotion: "Joyful",
      tips: [
        "Joy is a big, happy feeling that makes your heart want to dance and sing.",
        "Spread joy by sharing laughter and smiles with others. It's like giving everyone a gift!",
      ],
    },
    {
      emotion: "Proud",
      tips: [
        "Feeling proud is when you're really happy and satisfied with something you accomplished.",
        "Tell someone you trust about what you did; they'll be proud of you too! Keep up the good work!",
      ],
    },
    {
      emotion: "Excited",
      tips: [
        "Being excited is when you can't wait for something fun or special that's about to happen.",
        "Count down the days and share your excitement with friends. The anticipation is part of the adventure!",
      ],
    },
    {
      emotion: "Hurt",
      tips: [
        "Feeling hurt is like having an ouchie on your heart because something or someone made you sad.",
        "It's okay to talk to someone you trust about your feelings, and they can help you feel better and give you hugs.",
      ],
    },
    {
      emotion: "Lonely",
      tips: [
        "Feeling lonely is when you wish you had someone to talk to or be with.",
        "Reach out to a friend or family member, or find something fun to do to help chase away the lonely feelings.",
      ],
    },
    {
      emotion: "Guilty",
      tips: [
        "Feeling guilty is when you think you did something wrong and it makes your heart feel heavy.",
        "Apologize if you need to, and try to make things right. Everyone makes mistakes sometimes.",
      ],
    },
    {
      emotion: "Sad",
      tips: [
        "Feeling sad is when you have big tears in your eyes and your heart feels heavy.",
        "It's okay to cry and share your feelings with someone who cares about you. They'll be there to give you comfort.",
      ],
    },
    {
      emotion: "Disappointed",
      tips: [
        "Feeling disappointed is like when you were hoping for something, but it didn't happen the way you wanted.",
        "Talk about your feelings with someone, and maybe you can find a new plan or something else to look forward to.",
      ],
    },
    {
      emotion: "Ashamed",
      tips: [
        "Feeling ashamed is when you're really embarrassed about something you did.",
        "Remember that making mistakes is part of growing up, and it's okay to learn from them and do better next time.",
      ],
    },
    {
      emotion: "Hopeful",
      tips: [
        "Feeling hopeful is like having a bright and happy feeling because you believe good things can happen.",
        "Share your hope and positivity with others; it's like giving them a little bit of sunshine!",
      ],
    },
    {
      emotion: "Grateful",
      tips: [
        "Feeling grateful is when you're really, really thankful for something or someone special in your life.",
        "Say 'thank you' and let the people you appreciate know how much they mean to you. It makes everyone feel warm and fuzzy inside.",
      ],
    },
    {
      emotion: "Secure",
      tips: [
        "Feeling secure is when you feel safe and protected, like being wrapped in a warm, cozy blanket.",
        "Enjoy the feeling of security and know that you are loved and cared for.",
      ],
    },
    {
      emotion: "Thoughtful",
      tips: [
        "Being thoughtful is when you take the time to think about how your actions might affect others.",
        "Spread kindness and thoughtfulness; it's like sprinkling happiness wherever you go.",
      ],
    },
    {
      emotion: "Peaceful",
      tips: [
        "Feeling peaceful is like having a calm and quiet mind, like a peaceful pond without ripples.",
        "Enjoy the serenity and take deep breaths to keep that peaceful feeling alive.",
      ],
    },
    {
      emotion: "Content",
      tips: [
        "Feeling content is when you're happy with what you have and not wanting more.",
        "Appreciate the simple joys in life and share your contentment with a smile.",
      ],
    },
    {
      emotion: "Threatened",
      tips: [
        "Feeling threatened is when you're scared because you think something or someone might hurt you.",
        "Talk to a trusted adult about your concerns and remember that they'll help protect you.",
      ],
    },
    {
      emotion: "Insecure",
      tips: [
        "Feeling insecure is when you doubt yourself and think you're not good enough.",
        "Remember that everyone has strengths and weaknesses, and it's okay to ask for help when you need it.",
      ],
    },
    {
      emotion: "Scared",
      tips: [
        "Feeling scared is when you're really afraid of something, like a big, spooky monster under the bed.",
        "Find comfort in a trusted adult's presence, and remember that many things that seem scary are not as frightening as they seem.",
      ],
    },
    {
      emotion: "Rejected",
      tips: [
        "Feeling rejected is like when you think others don't want to be friends or include you.",
        "Reach out to people who care about you and find ways to make new friends; you're a special person worthy of love and friendship.",
      ],
    },
    {
      emotion: "Intimidated",
      tips: [
        "Feeling intimidated is when someone or something makes you feel small or scared.",
        "Remember that you're strong and capable. Stand tall and face your fears; you've got this!",
      ],
    },
    {
      emotion: "Helpless",
      tips: [
        "Feeling helpless is like when you think you can't do anything to change a situation.",
        "Talk to someone you trust about what's going on, and together, you can find solutions and take action.",
      ],
    },
    {
      emotion: "Grumpy",
      tips: [
        "Feeling grumpy is when you're in a bad mood and might not want to smile or talk much.",
        "It's okay to have grumpy days; take some time to relax and do things that make you happy.",
      ],
    },
    {
      emotion: "Disgusted",
      tips: [
        "Feeling disgusted is when something makes you feel yucky or grossed out.",
        "Avoid things that make you feel disgusted and focus on the things that make you feel happy and comfortable.",
      ],
    },
    {
      emotion: "Jealous",
      tips: [
        "Feeling jealous is like when you wish you had something someone else has, like a cool toy or a special treat.",
        "Instead of feeling jealous, try being happy for them and think about the wonderful things you have in your life.",
      ],
    },
    {
      emotion: "Frustrated",
      tips: [
        "Feeling frustrated is when things aren't going your way, and it makes you feel a bit angry and stuck.",
        "Take a deep breath and try to find a solution or ask for help. Frustrations can turn into opportunities for problem-solving.",
      ],
    },
    {
      emotion: "Annoyed",
      tips: [
        "Feeling annoyed is like when something keeps bothering you, and you wish it would stop.",
        "Take a break and find a peaceful place to relax. Sometimes, a little quiet time can make the annoyances go away.",
      ],
    },
    {
      emotion: "Angry",
      tips: [
        "Feeling angry is when you're really, really mad about something, and you might want to stomp your feet or yell.",
        "It's okay to feel angry, but try to talk about your feelings instead of yelling. Take deep breaths to calm down and find ways to solve problems.",
      ],
    },
  ];

  const getEmotionTips = () => {
    const emotionObject = emotionsExplained.find(
      (emotionObject) => emotionObject.emotion.toLowerCase() === emotion.toLowerCase()
    );
    if (emotionObject) {
      return emotionObject.tips;
    } else {
      return [];
    }
  };

  return (
    <>
      <div className="bg-notebookPaper pt-[3.5rem] ">
        <div className="md:w-6/12 w-9/12 text-center ml-auto mr-auto">
          <h1 className="font-header1 md:text-header1 text-header2 leading-tight">
            It’s normal to feel {emotionFromLocation}.
          </h1>
        </div>
        <div className="w-6/12 text-center ml-auto mr-auto pt-[1rem]">
          <h2 className="font-header2 md:text-header2 text-header3 leading-tight">
            Getting to know our emotions can help!
          </h2>
        </div>

        <div className="bg-lightOrange w-11/12 pt-[1.5rem] rounded-[2rem] p-[2rem] mt-[4rem] ml-auto mr-auto flex items-center">
          <div className="pl-[1rem]">
            <h2 className="font-header2 md:text-header2 text-md leading-tight">
              What is {emotionFromLocation}?
            </h2>
            <ul className="font-body md:text-body text-sm leading-relaxed">
              {getEmotionTips().map((tip, index) => (
                <li className="list-disc mt-[1rem]" key={index}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="mr-auto ml-auto">
            <img src={Avatar} alt="avatar" className=" ml-auto mr-auto" />
          </div>
        </div>

        <div className="w-7/12 text-center ml-auto mr-auto md:pt-[5rem] py-[4rem] font-header2 md:text-header2 text-header3 leading-tight">
      <h2 >Check in with your body- what zone are you in? </h2>
      <h2 >Drag the slider to that zone.</h2>
    </div>

        <div className="relative  ">
    <div className="absolute bottom-[7.5rem]">
      <hr className="border-8 w-screen border-white"></hr>
    </div>
    <div className="absolute bottom-[4.5rem] left-[43%]">
      <img src={Star} />
      </div>

    <div className="mt-[2rem] flex items-center ">
        <div className="bg-blue w-1/4 h-[20rem] rounded-tl-[2rem]" onClick={() => handleZoneClick("Low energy/Unmotivated")}>
            <span className="block font-body text-white mt-[5rem] ml-[1.5rem]">Low energy</span>
            <span className="block font-regZone md:text-regZone text-sm text-white  mt-[8rem] ml-[1.5rem]">Unmotivated</span></div>

            
        <div className="bg-green w-1/4 h-[20rem]" onClick={() => handleZoneClick("Ready to learn/Wiggly")}><span className="block font-regZone md:text-regZone text-sm  text-white mt-[14.4rem] ml-[1rem]">Ready to learn</span></div>

        <div className="bg-yellow w-1/4 h-[20rem]"><span className="block font-regZone md:text-regZone text-sm text-white mt-[14.5rem] ml-[3.5rem]">Wiggly</span></div>

        <div className="bg-orange w-1/4 h-[20rem] rounded-tr-[2rem]" onClick={() => handleZoneClick("High energy/Explosive")}>
        <span className="block font-body text-white mt-[5rem] ml-[5rem]">High energy</span>
        <span className="block font-regZone md:text-regZone text-sm text-white md:mt-[9rem] mt-[7rem] ml-[3.5rem]">Explosive</span></div>
    </div>
</div>
    </div>
    </>
  );
}

export default RegZone;
