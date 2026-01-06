// Quiz Questions with scoring mappings
// Each answer maps to specific lead qualification scores

export const quizQuestions = [
  {
    id: 1,
    question: "Your ideal Saturday morning looks like...",
    category: "lifestyle",
    icon: "☀️",
    options: [
      {
        id: "a",
        text: "Farmer's market & artisan coffee shop hopping",
        scores: { lifestyle: "urban", budget: 2, neighborhoodFit: ["downtown", "tempe"] }
      },
      {
        id: "b",
        text: "Hiking at sunrise, then poolside lounging",
        scores: { lifestyle: "suburban-active", budget: 3, neighborhoodFit: ["arcadia", "gilbert"] }
      },
      {
        id: "c",
        text: "Quiet brunch at home with family",
        scores: { lifestyle: "family", budget: 3, neighborhoodFit: ["gilbert", "arcadia"] }
      },
      {
        id: "d",
        text: "Golf round followed by spa day",
        scores: { lifestyle: "luxury", budget: 5, neighborhoodFit: ["scottsdale", "paradise-valley"] }
      }
    ]
  },
  {
    id: 2,
    question: "If you could drive anything tomorrow, you'd pick...",
    category: "budget",
    icon: "🚗",
    options: [
      {
        id: "a",
        text: "A practical hybrid - gets me there efficiently",
        scores: { budget: 1, budgetRange: "under-300k" }
      },
      {
        id: "b",
        text: "A nice SUV for weekend adventures",
        scores: { budget: 2, budgetRange: "300-450k" }
      },
      {
        id: "c",
        text: "A luxury sedan - comfort and style matter",
        scores: { budget: 4, budgetRange: "600k-1m" }
      },
      {
        id: "d",
        text: "Whatever's in my dream garage collection",
        scores: { budget: 5, budgetRange: "1m-plus" }
      }
    ]
  },
  {
    id: 3,
    question: "Your ideal dinner party has...",
    category: "homeSize",
    icon: "🍽️",
    options: [
      {
        id: "a",
        text: "Just you and a partner or close friend",
        scores: { homeSize: "1-2bed", propertyType: "condo" }
      },
      {
        id: "b",
        text: "4-6 of your favorite people",
        scores: { homeSize: "3bed", propertyType: "single-family" }
      },
      {
        id: "c",
        text: "The whole extended family - the more the merrier!",
        scores: { homeSize: "4-plus-bed", propertyType: "single-family" }
      },
      {
        id: "d",
        text: "Intimate gathering, but with a personal chef",
        scores: { homeSize: "luxury", propertyType: "luxury" }
      }
    ]
  },
  {
    id: 4,
    question: "Dream vacation mode is...",
    category: "budgetLifestyle",
    icon: "✈️",
    options: [
      {
        id: "a",
        text: "Budget backpacking adventure - experiences over luxury",
        scores: { budget: 1, lifestyle: "adventurous" }
      },
      {
        id: "b",
        text: "All-inclusive resort - relaxation guaranteed",
        scores: { budget: 3, lifestyle: "comfortable" }
      },
      {
        id: "c",
        text: "Boutique hotels with curated local experiences",
        scores: { budget: 4, lifestyle: "refined" }
      },
      {
        id: "d",
        text: "Private villa with personal staff",
        scores: { budget: 5, lifestyle: "luxury" }
      }
    ]
  },
  {
    id: 5,
    question: "Right now, home feels like...",
    category: "timeline",
    icon: "🏠",
    options: [
      {
        id: "a",
        text: "Perfect! Just daydreaming about possibilities",
        scores: { timeline: 1, temperature: "cold" }
      },
      {
        id: "b",
        text: "Good, but I'm starting to think about changes",
        scores: { timeline: 2, temperature: "warm" }
      },
      {
        id: "c",
        text: "Ready for something new - the itch is real",
        scores: { timeline: 4, temperature: "hot" }
      },
      {
        id: "d",
        text: "Actively searching - let's make moves!",
        scores: { timeline: 5, temperature: "on-fire" }
      }
    ]
  },
  {
    id: 6,
    question: "When you find something you love, you...",
    category: "decisionStyle",
    icon: "💭",
    options: [
      {
        id: "a",
        text: "Research for months - I love being thorough",
        scores: { timeline: 1, decisionSpeed: "slow" }
      },
      {
        id: "b",
        text: "Sleep on it a few weeks - no rush",
        scores: { timeline: 2, decisionSpeed: "medium" }
      },
      {
        id: "c",
        text: "Trust my gut pretty quickly",
        scores: { timeline: 4, decisionSpeed: "fast" }
      },
      {
        id: "d",
        text: "Already have my checkbook ready",
        scores: { timeline: 5, decisionSpeed: "immediate" }
      }
    ]
  },
  {
    id: 7,
    question: "Your ideal outdoor space is...",
    category: "propertyType",
    icon: "🌵",
    options: [
      {
        id: "a",
        text: "A cute balcony or patio with plants",
        scores: { propertyType: "condo", outdoorSpace: "minimal" }
      },
      {
        id: "b",
        text: "Nice backyard for BBQs and games",
        scores: { propertyType: "single-family", outdoorSpace: "moderate" }
      },
      {
        id: "c",
        text: "Resort-style pool and outdoor kitchen",
        scores: { propertyType: "luxury", outdoorSpace: "extensive" }
      },
      {
        id: "d",
        text: "Acreage with mountain views for days",
        scores: { propertyType: "estate", outdoorSpace: "expansive" }
      }
    ]
  },
  {
    id: 8,
    question: "Your Phoenix expertise level...",
    category: "localKnowledge",
    icon: "🌴",
    options: [
      {
        id: "a",
        text: "What's a Sonoran hot dog? (Relocating)",
        scores: { localKnowledge: "relocating", buyerType: "out-of-state" }
      },
      {
        id: "b",
        text: "I know a few spots - still exploring",
        scores: { localKnowledge: "newer", buyerType: "recent-transplant" }
      },
      {
        id: "c",
        text: "Solid local knowledge - I know my way around",
        scores: { localKnowledge: "established", buyerType: "local" }
      },
      {
        id: "d",
        text: "Born and raised - bleed purple and orange!",
        scores: { localKnowledge: "native", buyerType: "local-native" }
      }
    ]
  }
];

export default quizQuestions;
