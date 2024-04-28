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
  const containerStyle: React.CSSProperties = {
    width: "100%",
    ...(className ? { className } : {}), // Only add className if provided
    padding: "16px", // Default padding for all screen sizes
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "24px", // equivalent to text-2xl
    fontWeight: "bold",
    marginBottom: "16px", // equivalent to mb-4
  };

  // Adjust padding for mobile screens
  if (window.matchMedia("(max-width: 768px)").matches) {
    containerStyle.padding = "8px";
    titleStyle.fontSize = "20px"; // Adjust title size for smaller screens
  }

  return (
    <div style={containerStyle}>
      {title && <h3 style={titleStyle}>{title}</h3>}
      {children}
    </div>
  );
};

export default Section;
