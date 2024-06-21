import React, { ReactNode } from "react";

interface SectionProps {
  title?: string;
  children?: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={`w-full p-4 sm:p-2 ${className}`}>
      {title && <h3 className="text-2xl font-bold mb-4 sm:text-xl">{title}</h3>}
      {children}
    </div>
  );
};

export default Section;
