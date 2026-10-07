import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import CourseDetail from "./pages/CourseDetail";
import CourseForm from "./pages/CourseForm";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";

export default function App() {
  return <BrowserRouter><Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="courses" element={<Courses />} /><Route path="courses/:id" element={<CourseDetail />} /><Route path="login" element={<Auth />} /><Route path="register" element={<Auth register />} /><Route element={<ProtectedRoute role="student" />}><Route path="dashboard" element={<Dashboard />} /><Route path="learn/:id" element={<Lesson />} /></Route><Route element={<ProtectedRoute role="admin" />}><Route path="admin" element={<Admin />} /><Route path="admin/courses/new" element={<CourseForm />} /><Route path="admin/courses/:id/edit" element={<CourseForm />} /></Route><Route path="*" element={<Home />} /></Route></Routes></BrowserRouter>;
}
