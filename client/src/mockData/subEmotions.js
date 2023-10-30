import proudImg from '../images/proud.png'
import sadImg from '../images/sad.png'
import anxiousImg from '../images/anxiousNoBg.png';
import angryImg from '../images/angry.png';
import happyImg from '../images/happy.png';
import scaredImg from '../images/scared.png';
import proudWheel from "../images/proudWheel.png"
import angryWheel from "../images/angryWheel.png"
import anxiousWheel from "../images/orangewheel.png"
import happyWheel from "../images/happyWheel.png"
import sadWheel from "../images/sadWheel.png";
import scaredWheel from "../images/scaredWheel.png"

const subEmotionInfo = [
    {
        emotion: "Proud",
        eImage: proudImg,
        wheelImg: proudWheel,
        subEmotions: [
            "Glad",
            "Thrilled",
            "Confident",
            "Joyful",
            "Proud",
            "Excited"                
        ]
    },
    {
        emotion: "Sad",
        eImage: sadImg,
        wheelImg: sadWheel,
        subEmotions: [
            "Hurt",
            "Lonely",
            "Guilty",
            "Sad",
            "Disappointed",
            "Ashamed"                
        ]
    },
    {
        emotion: "Nervous",
        eImage: anxiousImg,
        wheelImg: anxiousWheel,
        subEmotions: [
            "Hurt",
            "Lonely",
            "Guilty",
            "Sad",
            "Disappointed",
            "Ashamed"                
        ]
    },
    {
        emotion: "Happy",
        eImage: happyImg,
        wheelImg: happyWheel,
        subEmotions: [
            "Hopeful",
            "Grateful",
            "Secure",
            "Thoughtful",
            "Peaceful",
            "Content"                
        ]
    },
    {
        emotion: "Scared",
        eImage: scaredImg,
        wheelImg: scaredWheel,
        subEmotions: [
            "Threatened",
            "Insecure",
            "Scared",
            "Rejected",
            "Intimidated",
            "Helpless"                
        ]
    },
    {
        emotion: "Angry",
        eImage: angryImg,
        wheelImg: angryWheel,
        subEmotions: [
            "Grumpy",
            "Disgusted",
            "Jealous",
            "Frustrated",
            "Annoyed",
            "Angry"                
        ]
    },
]

export default subEmotionInfo