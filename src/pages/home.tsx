import React, { useRef } from "react";
import HandTracking from "../components/handTracking";
import InstrumentScreen from "../components/instrumentScreen";
import DevScreen from "../components/devScreen";
import Layout from "../components/layout/layout";

type HomeProps = {
  devMode?: boolean;
};

const Home: React.FC<HomeProps> = ({ devMode = false }) => {
  const leftHandActive = useRef<boolean>(false);
  const leftHandPinched = useRef<boolean>(false);
  const rightHandActive = useRef<boolean>(false);
  const rightHandPinched = useRef<boolean>(false);
  const rightHandVel = useRef<number>(0);
  const leftHandVel = useRef<number>(0);

  return (
    <Layout>
      <div style={{ position: "relative" }}>
        <HandTracking
          leftHandActive={leftHandActive}
          rightHandActive={rightHandActive}
          leftHandPinched={leftHandPinched}
          rightHandPinched={rightHandPinched}
          leftHandVelocity={leftHandVel}
          rightHandVelocity={rightHandVel}
        />
        <div style={{ minHeight: "500px" }}>
          {devMode ? (
            <DevScreen
              leftHandActive={leftHandActive}
              leftHandPinched={leftHandPinched}
              rightHandActive={rightHandActive}
              rightHandPinched={rightHandPinched}
              rightHandVel={rightHandVel}
              leftHandVel={leftHandVel}
            />
          ) : (
            <InstrumentScreen />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
