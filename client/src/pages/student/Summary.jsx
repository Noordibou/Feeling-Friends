import React, {useEffect, useState, useContext} from "react";
import Avatar from "../../images/avatar.png";
import Anxious from "../../images/anxiousAvatar.png";
import { AuthContext } from "../Authentication/AuthContext"; 
import { getStudentById } from "../../api/studentsApi";
import { getUserById } from "../../api/userApi";

const Summary = () => {


  const auth = useContext(AuthContext); // Use useContext to access the AuthContext
  const objectID = auth.user ? auth.user._id : null;
  console.log("User's objectID:", JSON.stringify(objectID));

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [studentData, setStudentData] = useState(null);

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

if (loading) {
  return <div>Loading...</div>;
}


  return (
    <>
    <div className="pt-[12rem]">
<div className="flex items-center justify-center">
  <div><img src={Anxious} /></div><div><img src={Avatar} /></div>
</div>

<div className="w-9/12 text-center ml-auto mr-auto pt-[1.5rem]">
    <h1 className="font-header1 text-header1 leading-tight"> {studentData ? ("Thanks " + studentData.firstName) : "Thanks!"} - Have a good day at school!</h1>
</div>

<div className="bg-lightOrange w-11/12 pt-[1.5rem] rounded-[2rem] p-[2rem] mt-[4rem] ml-auto mr-auto">
    <h2 className="font-header2 text-header2 leading-tight">Coping skill of the day</h2>
    <span className="block font-body text-body leading-relaxed mt-[1rem]">Take 5 deep breaths- breathe in for 5, hold for 5 and breathe out for 10. Repeat.</span>
</div>

    </div>
    </>
  );
}

export default Summary;