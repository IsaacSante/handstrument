import React, { useRef, useState, useEffect } from "react";
import HandTracking from "../components/handTracking";
import InstrumentScreen from "../components/instrumentScreen";
import DevScreen from "../components/devScreen";
import Layout from "../components/layout/layout";
import NoteSelection from "../components/ui/noteSelection";
import AudioPermissionButton from "../components/ui/audioPermissionButton";
import { debounce } from "../utils/functions/debounce";
import * as Tone from "tone";

type HomeProps = {
  devMode?: boolean;
};

const Home: React.FC<HomeProps> = ({ devMode = false }) => {
  const [selectedNote, setSelectedNote] = useState("C1");
  const leftHandActive = useRef<boolean>(false);
  const leftHandPinched = useRef<boolean>(false);
  const rightHandActive = useRef<boolean>(false);
  const rightHandPinched = useRef<boolean>(false);
  const rightHandVel = useRef<number>(0);
  const leftHandVel = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(true);
  const [hasRendered, setHasRendered] = useState<boolean>(false);
  const [audioStarted, setAudioStarted] = useState(false);

  const startAudio = async () => {
    await Tone.start();
    console.log("audio is ready");
    setAudioStarted(true);
  };

  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      setHasRendered(true);
    };

    const debouncedCheckIsMobile = debounce(checkIsMobile, 100);
    checkIsMobile();
    window.addEventListener("resize", debouncedCheckIsMobile);

    return () => {
      window.removeEventListener("resize", debouncedCheckIsMobile);
    };
  }, []);

  if (!hasRendered) {
    return null;
  }

  return (
    <Layout isMobile={isMobile}>
      <div style={{ position: "relative" }}>
        <HandTracking
          leftHandActive={leftHandActive}
          rightHandActive={rightHandActive}
          leftHandPinched={leftHandPinched}
          rightHandPinched={rightHandPinched}
          leftHandVelocity={leftHandVel}
          rightHandVelocity={rightHandVel}
          isMobile={isMobile}
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              {!audioStarted && (
                <AudioPermissionButton startAudio={startAudio} />
              )}
              {audioStarted && (
                <>
                  <InstrumentScreen
                    note={selectedNote}
                    leftHandPinched={leftHandPinched}
                    rightHandPinched={rightHandPinched}
                    rightHandVel={rightHandVel}
                    leftHandVel={leftHandVel}
                    isMobile={isMobile}
                  />
                  <NoteSelection
                    onNoteChange={setSelectedNote}
                    isMobile={isMobile}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
