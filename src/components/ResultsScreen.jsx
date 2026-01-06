import { neighborhoods } from '../data/neighborhoods';

function ResultsScreen({ result, scores, onRestart }) {
  const neighborhood = neighborhoods[result] || neighborhoods['arcadia'];

  // Temperature badge styling
  const temperatureBadges = {
    'cold': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Just Exploring' },
    'warm': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Getting Interested' },
    'hot': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Actively Looking' },
    'on-fire': { bg: 'bg-red-100', text: 'text-red-700', label: 'Ready to Move!' }
  };

  const tempBadge = temperatureBadges[scores?.leadTemperature] || temperatureBadges['warm'];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Results header */}
      <div className="text-center mb-8">
        <span className="inline-block text-5xl mb-4">🏡</span>
        <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">
          Your Perfect Match:
        </h2>
        <h1
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: neighborhood.color }}
        >
          {neighborhood.name}
        </h1>
        <p className="text-lg text-navy/70 italic">
          {neighborhood.tagline}
        </p>
      </div>

      {/* Main result card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        {/* Colored header bar */}
        <div
          className="h-3"
          style={{ backgroundColor: neighborhood.color }}
        />

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Description */}
          <p className="text-lg text-navy/80 mb-6 leading-relaxed">
            {neighborhood.description}
          </p>

          {/* Price range */}
          <div className="bg-sand-light rounded-lg p-4 mb-6">
            <p className="text-sm text-navy/60 mb-1">Homes in your vibe typically range from</p>
            <p className="text-2xl font-bold text-navy">
              {neighborhood.priceRange}
            </p>
          </div>

          {/* Highlights */}
          <div className="mb-6">
            <h3 className="font-semibold text-navy mb-3">
              Why {neighborhood.name} fits you:
            </h3>
            <ul className="space-y-2">
              {neighborhood.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: neighborhood.color }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-navy/80">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lead score summary (subtle) */}
          {scores && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${tempBadge.bg} ${tempBadge.text}`}>
                {tempBadge.label}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sage/20 text-sage-dark">
                Budget: {scores.budgetRange}
              </span>
            </div>
          )}

          {/* CTA */}
          <a
            href="#contact"
            className="block w-full py-4 text-center text-lg font-semibold text-white rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            style={{ backgroundColor: neighborhood.color }}
          >
            Want to explore {neighborhood.name} homes? Let's chat!
          </a>
        </div>
      </div>

      {/* Alternative neighborhoods */}
      <div className="mb-8">
        <h3 className="text-center text-navy/60 mb-4">You might also like:</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(neighborhoods)
            .filter((n) => n.id !== neighborhood.id)
            .slice(0, 2)
            .map((alt) => (
              <div
                key={alt.id}
                className="bg-white rounded-xl p-4 border-2 border-sand-dark"
              >
                <h4 className="font-semibold text-navy text-sm mb-1">{alt.name}</h4>
                <p className="text-xs text-navy/60">{alt.priceRange}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Share & restart */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-3 text-navy/60 font-medium rounded-full border-2 border-sand-dark hover:border-navy/30 transition-colors"
        >
          Take Quiz Again
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Which Phoenix Neighborhood Matches Your Soul?',
                text: `I got ${neighborhood.name}! Take the quiz to find your perfect Phoenix neighborhood.`,
                url: window.location.href
              });
            }
          }}
          className="px-6 py-3 text-white font-medium rounded-full bg-navy hover:bg-navy-light transition-colors"
        >
          Share Results
        </button>
      </div>

      {/* Footer branding */}
      <div className="text-center mt-12 pt-8 border-t border-sand-dark">
        <p className="text-sm text-navy/40">
          Powered by Your Phoenix Real Estate Team
        </p>
      </div>
    </div>
  );
}

export default ResultsScreen;
