import "./App.css";
import { Routes, Route } from "react-router-dom";
import TeacherHome from "./pages/TeacherHome";
import StudentHome from "./pages/StudentHome";
import Home from "./pages/Home";
import SubEmotionDizzy from "./pages/student/SubEmotionDizzy"
import RegZone from "./pages/student/RegZone"
import GoalsNeeds from "./pages/student/GoalsNeeds"
import Summary from "./pages/student/Summary"
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

        {/* Student Routes */}
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/subemotiondizzy" element={<SubEmotionDizzy />} />
        <Route path="/regzone" element={<RegZone />} />
        <Route path="/goalsneeds" element={<GoalsNeeds />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </>
  );
}
