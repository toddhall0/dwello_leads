// Storage Utilities for Lead Data (Supabase + localStorage fallback)

import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'phoenix_quiz_leads';
const TABLE_NAME = 'leads';

// ============ Supabase Functions ============

/**
 * Get all leads from Supabase
 * @returns {Promise<Array>} - Array of lead objects
 */
async function getLeadsFromSupabase() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads from Supabase:', error);
    throw error;
  }

  // Transform Supabase format to app format
  return data.map(transformFromSupabase);
}

/**
 * Save a lead to Supabase
 * @param {Object} lead - Lead data object
 * @returns {Promise<Object>} - Saved lead
 */
async function saveLeadToSupabase(lead) {
  const supabaseData = transformToSupabase(lead);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([supabaseData])
    .select()
    .single();

  if (error) {
    console.error('Error saving lead to Supabase:', error);
    throw error;
  }

  return transformFromSupabase(data);
}

/**
 * Delete a lead from Supabase
 * @param {string} id - Lead ID
 * @returns {Promise<boolean>} - Success status
 */
async function deleteLeadFromSupabase(id) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lead from Supabase:', error);
    throw error;
  }

  return true;
}

/**
 * Filter leads from Supabase
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} - Filtered leads
 */
async function filterLeadsFromSupabase(filters = {}) {
  let query = supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.temperature) {
    query = query.eq('lead_temperature', filters.temperature);
  }

  if (filters.neighborhood) {
    query = query.eq('neighborhood_match', filters.neighborhood);
  }

  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate);
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    endDate.setHours(23, 59, 59, 999);
    query = query.lte('created_at', endDate.toISOString());
  }

  if (filters.minBudgetScore) {
    query = query.gte('budget_score', filters.minBudgetScore);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error filtering leads from Supabase:', error);
    throw error;
  }

  return data.map(transformFromSupabase);
}

// ============ Transform Functions ============

/**
 * Transform app lead format to Supabase format
 */
function transformToSupabase(lead) {
  return {
    id: lead.id,
    first_name: lead.contact.firstName,
    email: lead.contact.email,
    phone: lead.contact.phone || null,
    budget_score: lead.scores.budgetScore,
    timeline_score: lead.scores.timelineScore,
    lead_temperature: lead.scores.leadTemperature,
    property_type: lead.scores.propertyType,
    budget_range: lead.scores.budgetRange,
    neighborhood_match: lead.neighborhoodMatch,
    answers: lead.answers,
    metadata: lead.metadata,
    created_at: lead.timestamp
  };
}

/**
 * Transform Supabase format to app format
 */
function transformFromSupabase(row) {
  return {
    id: row.id,
    timestamp: row.created_at,
    contact: {
      firstName: row.first_name,
      email: row.email,
      phone: row.phone || ''
    },
    scores: {
      budgetScore: row.budget_score,
      timelineScore: row.timeline_score,
      leadTemperature: row.lead_temperature,
      propertyType: row.property_type,
      budgetRange: row.budget_range
    },
    neighborhoodMatch: row.neighborhood_match,
    answers: row.answers || [],
    metadata: row.metadata || {}
  };
}

// ============ localStorage Functions ============

function getLeadsFromLocal() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading leads from localStorage:', error);
    return [];
  }
}

function saveLeadToLocal(lead) {
  try {
    const leads = getLeadsFromLocal();
    leads.unshift(lead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    return lead;
  } catch (error) {
    console.error('Error saving lead to localStorage:', error);
    throw error;
  }
}

function deleteLeadFromLocal(id) {
  try {
    const leads = getLeadsFromLocal();
    const filtered = leads.filter((lead) => lead.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting lead from localStorage:', error);
    return false;
  }
}

function filterLeadsFromLocal(filters = {}) {
  let leads = getLeadsFromLocal();

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

// ============ Exported Functions (Auto-select storage) ============

/**
 * Get all leads
 * @returns {Promise<Array>} - Array of lead objects
 */
export async function getLeads() {
  if (isSupabaseConfigured()) {
    return getLeadsFromSupabase();
  }
  return getLeadsFromLocal();
}

/**
 * Save a new lead
 * @param {Object} lead - Lead data object
 * @returns {Promise<Object>} - Saved lead
 */
export async function saveLead(lead) {
  if (isSupabaseConfigured()) {
    return saveLeadToSupabase(lead);
  }
  return saveLeadToLocal(lead);
}

/**
 * Get a single lead by ID
 * @param {string} id - Lead ID
 * @returns {Promise<Object|null>} - Lead object or null
 */
export async function getLeadById(id) {
  const leads = await getLeads();
  return leads.find((lead) => lead.id === id) || null;
}

/**
 * Delete a lead by ID
 * @param {string} id - Lead ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteLead(id) {
  if (isSupabaseConfigured()) {
    return deleteLeadFromSupabase(id);
  }
  return deleteLeadFromLocal(id);
}

/**
 * Filter leads by criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} - Filtered leads
 */
export async function filterLeads(filters = {}) {
  if (isSupabaseConfigured()) {
    return filterLeadsFromSupabase(filters);
  }
  return filterLeadsFromLocal(filters);
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

  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get lead statistics
 * @returns {Promise<Object>} - Statistics object
 */
export async function getLeadStats() {
  const leads = await getLeads();

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

/**
 * Check if using Supabase
 * @returns {boolean}
 */
export function isUsingSupabase() {
  return isSupabaseConfigured();
}

export default {
  getLeads,
  saveLead,
  getLeadById,
  deleteLead,
  filterLeads,
  exportToCSV,
  downloadCSV,
  getLeadStats,
  isUsingSupabase
};
