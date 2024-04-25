import React, { useRef, useEffect } from "react";
import HandTracking from "../components/handTracking";
import InstrumentScreen from "../components/instrumentScreen";
import DevScreen from "../components/devScreen";
import Layout from "../components/layout/layout";

// Define a type for the props
type HomeProps = {
  devMode?: boolean;
};

const Home: React.FC<HomeProps> = ({ devMode = false }) => {
  const debug = false;

  const leftHandActive = useRef<boolean>(false);
  const leftHandPinched = useRef<boolean>(false);
  const rightHandActive = useRef<boolean>(false);
  const rightHandPinched = useRef<boolean>(false);

  if (devMode && debug) {
    useEffect(() => {
      const intervalId = setInterval(() => {
        console.log("Left Hand Active:", leftHandActive.current);
        console.log("Right Hand Active:", rightHandActive.current);
      }, 1000); // Log every second

      return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);
  }

  return (
    <Layout>
      <div style={{ position: "relative" }}>
        <HandTracking
          leftHandActive={leftHandActive}
          rightHandActive={rightHandActive}
          leftHandPinched={leftHandPinched}
          rightHandPinched={rightHandPinched}
        />
        <div style={{ minHeight: "500px" }}>
          {devMode ? <DevScreen /> : <InstrumentScreen />}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
