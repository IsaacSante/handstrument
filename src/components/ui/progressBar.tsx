interface ProgressBarProps {
  title: string;
  subtitle: string;
  targetNumber: number;
  startRange: number;
  endRange: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  title,
  subtitle,
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

  let color;
  if (percentage < 33) {
    color = "#98FB98"; // Pastel green
  } else if (percentage < 67) {
    color = "#ffc107"; // Gold
  } else {
    color = "#FF6347"; // Pastel red
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
      <div
        style={{
          height: "8px",
          width: "100%",
          backgroundColor: "#E1FFE4",
          borderRadius: "50px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: color,
            borderRadius: "inherit",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
