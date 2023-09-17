import "./App.css";
import { Routes, Route } from "react-router-dom";
import TeacherHome from "./pages/TeacherHome";
import StudentHome from "./pages/StudentHome";
import Home from "./pages/Home";
import { Login, Signup } from "./pages";


export default function App() {
  return (
    <>
      {/* <Toaster position="top-center" toastOptions={{duration: 2000}} /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> */}
        <Route path="/teacher-home" element={<TeacherHome />} />
        <Route path="/student-home" element={<StudentHome />} />
      </Routes>
    </>
  );
}
