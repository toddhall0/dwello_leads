// Lead Scoring and Neighborhood Matching Logic

import { neighborhoods } from '../data/neighborhoods';

/**
 * Calculate lead scores from quiz answers
 * @param {Array} answers - Array of selected answer objects
 * @returns {Object} - Calculated scores
 */
export function calculateScores(answers) {
  let budgetScores = [];
  let timelineScores = [];
  let propertyTypes = [];
  let neighborhoodFits = [];
  let lifestyles = [];

  answers.forEach((answer) => {
    if (!answer?.scores) return;

    const { scores } = answer;

    // Collect budget scores
    if (scores.budget) {
      budgetScores.push(scores.budget);
    }

    // Collect timeline scores
    if (scores.timeline) {
      timelineScores.push(scores.timeline);
    }

    // Collect property types
    if (scores.propertyType) {
      propertyTypes.push(scores.propertyType);
    }

    // Collect neighborhood fits
    if (scores.neighborhoodFit) {
      neighborhoodFits.push(...scores.neighborhoodFit);
    }

    // Collect lifestyle indicators
    if (scores.lifestyle) {
      lifestyles.push(scores.lifestyle);
    }
  });

  // Calculate average budget score (1-5)
  const budgetScore = budgetScores.length > 0
    ? Math.round(budgetScores.reduce((a, b) => a + b, 0) / budgetScores.length)
    : 3;

  // Calculate average timeline score (1-5)
  const timelineScore = timelineScores.length > 0
    ? Math.round(timelineScores.reduce((a, b) => a + b, 0) / timelineScores.length)
    : 2;

  // Determine lead temperature based on timeline score
  const leadTemperature = calculateLeadTemperature(timelineScore);

  // Determine dominant property type
  const propertyType = getMostFrequent(propertyTypes) || 'single-family';

  // Determine budget range
  const budgetRange = getBudgetRange(budgetScore);

  return {
    budgetScore,
    timelineScore,
    leadTemperature,
    propertyType,
    budgetRange,
    neighborhoodFits,
    lifestyles
  };
}

/**
 * Calculate lead temperature from timeline score
 * @param {number} timelineScore
 * @returns {string}
 */
function calculateLeadTemperature(timelineScore) {
  if (timelineScore >= 5) return 'on-fire';
  if (timelineScore >= 4) return 'hot';
  if (timelineScore >= 2) return 'warm';
  return 'cold';
}

/**
 * Get budget range label from score
 * @param {number} budgetScore
 * @returns {Object}
 */
function getBudgetRange(budgetScore) {
  const ranges = {
    1: { label: 'Under $300K', min: 0, max: 300000 },
    2: { label: '$300K - $450K', min: 300000, max: 450000 },
    3: { label: '$450K - $600K', min: 450000, max: 600000 },
    4: { label: '$600K - $1M', min: 600000, max: 1000000 },
    5: { label: '$1M+', min: 1000000, max: 10000000 }
  };
  return ranges[budgetScore] || ranges[3];
}

/**
 * Get most frequent item in array
 * @param {Array} arr
 * @returns {*}
 */
function getMostFrequent(arr) {
  if (!arr.length) return null;

  const counts = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Match neighborhood based on scores and answers
 * @param {Object} scores - Calculated scores
 * @returns {Object} - Matched neighborhood data
 */
export function matchNeighborhood(scores) {
  const { budgetScore, propertyType, neighborhoodFits, lifestyles } = scores;

  // Build scoring for each neighborhood
  const neighborhoodScores = {};

  Object.keys(neighborhoods).forEach((key) => {
    const hood = neighborhoods[key];
    let score = 0;

    // Score based on direct neighborhood fits from questions
    neighborhoodFits.forEach((fit) => {
      if (fit === key) score += 3;
    });

    // Score based on budget alignment
    const budgetEstimate = getBudgetRange(budgetScore);
    if (budgetEstimate.min >= hood.minBudget * 0.7 && budgetEstimate.max <= hood.maxBudget * 1.3) {
      score += 2;
    }

    // Score based on property type matching
    if (propertyType === 'luxury' && hood.vibe.includes('luxury')) score += 2;
    if (propertyType === 'estate' && hood.vibe.includes('estates')) score += 2;
    if (propertyType === 'condo' && hood.vibe.includes('urban')) score += 2;
    if (propertyType === 'single-family' && hood.vibe.includes('family')) score += 2;

    // Score based on lifestyle matching
    lifestyles.forEach((lifestyle) => {
      if (hood.vibe.includes(lifestyle)) score += 1;
    });

    neighborhoodScores[key] = score;
  });

  // Find the neighborhood with highest score
  const sortedNeighborhoods = Object.entries(neighborhoodScores)
    .sort((a, b) => b[1] - a[1]);

  const matchedKey = sortedNeighborhoods[0][0];

  return {
    ...neighborhoods[matchedKey],
    matchScore: sortedNeighborhoods[0][1],
    alternativeMatches: sortedNeighborhoods.slice(1, 3).map(([key]) => neighborhoods[key])
  };
}

/**
 * Generate complete lead data object
 * @param {Array} answers - Quiz answers
 * @param {Object} contactInfo - Lead contact information
 * @returns {Object} - Complete lead data
 */
export function generateLeadData(answers, contactInfo) {
  const scores = calculateScores(answers);
  const neighborhoodMatch = matchNeighborhood(scores);

  return {
    id: generateLeadId(),
    timestamp: new Date().toISOString(),
    contact: {
      firstName: contactInfo.firstName || '',
      email: contactInfo.email || '',
      phone: contactInfo.phone || ''
    },
    scores: {
      budgetScore: scores.budgetScore,
      timelineScore: scores.timelineScore,
      leadTemperature: scores.leadTemperature,
      propertyType: scores.propertyType,
      budgetRange: scores.budgetRange.label
    },
    neighborhoodMatch: neighborhoodMatch.id,
    answers: answers.map((answer, index) => ({
      questionId: index + 1,
      answerId: answer.id,
      answerText: answer.text
    })),
    metadata: {
      quizVersion: '1.0',
      source: 'phoenix-neighborhood-quiz'
    }
  };
}

/**
 * Generate unique lead ID
 * @returns {string}
 */
function generateLeadId() {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default {
  calculateScores,
  matchNeighborhood,
  generateLeadData
};
