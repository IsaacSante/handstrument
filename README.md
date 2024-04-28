# Instrumentalist

What if we could make music when we mimic instruments?
Using ML and paying attention to certain hand gestures maybe we can!

![mimic](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW10YjBjb3FmOGk0d2owNDB2Y2d4MXg1c2tqd2xrMTJ6azRjejhyeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wpu0lK7V0sSB3bsUdo/giphy.gif)

This is the first stage of such an app, starting off with drums and might expand to other instruments in the future.

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
- Import Tone or other music library.
- Tie pinch to trigger drum sample.
- Velocity pass a certain threshold triggers music.

## For future

- Refactor refs to be in one state to make it simpler to mutate in child functions

- Expand app to include piano and guitar guestures.
