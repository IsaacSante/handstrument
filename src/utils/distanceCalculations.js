// Calculate the Euclidean distance between two points
const calculateDistance = (point1, point2) => {
    const xDiff = point1.x - point2.x;
    const yDiff = point1.y - point2.y;
    const zDiff = point1.z - point2.z;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
  };
  
  // Determine if pinching
  export default const detectPinch = (landmarks, indexFingerTipIndex, thumbTipIndex) => {
    const pinchThreshold = /* define your threshold here */;
    const distance = calculateDistance(
      landmarks[indexFingerTipIndex],
      landmarks[thumbTipIndex]
    );
    return distance < pinchThreshold;
  };
  