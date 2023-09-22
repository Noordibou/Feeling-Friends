import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "https://mindful-journal-server.vercel.app/",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };
  return (
    <>
    <div className="flex w-screen items-center justify-center">
      <div className="home_page">
        <h4>
          {" "}
          Welcome <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />
      </div>
      
    </>
  );
};

export default Home;



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { createTeacher } from '../api/teachersApi';

// const Home = () => {
//   const navigate = useNavigate();
//   const [teacher, setTeacher] = useState({
//     first_name: "",
//     last_name: "",
//     classrooms: [],
//   });

//   const handleChange = (event) => {
//     setTeacher({
//       ...teacher,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const createdTeacher = await createTeacher(teacher);

//       // Redirect to the teacher profile page
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <form className="flex flex-col" onSubmit={handleSubmit}>
//       <input
//         className="my-3"
//         type="text"
//         name="first_name"
//         value={teacher.first_name}
//         onChange={handleChange}
//       />
//       <input
//         className="my-3"
//         type="text"
//         name="last_name"
//         value={teacher.last_name}
//         onChange={handleChange}
//       />
//       <button className="bg-blue px-5" type="submit">Create Teacher</button>
//     </form>
//   );
// };

// export default Home;

