import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TeacherHome from "./pages/TeacherHome";
import StudentHome from "./pages/StudentHome";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher-home" element={<TeacherHome />} />
        <Route path="/student-home" element={<StudentHome />} />
      </Routes>
  );
}
