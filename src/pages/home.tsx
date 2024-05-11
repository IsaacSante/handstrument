import React, { useRef, useState, useEffect } from "react";
import HandTracking from "../components/handTracking";
import Layout from "../components/layout/layout";
import { debounce } from "../utils/functions/debounce";
import TestEffects from "../components/testing/testEffects";
import playSong from "../utils/tone/usePlaySong";
import AudioPermissionButton from "../components/ui/audioPermissionButton";
import { Analyser } from "tone";

type HomeProps = {
  devMode?: boolean;
};

const Home: React.FC<HomeProps> = ({ devMode = false }) => {
  const [audioStarted, setAudioStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [hasRendered, setHasRendered] = useState<boolean>(false);
  const analyserRef = useRef(new Analyser("waveform", 256));
  const [isAnimating, setIsAnimating] = useState(true);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
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

  const triggerAudio = () => {
    let play = playSong;
    play(analyserRef.current);
    setAudioStarted(true);
  };

  return (
    <Layout isMobile={isMobile}>
      <div style={{ position: "relative" }}>
        <HandTracking
          analyser={analyserRef.current}
          isMobile={isMobile}
          isAnimating={isAnimating}
        />
        <TestEffects />
        {!audioStarted && <AudioPermissionButton startAudio={triggerAudio} />}
        <button onClick={toggleAnimation}>
          {isAnimating ? "Stop FX" : "Start New FX"}
        </button>
      </div>
    </Layout>
  );
};

export default Home;
