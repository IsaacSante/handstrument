# Handstrument

A computer vision and audio-visual tool that allows you to control visuals and audio effects using your hands in real-time!

## Overview

Handstrument leverages MediaPipe for hand tracking and Tone.js for audio effects, enabling interactive DJ-like music and visual experiences through hand gestures.

## Features

- **Hand Tracking**: Detects the presence and movements of both hands.
- **Velocity Calculation**: Measures hand velocity to influence audio playback.
- **Audio Integration**: Uses Tone.js to map hand movements to pitch and feedback effects.
- **Interactive UI**: Displays feedback to users about their hand movements and actions.
- **Mobile Compatibility**: Ensures functionality on mobile devices, including a loading screen for better UX.

## Setup

1. **Import MediaPipe**:
   - Include the vision library via CDN: `@mediapipe/tasks-vision`.
2. **Hand Tracking**:
   - Log finger values in the console.
3. **Gesture Calculations**:
   - Track hand X, Y coordinates.
   - Calculate hand velocity.
4. **Audio Integration**:
   - Import Tone.js or another music library.
   - Use hand movements to influence audio effects' wetness.
5. **User Interface**:
   - Build a UI to indicate hand-triggered actions.
   - Allow users to use different notes for each hand.
6. **Deployment**:
   - Upload the project to Netlify.
   - Debug and ensure functionality in the production environment, including custom drawing functions.
7. **Mobile Support**:
   - Add a loading screen for mobile devices.
   - Verify that the tool works correctly on mobile.

## Future Enhancements

- **Configuration Management**:
  - Create a `config.json` file to store threshold values for the app.
- **Code Refactoring**:
  - Consolidate references into a single state for simpler mutations in child functions.

## Important Notes

- **iOS Compatibility**:
  - Audio will not work on iOS devices if the phone is in silent mode.
