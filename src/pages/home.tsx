import React, { useRef, useState, useEffect } from "react";
import HandTracking from "../components/handTracking";
import Layout from "../components/layout/layout";
import { debounce } from "../utils/functions/debounce";
import PlayAudio from "../components/testing/playAudio";
import playSnare from "../utils/tone/usePlaySnare";
import TestEffects from "../components/testing/testEffects";
import playSong from "../utils/tone/usePlaySong";
// import NoteSelection from "../components/ui/noteSelection";
// import AudioPermissionButton from "../components/ui/audioPermissionButton";
// import InstrumentScreen from "../components/instrumentScreen";
// import DevScreen from "../components/devScreen";

type HomeProps = {
  devMode?: boolean;
};

const Home: React.FC<HomeProps> = ({ devMode = false }) => {
  // const [selectedNote, setSelectedNote] = useState("C1");

  // const [audioStarted, setAudioStarted] = useState(false);

  // const startAudio = async () => {
  //   await Tone.start();
  //   console.log("audio is ready");
  //   setAudioStarted(true);
  // };

  const leftHandActive = useRef<boolean>(false);
  const leftHandPinched = useRef<boolean>(false);
  const rightHandActive = useRef<boolean>(false);
  const rightHandPinched = useRef<boolean>(false);
  const rightHandVel = useRef<number>(0);
  const leftHandVel = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(true);
  const [hasRendered, setHasRendered] = useState<boolean>(false);

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

  const triggerAudio = () => {
    console.log("playing sound");
    let play = playSong;
    play();
  };

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
        <PlayAudio onClick={triggerAudio} />
        <TestEffects />
        {/* <div style={{ minHeight: "500px" }}>
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
        </div> */}
      </div>
    </Layout>
  );
};

export default Home;
