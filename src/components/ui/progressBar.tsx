interface ProgressBarProps {
  title: string;
  targetNumber: number;
  startRange: number;
  endRange: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  title,
  targetNumber,
  startRange,
  endRange,
}) => {
  const limitNumberWithinRange = (
    num: number,
    min: number,
    max: number
  ): number => {
    return Math.max(min, Math.min(num, max));
  };

  const calculatePercentage = (): number => {
    const adjustedNum = limitNumberWithinRange(
      targetNumber,
      startRange,
      endRange
    );
    return ((adjustedNum - startRange) / (endRange - startRange)) * 100;
  };

  const percentage = calculatePercentage();

  return (
    <div>
      <h3>{title}</h3>
      <div
        style={{
          height: "10px",
          width: "100%",
          backgroundColor: "#E1FFE4",
          borderRadius: "50px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: "#ffc107",
            borderRadius: "inherit",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
