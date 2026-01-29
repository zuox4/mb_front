import { BookOpen } from "lucide-react";

export interface PageHeaderProps {
  groupName: string;
  displayName: string;
  projectTitle?: string;
}

function PageHeader({ displayName }: PageHeaderProps) {
  return (
    <div className="text-center mb-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-sch-green-light/20 rounded-lg">
          <BookOpen className="w-6 h-6 text-sch-green-light" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white text-center">
            Зачетная книжка учащегося
          </h1>
          <p className="text-white/60 text-sm text-left">
            Ваши результаты в профильном классе
          </p>
        </div>
      </div>

      <h2 className="font-codec text-xl mb-2 text-sch-green-light uppercase">
        {displayName}
      </h2>
      {/* <h3 className="font-codec text-xl xl:text-3xl lg:text-2xl mb-2 text-white uppercase">
        {projectTitle}
      </h3> */}
    </div>
  );
}
export default PageHeader;
