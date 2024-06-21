import React from "react";
import { Progress } from "@/components/ui/progress";

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

  let colorClass;
  if (percentage < 33) {
    colorClass = "bg-green-300"; // Tailwind class for pastel green
  } else if (percentage < 67) {
    colorClass = "bg-yellow-400"; // Tailwind class for gold
  } else {
    colorClass = "bg-red-400"; // Tailwind class for pastel red
  }

  return (
    <div className="py-1">
      <div className="flex justify-between items-center">
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
      <div className="relative h-4 w-full bg-secondary rounded-full overflow-hidden">
        <Progress
          value={percentage}
          className={`h-full ${colorClass} transition-all`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
