import { useState } from 'react';

function QuizQuestion({ question, onAnswer, questionNumber }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (option) => {
    if (isAnimating) return;

    setSelectedOption(option.id);
    setIsAnimating(true);

    // Delay to show selection before transitioning
    setTimeout(() => {
      onAnswer(option);
      setSelectedOption(null);
      setIsAnimating(false);
    }, 400);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto px-4 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
      {/* Question header */}
      <div className="text-center mb-8">
        <span className="inline-block text-5xl mb-4">{question.icon}</span>
        <h2 className="text-2xl md:text-3xl font-bold text-navy leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Answer options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            disabled={isAnimating}
            className={`w-full p-4 md:p-5 text-left rounded-xl border-2 transition-all duration-200 ${
              selectedOption === option.id
                ? 'border-terracotta bg-terracotta/10 scale-[1.02]'
                : 'border-sand-dark bg-white hover:border-sage hover:bg-sage/5 hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Option letter */}
              <span
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                  selectedOption === option.id
                    ? 'bg-terracotta text-white'
                    : 'bg-sand-dark text-navy/60'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>

              {/* Option text */}
              <span
                className={`text-base md:text-lg ${
                  selectedOption === option.id ? 'text-navy font-medium' : 'text-navy/80'
                }`}
              >
                {option.text}
              </span>

              {/* Selected checkmark */}
              {selectedOption === option.id && (
                <span className="ml-auto flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-terracotta"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Skip hint */}
      <p className="text-center mt-6 text-sm text-navy/40">
        Select the option that feels most like you
      </p>
    </div>
  );
}

export default QuizQuestion;
