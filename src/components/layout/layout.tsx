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
    height: "100vh",
    padding: "0 10px",
    paddingBottom: "5vh",
    paddingTop: "5vh",
    margin: "auto",
  },
  // Define other styles here, ensuring to type them correctly
};

export default function Layout({ children }: LayoutProps) {
  return <main style={style.containerMain}>{children}</main>;
}
