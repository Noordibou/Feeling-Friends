import "./App.css";
import { Routes, Route } from "react-router-dom";
import TeacherHome from "./pages/TeacherHome";
import StudentHome from "./pages/StudentHome";
import Home from "./pages/Home";
import SubEmotionAnxious from "./pages/student/SubEmotionAnxious"
import SubEmotionAngry from "./pages/student/SubEmotionAngry"
import SubEmotionHappy from "./pages/student/SubEmotionHappy";
import SubEmotionProud from "./pages/student/SubEmotionProud";
import SubEmotionSad from "./pages/student/SubEmotionSad";
import SubEmotionScared from "./pages/student/SubEmotionScared";
import RegZone from "./pages/student/RegZone"
import GoalsNeeds from "./pages/student/GoalsNeeds"
import Summary from "./pages/student/Summary"
// import { Login, Signup } from "./pages/Authentication";
import AuthProvider from "./pages/Authentication/AuthContext";
import CheckInProvider from "./context/CheckInProvider";

export default function App() {
  return (
    <main className="bg-notebookPaper h-screen ">
    
      {/* <Toaster position="top-center" toastOptions={{duration: 2000}} /> */}
      
      <AuthProvider>
        <CheckInProvider>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/teacher-home" element={<TeacherHome />} />

        {/* Student Routes */}
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/subemotionanxious" element={<SubEmotionAnxious />} />
        <Route path="/subemotionangry" element={<SubEmotionAngry />} />
        <Route path="/subemotionhappy" element={<SubEmotionHappy />} />
        <Route path="/subemotionproud" element={<SubEmotionProud />} />
        <Route path="/subemotionsad" element={<SubEmotionSad />} />
        <Route path="/subemotionscared" element={<SubEmotionScared />} />
        <Route path="/regzone" element={<RegZone />} />
        <Route path="/goalsneeds" element={<GoalsNeeds />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
      </CheckInProvider>
      </AuthProvider>
    
    </main>
  );
}
