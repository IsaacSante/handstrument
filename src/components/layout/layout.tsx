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

export default function Layout({ children, isMobile }: LayoutProps) {
  return <main style={isMobile ? {} : style.containerMain}>{children}</main>;
}
