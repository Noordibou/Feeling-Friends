import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import ProgressBar from "../../components/ProgressBar";
import subEmotionInfo from "../../data/subEmotions";

const SubEmotion = () => {
  const navigate = useNavigate();
  const { updateUserDataAccumulated } = useUser();
  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";

  const handleEmotionClick = (chosenEmotion) => {
    updateUserDataAccumulated({ emotion: chosenEmotion });
    navigate("/insight", {
      state: {
        emotion: chosenEmotion,
      },
    });
  };

  const changeEmotion = (newEmotion) => {
    navigate("/emotion", {
      state: {
        emotion: newEmotion,
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
        <ProgressBar totalPages="6" currentPage="2" />
      </div>
      <div className="flex flex-col text-center h-full mt justify-center w-full items-center">
        <div className="font-header2 text-header2 z-10">
          <h2>Choose the emotion closest to</h2>
          <span>what you're feeling.</span>
        </div>
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
                  {/* TODO: Need to make clickable area into a triangle, so that user can click on the section and it will redirect */}
                  {/* <div className="bg-pink"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "20px solid transparent", // Adjust the size of the triangle
                    borderRight: "20px solid transparent", // Adjust the size of the triangle
                    borderBottom: "30px solid #000", // Adjust the color of the triangle
                    textAlign: "center", // Center the text horizontally within the triangle
                    lineHeight: "20px", // Center the text vertically within the triangle
                  }}
                  > */}
                    {subEmotion}
                  {/* </div> */}
                </button>
              );
            })}
          </div>
        </div>
        <div className="z-10 -mt-20 justify-center w-11/12">
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

export default SubEmotion;
