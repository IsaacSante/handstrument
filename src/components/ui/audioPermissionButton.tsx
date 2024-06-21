import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

type AudioPermissionButtonProps = {
  startAudio: () => void;
  btnText: string;
};

const AudioPermissionButton: React.FC<AudioPermissionButtonProps> = ({
  startAudio,
  btnText,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      button.addEventListener("click", startAudio);
      return () => {
        if (button) {
          button.removeEventListener("click", startAudio);
        }
      };
    }
  }, [startAudio]);

  return (
    <Button ref={buttonRef} variant="outline">
      {btnText}
    </Button>
  );
};

export default AudioPermissionButton;
