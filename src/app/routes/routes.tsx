import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AuthPage from "@/pages/auth/AuthPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import WelcomeRedirect from "@/pages/auth/WelcomRedirect";
import StudentPage from "@/pages/student/student-page";
import TeacherPage from "@/pages/teacher/teacher-page";

import FogotPassword from "@/pages/auth/FogotPassword";
import MarkBookPage from "@/pages/student/mark-book/mark-book-page";
import ProjectOfficePage from "@/pages/student/project-office/project-office-page";
import AdminPage from "@/pages/teacher/admin/admin-page";
import EventTypes from "@/pages/teacher/admin/event-types/event-types";
import ClassLeaderPage from "@/pages/teacher/class-leader/class-leader-page";
import EventLeaderPage from "@/pages/teacher/event-leader/event-leader-page";
import ProjectLeaderPage from "@/pages/teacher/project-leader/project-leader-page";
import WelcomePage from "@/pages/teacher/welcome-page";
import { createBrowserRouter, Navigate } from "react-router-dom";
import TanStackQueryClientProvider from "../providers/query-client-provider";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <TanStackQueryClientProvider>
        <ProtectedRoute /> {/* Проверяет авторизацию */}
      </TanStackQueryClientProvider>
    ),
    children: [
      { index: true, element: <Navigate to={"/teacher"} /> },
      {
        path: "teacher",
        element: <ProtectedRoute requiredRole="teacher" />, // Только учителя
        children: [
          {
            element: <TeacherPage />,
            children: [
              { path: "", element: <WelcomePage /> }, // Доступно всем учителям
              {
                path: "project-leader",
                element: <ProtectedRoute requiredRole="project_leader" />, // Только с p_office
                children: [{ path: "", element: <ProjectLeaderPage /> }],
              },
              {
                path: "class-leader",
                element: <ProtectedRoute requiredRole="class_leader" />, // Только с groups_leader
                children: [{ path: "", element: <ClassLeaderPage /> }],
              },
              {
                path: "event-leader",
                element: <ProtectedRoute requiredRole="event_leader" />, // Только с event_types
                children: [{ path: "", element: <EventLeaderPage /> }],
              },
              {
                path: "admin",
                element: <ProtectedRoute requiredRole="admin" />, // Только админы
                children: [
                  {
                    path: "",
                    element: <AdminPage />,
                    children: [
                      {
                        path: "event-types",
                        element: <EventTypes />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "student",
        element: <ProtectedRoute requiredRole="student" />, // Только студенты
        children: [
          {
            element: <StudentPage />,
            children: [
              {
                path: "",
                element: <ProjectOfficePage />,
              },
              {
                path: "markBook",
                element: <MarkBookPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/forgot-password",
    element: <FogotPassword />,
  },
  {
    path: "/registration",
    element: <AuthPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/welcome",
    element: <WelcomeRedirect />,
  },
]);
