import React from "react"
import {useState} from "react"

export default function Register() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  })
  const registerUser = (e) => {
    e.preventDefault();
    console.log("registering user...");
  }

  return (
    <div>
      <form onSubmit={registerUser}>
        <label>Username:</label>
        <input type="text" placeholder="enter name..." value={data.username} onChange={(e) => setData({...data, username: e.target.value})}/>
        <label>Email:</label>
        <input type="email" placeholder="enter email..." value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
        <label>Password:</label>
        <input type="password" placeholder="enter password..." value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
        <button type="submit"> Submit </button>
      </form>
    </div>
  );
}
