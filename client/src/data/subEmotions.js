import proudImg from '../images/proud.png'
import sadImg from '../images/sad.png'
import anxiousImg from '../images/anxious.png';
import angryImg from '../images/angry.png';
import happyImg from '../images/happy.png';
import scaredImg from '../images/scared.png';
// wheels
import proudWheel from "../images/ProudRabbitAndWheel.png"
import angryWheel from "../images/AngryCrabAndWheel.png"
import anxiousWheel from "../images/NervousFrogAndWheel.png"
import happyWheel from "../images/HappyLambAndWheel.png"
import sadWheel from "../images/SadMouseAndWheel.png";
import scaredWheel from "../images/ScaredLizardAndWheel.png"

const subEmotionInfo = [
    {
        emotion: "Proud",
        eImage: proudImg,
        wheelImg: proudWheel,
        advice: "It's easier to feel happy when we reflect on good things in our life.",
        subEmotions: [
            "Confident",
            "Ambitious",
            "Determined",
            "Proud",
            "Secure",
            "Excited"                
        ],
        rotationList: [
            "rotate-[18deg]",
            "rotate-[8deg]",
            "rotate-[0deg]",
            "-rotate-[8deg]",
            "-rotate-[18deg]",
        ],
        translateList: [
            "-translate-y-[0.5rem]",
            "-translate-y-[0.2rem]",
            "-translate-y-[0.1rem]",
            "-translate-y-[0.2rem]",
            "-translate-y-[0.5rem]",
        ]
    },
    {
        emotion: "Nervous",
        eImage: anxiousImg,
        wheelImg: anxiousWheel,
        advice: "It's normal to feel anxious. Try this activity to help!",
        subEmotions: [
            "Pressured",
            "Overwhelmed",
            "Worried",
            "Anxious",
            "Confused",
            "Embarrassed"                
        ],
        rotationList: [
            "rotate-[28deg]",
            "rotate-[18deg]",
            "rotate-[8deg]",
            "rotate-[0deg]",
            "-rotate-[8deg]",
            "-rotate-[18deg]",
            "-rotate-[28deg]"
        ],
        translateList: [
            "-translate-y-[1.1rem]",
            "-translate-y-[0.5rem]",
            "-translate-y-[0.2rem]",
            "-translate-y-[0.1rem]",
            "-translate-y-[0.2rem]",
            "-translate-y-[0.5rem]",
            "-translate-y-[1.1rem]",
        ]
    },
    {
        emotion: "Sad",
        eImage: sadImg,
        wheelImg: sadWheel,
        advice: "Everyone feels sad sometimes! How can we deal with those feelings?",
        subEmotions: [
            "Guilty",
            "Sad",
            "Disappointed",
            "Ashamed",
            "Hurt",
            "Lonely"                
        ],
        rotationList: [
            "rotate-[8deg]",
            "rotate-[0deg]",
            "-rotate-[8deg]"
        ],
        translateList: [
            "-translate-y-[0.2rem]",
            "-translate-y-[0.1rem]",
            "-translate-y-[0.2rem]",
        ]
    },
    {
        emotion: "Happy",
        eImage: happyImg,
        wheelImg: happyWheel,
        advice: "When our body feels good, it can help our brain to feel good, too.",
        subEmotions: [
            "Glad",
            "Thoughtful",
            "Peaceful",
            "Content",
            "Hopeful",
            "Grateful"                
        ],
        rotationList: [
            "rotate-[18deg]",
            "rotate-[8deg]",
            "rotate-[0deg]",
            "-rotate-[8deg]",
            "-rotate-[18deg]",
        ],
        translateList: [
            "-translate-y-[0.5rem]",
            "-translate-y-[0.2rem]",
            "translate-y-[0rem]",
            "-translate-y-[0.2rem]",
            "-translate-y-[0.5rem]",
        ]
    },
    {
        emotion: "Scared",
        eImage: scaredImg,
        wheelImg: scaredWheel,
        advice: "Feeling scared is never fun, but there are ways we can make it feel better!",
        subEmotions: [
            "Scared",
            "Rejected",
            "Intimidated",
            "Helpless",
            "Threatened",
            "Insecure"                
        ],
        rotationList: [
            "rotate-[28deg]",
            "rotate-[18deg]",
            "rotate-[8deg]",
            "rotate-[0deg]",
            "-rotate-[8deg]",
            "-rotate-[18deg]",
            "-rotate-[28deg]"
        ],
        translateList: [
            "-translate-y-[0.5rem]",
            "-translate-y-[0.2rem]",
            "translate-y-[0rem]",
            "translate-y-[0rem]",
            "-translate-y-[0.2rem]",
            "-translate-y-[0.5rem]",
        ]

    },
    {
        emotion: "Angry",
        eImage: angryImg,
        wheelImg: angryWheel,
        advice: "Everyone feels angry sometimes. Try this to calm down.",
        subEmotions: [
            "Jealous",
            "Frustrated",
            "Annoyed",
            "Angry",
            "Grumpy",
            "Disgusted"                
        ],
        rotationList: [
            "rotate-[18deg]",
            "rotate-[8deg]",
            "rotate-[0deg]",
            "-rotate-[8deg]",
            "-rotate-[18deg]",
        ],
        translateList: [
            "-translate-y-[0.5rem]",
            "-translate-y-[0.2rem]",
            "translate-y-[0rem]",
            "-translate-y-[0.2rem]",
            "-translate-y-[0.5rem]",
        ]
    },
]

export default subEmotionInfo