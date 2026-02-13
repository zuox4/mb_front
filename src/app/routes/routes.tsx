import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AuthPage from "@/pages/auth/AuthPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import WelcomeRedirect from "@/pages/auth/WelcomRedirect";
import StudentPage from "@/pages/student/student-page";
import TeacherPage from "@/pages/teacher/teacher-page";

import FogotPassword from "@/pages/auth/FogotPassword";
import NotFoundPage from "@/pages/NotFound";
import MarkBookPage from "@/pages/student/mark-book/mark-book-page";
import ProjectOfficePage from "@/pages/student/project-office/project-office-page";
import AdminPage from "@/pages/teacher/admin/admin-page";
import CreateEventType from "@/pages/teacher/admin/event-types/create-event-type";
import EventType from "@/pages/teacher/admin/event-types/event-type-id";
import EventTypes from "@/pages/teacher/admin/event-types/event-types";
import CreateEventPage from "@/pages/teacher/admin/events/create-event-page";
import EventPageById from "@/pages/teacher/admin/events/event-id";
import EventPage from "@/pages/teacher/admin/events/events-page";
import GroupsPage from "@/pages/teacher/admin/groups/groups-page";
import ProjectOfficesPage from "@/pages/teacher/admin/projects/project-offices-page";
import ClassLeaderPage from "@/pages/teacher/class-leader/class-leader-page";
import EventLeaderPage from "@/pages/teacher/event-leader/event-leader-page";
import ProjectLeaderPage from "@/pages/teacher/project-leader/project-leader-page";
import WelcomePage from "@/pages/teacher/welcome-page";

import { createBrowserRouter, Navigate } from "react-router-dom";
import TanStackQueryClientProvider from "../providers/query-client-provider";
import EventsPage from "@/pages/student/events/eventsPage";
import AchievementsPage from "@/pages/student/achivments/Achivments";
import ProfilePage from "@/pages/profile/Profile";
import ClassTeacherDashboard from "@/components/teacher/class-teacher/ClassTeacherDashboard";
import MyClassPage from "@/pages/teacher/class-leader/my-class";
import ProjectOfficeAdminPage from "@/components/admin/ProjectOffices/ProjectOfficeAdminPage";
import GroupInfoPage from "@/pages/teacher/admin/groups/group-info-page";
import AdminWelcomePage from "@/pages/teacher/admin/AdminWelcomePage";
import AccessDenied from "@/pages/AccessDenied";

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
      { path: "access-denied", element: <AccessDenied /> },
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
                children: [
                  {
                    path: "",
                    element: <ClassLeaderPage />,
                    children: [
                      {
                        path: "",
                        element: <Navigate to={"my-class"} />,
                      },
                      {
                        path: "event-dashboard",
                        element: <ClassTeacherDashboard />,
                      },
                      {
                        path: "my-class",
                        element: <MyClassPage />,
                      },
                    ],
                  },
                ],
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
                        path: "",
                        element: <AdminWelcomePage />,
                      },
                      {
                        path: "event-types",
                        element: <EventTypes />,
                      },
                      {
                        path: "event-types/create",
                        element: <CreateEventType />,
                      },
                      { path: "event-types/:id", element: <EventType /> },
                      {
                        path: "events",
                        element: <EventPage />,
                      },
                      {
                        path: "events/create-event",
                        element: <CreateEventPage />,
                      },
                      {
                        path: "events/:id",
                        element: <EventPageById />,
                      },
                      {
                        path: "project-offices",
                        element: <ProjectOfficesPage />,
                      },
                      {
                        path: "project-offices/:id",
                        element: <ProjectOfficeAdminPage />,
                      },
                      {
                        path: "groups",
                        element: <GroupsPage />,
                      },
                      {
                        path: "groups/:id",
                        element: <GroupInfoPage />,
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
              {
                path: "all-events",
                element: <EventsPage />,
              },
              {
                path: "achievements",
                element: <AchievementsPage />,
              },
              {
                path: "profile",
                element: <ProfilePage />,
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
  { path: "*", element: <NotFoundPage /> },
]);
