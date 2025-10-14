// pages/teacher/components/ContentContainer.tsx
import React from "react";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className="max-w-7xl mx-auto lg:px-1 pb-20  md:py-8">
      <div className={`  ${className}`}>{children}</div>
    </div>
  );
};

export default ContentContainer;
