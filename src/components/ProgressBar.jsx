function ProgressBar({ current, total }) {
  const percentage = ((current) / total) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      {/* Question counter */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-navy/60">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-terracotta">
          {Math.round(percentage)}% complete
        </span>
      </div>

      {/* Progress bar track */}
      <div className="h-2 bg-sand-dark rounded-full overflow-hidden">
        {/* Progress bar fill */}
        <div
          className="h-full bg-gradient-to-r from-terracotta to-sage rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i < current
                ? 'bg-sage'
                : i === current
                ? 'bg-terracotta'
                : 'bg-sand-dark'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProgressBar;
