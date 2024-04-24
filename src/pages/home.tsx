import React from "react";
import HandTracking from "../components/handTracking";
import InstrumentScreen from "../components/instrumentScreen";
import DevScreen from "../components/devScreen";

// Define a type for the props
type HomeProps = {
  devMode?: boolean;
};

const Home: React.FC<HomeProps> = ({ devMode = false }) => {
  return (
    <>
      <div style={{ position: "relative" }}>
        <HandTracking />
        <div style={{ minHeight: "500px" }}>
          {devMode ? <DevScreen /> : <InstrumentScreen />}
        </div>
      </div>
    </>
  );
};

export default Home;
