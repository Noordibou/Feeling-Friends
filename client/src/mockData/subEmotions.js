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
        subEmotions: [
            "Confident",
            "Ambitious",
            "Determined",
            "Proud",
            "Secure",
            "Excited"                
        ]
    },
    {
        emotion: "Sad",
        eImage: sadImg,
        wheelImg: sadWheel,
        subEmotions: [
            "Guilty",
            "Sad",
            "Disappointed",
            "Ashamed",
            "Hurt",
            "Lonely"                
        ]
    },
    {
        emotion: "Nervous",
        eImage: anxiousImg,
        wheelImg: anxiousWheel,
        subEmotions: [
            "Pressured",
            "Overwhelmed",
            "Worried",
            "Anxious",
            "Confused",
            "Embarrassed"                
        ]
    },
    {
        emotion: "Happy",
        eImage: happyImg,
        wheelImg: happyWheel,
        subEmotions: [
            "Glad",
            "Thoughtful",
            "Peaceful",
            "Content",
            "Hopeful",
            "Grateful"                
        ]
    },
    {
        emotion: "Scared",
        eImage: scaredImg,
        wheelImg: scaredWheel,
        subEmotions: [
            "Scared",
            "Rejected",
            "Intimidated",
            "Helpless",
            "Threatened",
            "Insecure"                
        ]
    },
    {
        emotion: "Angry",
        eImage: angryImg,
        wheelImg: angryWheel,
        subEmotions: [
            "Jealous",
            "Frustrated",
            "Annoyed",
            "Angry",
            "Grumpy",
            "Disgusted"                
        ]
    },
]

export default subEmotionInfo