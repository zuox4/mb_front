// pages/TeacherPage.tsx
import Header from "@/components/owner/header/Header";
import ContentContainer from "@/components/teacher/event-leader/ContentContainer";
import TeacherNavigation from "@/components/teacher/TeacherNavigation";

import { Outlet } from "react-router-dom";

const TeacherPage = () => {
  return (
    <div className="min-h-screen px-3">
      <Header />
      <div className="pt-20">
        <div className="flex flex-col items-center mt-3">
          <TeacherNavigation />
        </div>

        {/* Main Content */}
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </div>
    </div>
  );
};

export default TeacherPage;
