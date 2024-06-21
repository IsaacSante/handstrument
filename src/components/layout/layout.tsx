import React from "react";
import { CSSProperties } from "react";

interface LayoutProps {
  children: React.ReactNode;
  isMobile: boolean;
}

interface LayoutProps {
  children: React.ReactNode;
  isMobile: boolean;
}

const style: { containerMain: CSSProperties } = {
  containerMain: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "2vh",
  },
};

const mobileStyle: { containerMain: CSSProperties } = {
  containerMain: {
    padding: "2rem",
  },
};

export default function Layout({ children, isMobile }: LayoutProps) {
  return (
    <main
      className="dark"
      style={isMobile ? mobileStyle.containerMain : style.containerMain}
    >
      {children}
    </main>
  );
}
