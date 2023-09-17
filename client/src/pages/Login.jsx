import { useState } from "react";

// import axios from "axios";

// import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useSatae({
    email: "",
    password: "",
  });
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // let navigate = useNavigate();

  // const onLogin = async () => {
  //   const credentials = {
  //     email,
  //     password,
  //   };

  //   await axios
  //     .post("http://localhost:3000/api/user/login", credentials)
  //     .then((response) => {
  //       if (response.data.accountType === "teacher") {
  //         navigate("/teacher-home");
  //       } else if (response.data.accountType === "student") {
  //         navigate("/student-home");
  //       }
  //     })
  //     .catch((error) => {
  //       alert(error.response.data.message);
  //     });
  // };

  const loginUser = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={loginUser}>
        <label>Email:</label>
        <input type="email" placeholder="enter email..." value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
        <label>Password:</label>
        <input type="password" placeholder="enter password..." value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
        <button type="submit"> Login </button>
      </form>
    </div>
  );
};

export default Login;
