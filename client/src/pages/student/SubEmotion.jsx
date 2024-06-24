import withAuth from "../../hoc/withAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import ProgressBar from "../../components/ProgressBar";
import subEmotionInfo from "../../data/subEmotions";
import { useEffect } from "react";

const SubEmotion = () => {
  const navigate = useNavigate();
  const { updateUserDataAccumulated } = useUser();
  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";
  const previousPage = location.state?.previousPage

  useEffect(() => {
    if (!previousPage || previousPage !== "/student-home") {
      navigate("/student-home")
    }
  }, [])

  if (!emotionFromLocation) {
    // Handle the case when selectedEmotion is undefined
    return <div>Loading...</div>; // Or redirect to another page, or show an error message
  }

  const handleEmotionClick = (chosenEmotion) => {
    updateUserDataAccumulated({ emotion: chosenEmotion });
    navigate("/regzone", {
      state: {
        emotion: chosenEmotion,
        previousPage: "/emotion"
      },
    });
  };

  const changeEmotion = (newEmotion) => {
    navigate("/emotion", {
      state: {
        emotion: newEmotion,
        previousPage: "/emotion"
      },
    });
  }

  const selectedEmotion = subEmotionInfo.find(
    (emotion) => emotion.emotion === emotionFromLocation
  );
  const { wheelImg, subEmotions } = selectedEmotion;
  const angleBetweenButtons = (2 * Math.PI) / subEmotions.length;

  const matchedEmotions = subEmotionInfo.filter((emotion) => emotion !== selectedEmotion);

  return (
    <div className="flex flex-col items-center h-screen min-w-screen ">
      <div className="flex w-full justify-center mt-20">
        <ProgressBar totalPages="5" currentPage="2" />
      </div>
      <div className="font-header2 text-header2 text-center pt-8 ">
          <h2>Choose the emotion closest to</h2>
          <span>what you're feeling.</span>
        </div>
      <div className="flex flex-col text-center mt-10 h-full w-full items-center">
        
        <div className="relative font-header3 mt-5 md:text-header3 text-[1.1rem] ">
          <img
            src={wheelImg}
            alt="emotions wheel"
            className="w-[37rem] h-[35rem] object-fill"
          />
          <div className="absolute right-[12.5rem] -top-20 inset-0 flex flex-col items-center justify-center text-center text-body">
            {subEmotions.map((subEmotion, index) => {
              const angle = angleBetweenButtons * index;
              const radius = 13; // Adjust the radius as needed
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);

              return (
                <button
                  key={index}
                  onClick={() => handleEmotionClick(subEmotion)}
                  className="cursor-pointer hover:font-semibold w-1/2 py-7 "
                  style={{
                    position: "absolute",
                    left: `calc(50% + ${x}rem)`,
                    top: `calc(50% + ${y}rem)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                    {subEmotion}
                </button>
              );
            })}
          </div>
        </div>
        <div className="-mt-20 justify-center w-11/12 md:w-[750px]">
          <div className="flex justify-between">
            <button
              className="rounded-full w-24 h-24"
              onClick={() => changeEmotion(matchedEmotions[0].emotion)}
            >
              <img src={matchedEmotions[0].eImage} alt="" className="w-22 h-22 object-fill  " />
            </button>
            <button
              className="rounded-full w-24 h-24"
              onClick={() => changeEmotion(matchedEmotions[1].emotion)}
            >
              <img src={matchedEmotions[1].eImage} alt="" className="w-22 h-22 object-fill " />
            </button>
          </div>

          <div className="flex justify-around">
            <button
              className="rounded-full w-24 h-24"
              onClick={() => changeEmotion(matchedEmotions[2].emotion)}
            >
              <img src={matchedEmotions[2].eImage} alt="" className="w-22 h-22 object-fill " />
            </button>
            <button
              className="rounded-full w-24 h-24 "
              onClick={() => changeEmotion(matchedEmotions[3].emotion)}
            >
              <img src={matchedEmotions[3].eImage} alt="" className="w-22 h-22 object-fill " />
            </button>
          </div>

          <div className="-mt-12 flex justify-center">
            <button
              className="rounded-full w-24 h-24"
              onClick={() => changeEmotion(matchedEmotions[4].emotion)}
            >
              <img src={matchedEmotions[4].eImage} alt="" className="w-22 h-22 object-fill " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(['student'])(SubEmotion)
