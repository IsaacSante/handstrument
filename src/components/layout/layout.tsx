import React from "react";
import { CSSProperties } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const style: { containerMain: CSSProperties } = {
  containerMain: {
    display: "flex",
    flexDirection: "column", // Now specifically using the FlexDirection type
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%",
    minHeight: "100vh", // Changed height to minHeight for better mobile responsiveness
    margin: "auto",
  },
  // Define other styles here, ensuring to type them correctly
};

export default function Layout({ children }: LayoutProps) {
  return <main style={style.containerMain}>{children}</main>;
}
