import { useState } from 'react';

function WelcomeScreen({ onStart }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onStart();
    }, 300);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-terracotta/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sage/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Desert icon/illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-full shadow-lg">
            <span className="text-5xl">🌵</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4 leading-tight">
          Which Phoenix Neighborhood{' '}
          <span className="text-terracotta">Matches Your Soul?</span>
        </h1>

        {/* Subhead */}
        <p className="text-lg md:text-xl text-navy/70 mb-8 max-w-md mx-auto">
          Answer 8 quick questions to discover your perfect Phoenix vibe
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm text-navy/60">
          <span className="flex items-center gap-2">
            <span className="text-sage">✓</span> Takes 2 minutes
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sage">✓</span> Fun & insightful
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sage">✓</span> Personalized results
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-terracotta to-terracotta-dark rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <span>Start Quiz</span>
          <svg
            className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        {/* Trust indicators */}
        <p className="mt-8 text-sm text-navy/50">
          Join 2,000+ Phoenix dreamers who found their perfect neighborhood
        </p>
      </div>

      {/* Bottom decoration - desert silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Mountain silhouette */}
          <path
            d="M0 100 L0 60 Q100 40 200 50 Q300 60 400 45 Q500 30 600 35 Q700 40 800 30 Q900 20 1000 40 Q1100 60 1200 50 L1200 100 Z"
            fill="#E07A5F"
            fillOpacity="0.1"
          />
          {/* Saguaro hints */}
          <path
            d="M150 55 L150 70 M145 60 L150 63 M155 58 L150 61"
            stroke="#81B29A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.3"
          />
          <path
            d="M850 35 L850 55 M843 42 L850 47 M857 40 L850 45"
            stroke="#81B29A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.3"
          />
        </svg>
      </div>
    </div>
  );
}

export default WelcomeScreen;
