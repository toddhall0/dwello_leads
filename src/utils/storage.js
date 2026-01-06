// Local Storage Utilities for Lead Data

const STORAGE_KEY = 'phoenix_quiz_leads';

/**
 * Get all leads from storage
 * @returns {Array} - Array of lead objects
 */
export function getLeads() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading leads from storage:', error);
    return [];
  }
}

/**
 * Save a new lead to storage
 * @param {Object} lead - Lead data object
 * @returns {boolean} - Success status
 */
export function saveLead(lead) {
  try {
    const leads = getLeads();
    leads.unshift(lead); // Add new lead at the beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    return true;
  } catch (error) {
    console.error('Error saving lead:', error);
    return false;
  }
}

/**
 * Get a single lead by ID
 * @param {string} id - Lead ID
 * @returns {Object|null} - Lead object or null
 */
export function getLeadById(id) {
  const leads = getLeads();
  return leads.find((lead) => lead.id === id) || null;
}

/**
 * Delete a lead by ID
 * @param {string} id - Lead ID
 * @returns {boolean} - Success status
 */
export function deleteLead(id) {
  try {
    const leads = getLeads();
    const filtered = leads.filter((lead) => lead.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting lead:', error);
    return false;
  }
}

/**
 * Filter leads by criteria
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered leads
 */
export function filterLeads(filters = {}) {
  let leads = getLeads();

  if (filters.temperature) {
    leads = leads.filter((lead) => lead.scores.leadTemperature === filters.temperature);
  }

  if (filters.neighborhood) {
    leads = leads.filter((lead) => lead.neighborhoodMatch === filters.neighborhood);
  }

  if (filters.startDate) {
    const start = new Date(filters.startDate);
    leads = leads.filter((lead) => new Date(lead.timestamp) >= start);
  }

  if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999);
    leads = leads.filter((lead) => new Date(lead.timestamp) <= end);
  }

  if (filters.minBudgetScore) {
    leads = leads.filter((lead) => lead.scores.budgetScore >= filters.minBudgetScore);
  }

  return leads;
}

/**
 * Export leads to CSV format
 * @param {Array} leads - Array of leads to export
 * @returns {string} - CSV string
 */
export function exportToCSV(leads) {
  if (!leads.length) return '';

  const headers = [
    'ID',
    'Date',
    'First Name',
    'Email',
    'Phone',
    'Budget Score',
    'Timeline Score',
    'Lead Temperature',
    'Property Type',
    'Budget Range',
    'Neighborhood Match'
  ];

  const rows = leads.map((lead) => [
    lead.id,
    new Date(lead.timestamp).toLocaleDateString(),
    lead.contact.firstName,
    lead.contact.email,
    lead.contact.phone,
    lead.scores.budgetScore,
    lead.scores.timelineScore,
    lead.scores.leadTemperature,
    lead.scores.propertyType,
    lead.scores.budgetRange,
    lead.neighborhoodMatch
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 * @param {Array} leads - Leads to export
 * @param {string} filename - Output filename
 */
export function downloadCSV(leads, filename = 'phoenix_quiz_leads.csv') {
  const csv = exportToCSV(leads);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Get lead statistics
 * @returns {Object} - Statistics object
 */
export function getLeadStats() {
  const leads = getLeads();

  if (!leads.length) {
    return {
      total: 0,
      byTemperature: { cold: 0, warm: 0, hot: 0, 'on-fire': 0 },
      byNeighborhood: {},
      averageBudgetScore: 0,
      averageTimelineScore: 0
    };
  }

  const byTemperature = leads.reduce((acc, lead) => {
    const temp = lead.scores.leadTemperature;
    acc[temp] = (acc[temp] || 0) + 1;
    return acc;
  }, { cold: 0, warm: 0, hot: 0, 'on-fire': 0 });

  const byNeighborhood = leads.reduce((acc, lead) => {
    const hood = lead.neighborhoodMatch;
    acc[hood] = (acc[hood] || 0) + 1;
    return acc;
  }, {});

  const avgBudget = leads.reduce((sum, lead) => sum + lead.scores.budgetScore, 0) / leads.length;
  const avgTimeline = leads.reduce((sum, lead) => sum + lead.scores.timelineScore, 0) / leads.length;

  return {
    total: leads.length,
    byTemperature,
    byNeighborhood,
    averageBudgetScore: Math.round(avgBudget * 10) / 10,
    averageTimelineScore: Math.round(avgTimeline * 10) / 10
  };
}

export default {
  getLeads,
  saveLead,
  getLeadById,
  deleteLead,
  filterLeads,
  exportToCSV,
  downloadCSV,
  getLeadStats
};
