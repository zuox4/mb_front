export interface PageHeaderProps {
  groupName: string;
  displayName: string;
  projectTitle?: string;
}

function PageHeader({ groupName, displayName, projectTitle }: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="font-codec text-xl xl:text-3xl lg:text-2xl mb-2 text-white uppercase ">
        Зачетная книжка ученика
        <br className="lg:hidden" /> {groupName} класса
      </h1>
      <h2 className="font-codec text-xl mb-2 text-sch-green-light uppercase">
        {displayName}
      </h2>
      <h3 className="font-codec text-xl xl:text-3xl lg:text-2xl mb-2 text-white uppercase">
        {projectTitle}
      </h3>
    </div>
  );
}
export default PageHeader;
