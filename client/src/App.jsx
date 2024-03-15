import "./App.css";
import { Routes, Route } from "react-router-dom";
import TeacherHome from "./pages/teacher/TeacherHome";
import StudentHome from "./pages/StudentHome";
import Home from "./pages/Home";
import Insight from "./pages/student/Insight"
import RegZone from "./pages/student/RegZone"
import GoalsNeeds from "./pages/student/GoalsNeeds"
import Summary from "./pages/student/Summary"
import { Login, Signup } from "./pages/Authentication";
import AuthProvider from "./pages/Authentication/AuthContext";
import ClassList from "./pages/teacher/ViewClassList";
import NeedsGoals from "./pages/teacher/NeedsGoals";
import StudentProfile from "./pages/teacher/studentProfile/StudentProfile";
import SignupSuccess from "./pages/Authentication/SignupSuccess"
import { UserProvider } from "./context/UserContext";
import SubEmotion from "./pages/student/SubEmotion";
import EditTeacher from "./pages/teacher/EditTeacher";
import EditSeatingChart from "./pages/teacher/EditSeatingChart";
import CreateClass from "./pages/teacher/CreateClass";
import AddStudentToClassroom from "./pages/teacher/AddStudentToClassroom";
import FurnitureModal from "./components/SeatingChart/FurnitureModal";
import ViewClassroom from "./pages/teacher/ViewClassroom";

export default function App() {
  return (
    <main className="bg-notebookPaper scrollbar-wrapper h-full min-h-screen scrollhost">
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/success" element={<SignupSuccess />} />

            {/* Teacher Routes */}
            <Route path="/teacher-home" element={<TeacherHome />} />
            <Route path="/classroom/:teacherId/:classroomId" element={<ViewClassroom />} />
            <Route path="/edit-seating-chart/:teacherId/:classroomId" element={<EditSeatingChart />} />
            <Route path="/viewclasslist/:teacherId/:classroomId" element={<ClassList />} />
            <Route path="/editneedsgoals" element={<NeedsGoals />} />
            <Route path="/:teacherId/:classroomId/:studentId" element={<StudentProfile />} />
            <Route path="/edit/:teacherId" element={<EditTeacher />} />
            <Route path="/createclass" element={<CreateClass />} />
            <Route path="/addstudent/:teacherId/:classroomId" element={<AddStudentToClassroom />} />
            <Route path="/furnituremodal" element={<FurnitureModal />} />
            {/* Student Routes */}
            <Route path="/student-home" element={<StudentHome />} />
            <Route path="/emotion" element={<SubEmotion />} />
            <Route path="/insight" element={<Insight />} />
            <Route path="/regzone" element={<RegZone />} />
            <Route path="/goalsneeds" element={<GoalsNeeds />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </main>

  );
}
