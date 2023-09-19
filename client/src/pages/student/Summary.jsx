import React, {useEffect, useState, useContext} from "react";
import Avatar from "../../images/avatar.png";
import SummaryPerson from "../../images/SummaryPerson.png";
import Anxious from "../../images/anxiousAvatar.png";
import { AuthContext } from "../Authentication/AuthContext"; 
import { getStudentById } from "../../api/studentsApi";
import { getUserById } from "../../api/userApi";
import emotionsExplained from '../../mockData/emotionData.js'
import { useStudentCheckin } from "../../context/CheckInContext";
import { useLocation } from "react-router-dom";
import QuestionFrog from '../../images/Question frog.png'

const Summary = () => {


  const auth = useContext(AuthContext); // Use useContext to access the AuthContext
  const objectID = auth.user ? auth.user._id : null;
  console.log("User's objectID:", JSON.stringify(objectID));

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [emotion, setEmotion] = useState("");
  const { studentCheckinData, updateFormState } = useStudentCheckin();
  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";

  useEffect(() => {

    getUserById(objectID)
      .then((user) => {
        // Set the user data in state
        getStudentById(user.student).then((student) => {
          setStudentData(student);
          setUserData(user);
          setLoading(false); // Set loading to false when data is available
        });
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
        setLoading(false); // Set loading to false in case of an error
      });

  
}, [objectID]);

useEffect(() => {
  console.log("Location state:", location.state);
console.log("Emotion from location:", location.state?.emotion);
  const emotionFromParams = location.state?.emotion;
  if (emotionFromParams) {
    setEmotion(emotionFromParams);
  }
  console.log("Emotion:", emotion);
}, [location.state?.emotion]);


if (loading) {
  return <div>Loading...</div>;
}


const getEmotionTips = () => {
  const emotionObject = emotionsExplained.find(
    (emotionObject) => emotionObject.emotion === emotionFromLocation
  );
  if (emotionObject) {
    console.log("emotion object: " + JSON.stringify(emotionObject))
    return emotionObject.tips;
  } else {
    return [];
  }
};


  return (
    <>
    <div className="pt-[12rem] ">
<div className="flex items-center justify-center">
  <img src={SummaryPerson} alt="SummaryPerson" className="h-42"/>
</div>

<div className="w-9/12 text-center ml-auto mr-auto pt-[1.5rem]">
    <h1 className="font-header1 text-header1 leading-tight"> {studentData ? ("Thanks " + studentData.firstName) : "Thanks!"} - Have a good day at school!</h1>
</div>

<div className=" bg-lightOrange w-full pt-[1.5rem] rounded-[2rem] p-[2rem] mt-[4rem] ml-auto mr-auto flex items-center fixed
             inset-x-0 bottom-0 rounded-b">
          <div className="pl-[1rem]">
            <h2 className="font-header2 md:text-header2 text-md leading-tight">
              Being {emotionFromLocation} seems scary, but what is it really?
            </h2>
            <ul className="font-body leading-relaxed w-10/12">
              {getEmotionTips().map((tip, index) => (
                <li className="list-disc text-sm mt-[1rem]" key={index}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="mr-auto ml-auto ">
            <img src={QuestionFrog} alt="Avatar" className=" ml-auto mr-auto" />
          </div>
        </div>

    </div>
    
    </>
  );
}

export default Summary;