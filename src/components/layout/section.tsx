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
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "24px", // equivalent to text-2xl
    fontWeight: "bold",
    marginBottom: "16px", // equivalent to mb-4
  };

  // Adjust padding for larger screens
  const responsivePadding = window.matchMedia("(min-width: 768px)").matches
    ? "32px"
    : "16px";
  containerStyle.padding = responsivePadding;

  return (
    <div style={containerStyle}>
      {title && <h2 style={titleStyle}>{title}</h2>}
      {children}
    </div>
  );
};

export default Section;
