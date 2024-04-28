# Instrumentalist

Phase 1: Create a virtual drum machine
DrumMode = pinch detection on both hands
Gain on drums = average velocity of hand movement

Phase 2?: Expand app to include piano and guitar

## Todo

- Import Tone or other music library.
- Tie pinch to trigger drum sample.
- Velocity pass a certain threshold triggers music.

## Done

- Import MediaPipe
- getting vision library via cdn @mediapipe/tasks-vision
- Console logging finger values
- Checking if left and right hand are present
- Calculate pinch
- Update pinch ref
- Calculate velocity

## For future

- Refactor refs to be in one state to make it simpler to mutate in child functions
