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
    colorClass = "tailwind.config.jsbg-green-300"; // Tailwind class for pastel green
  } else if (percentage < 67) {
    colorClass = "tailwind.config.jsbg-yellow-400"; // Tailwind class for gold
  } else {
    colorClass = "tailwind.config.jsbg-red-400"; // Tailwind class for pastel red
  }

  return (
    <div className="tailwind.config.jspy-1">
      <div className="tailwind.config.jsflex tailwind.config.jsjustify-between tailwind.config.jsitems-center">
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
      <div className="tailwind.config.jsrelative tailwind.config.jsh-4 tailwind.config.jsw-full tailwind.config.jsbg-secondary tailwind.config.jsrounded-full tailwind.config.jsoverflow-hidden">
        <Progress
          value={percentage}
          className={`tailwind.config.jsh-full ${colorClass} tailwind.config.jstransition-all`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
