import { useState, useEffect } from 'react';
import { getLeads, filterLeads, downloadCSV, getLeadStats, deleteLead } from '../utils/storage';
import { neighborhoods } from '../data/neighborhoods';

function AdminDashboard({ onBack }) {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    temperature: '',
    neighborhood: '',
    startDate: '',
    endDate: ''
  });
  const [selectedLead, setSelectedLead] = useState(null);

  // Load leads and stats
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLeads(getLeads());
    setStats(getLeadStats());
  };

  // Apply filters
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Filter only non-empty values
    const activeFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '')
    );

    if (Object.keys(activeFilters).length > 0) {
      setLeads(filterLeads(activeFilters));
    } else {
      setLeads(getLeads());
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      temperature: '',
      neighborhood: '',
      startDate: '',
      endDate: ''
    });
    setLeads(getLeads());
  };

  // Export to CSV
  const handleExport = () => {
    downloadCSV(leads, `phoenix_leads_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Delete lead
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
      loadData();
      setSelectedLead(null);
    }
  };

  // Temperature badge colors
  const tempColors = {
    'cold': 'bg-blue-100 text-blue-800',
    'warm': 'bg-yellow-100 text-yellow-800',
    'hot': 'bg-orange-100 text-orange-800',
    'on-fire': 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sand-dark">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-sand-light rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-navy">Lead Dashboard</h1>
              <p className="text-sm text-navy/60">Phoenix Neighborhood Quiz</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={leads.length === 0}
            className="px-4 py-2 bg-sage text-white font-medium rounded-lg hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-navy/60">Total Leads</p>
              <p className="text-3xl font-bold text-navy">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-navy/60">Hot Leads</p>
              <p className="text-3xl font-bold text-orange-500">
                {(stats.byTemperature.hot || 0) + (stats.byTemperature['on-fire'] || 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-navy/60">Avg Budget Score</p>
              <p className="text-3xl font-bold text-sage">{stats.averageBudgetScore}/5</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-navy/60">Avg Timeline Score</p>
              <p className="text-3xl font-bold text-terracotta">{stats.averageTimelineScore}/5</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs text-navy/60 mb-1">Temperature</label>
              <select
                value={filters.temperature}
                onChange={(e) => handleFilterChange('temperature', e.target.value)}
                className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white text-navy text-sm"
              >
                <option value="">All</option>
                <option value="cold">Cold</option>
                <option value="warm">Warm</option>
                <option value="hot">Hot</option>
                <option value="on-fire">On Fire</option>
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs text-navy/60 mb-1">Neighborhood</label>
              <select
                value={filters.neighborhood}
                onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white text-navy text-sm"
              >
                <option value="">All</option>
                {Object.values(neighborhoods).map((n) => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs text-navy/60 mb-1">From Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white text-navy text-sm"
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs text-navy/60 mb-1">To Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-sand-dark rounded-lg bg-white text-navy text-sm"
              />
            </div>

            <button
              onClick={resetFilters}
              className="px-4 py-2 text-navy/60 hover:text-navy text-sm transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {leads.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-4xl mb-4 block">📭</span>
              <h3 className="text-lg font-medium text-navy mb-2">No leads yet</h3>
              <p className="text-navy/60">Complete the quiz to generate leads</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sand-light border-b border-sand-dark">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-navy/70">Date</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-navy/70">Name</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-navy/70">Email</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-navy/70">Phone</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-navy/70">Temp</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-navy/70">Budget</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-navy/70">Match</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-navy/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-dark">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-sand-light/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-navy/80">
                        {new Date(lead.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-navy">
                        {lead.contact.firstName}
                      </td>
                      <td className="px-4 py-3 text-sm text-navy/80">
                        {lead.contact.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-navy/80">
                        {lead.contact.phone || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${tempColors[lead.scores.leadTemperature]}`}>
                          {lead.scores.leadTemperature}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-navy/80">
                        {lead.scores.budgetRange}
                      </td>
                      <td className="px-4 py-3 text-sm text-navy/80">
                        {neighborhoods[lead.neighborhoodMatch]?.name || lead.neighborhoodMatch}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1 text-navy/40 hover:text-navy transition-colors"
                            title="View details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-1 text-navy/40 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-navy">Lead Details</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-sand-light rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Contact Info */}
                <div className="bg-sand-light rounded-lg p-4">
                  <h4 className="font-semibold text-navy mb-2">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-navy/60">Name:</span> {selectedLead.contact.firstName}</p>
                    <p><span className="text-navy/60">Email:</span> {selectedLead.contact.email}</p>
                    <p><span className="text-navy/60">Phone:</span> {selectedLead.contact.phone || 'Not provided'}</p>
                  </div>
                </div>

                {/* Scores */}
                <div className="bg-sand-light rounded-lg p-4">
                  <h4 className="font-semibold text-navy mb-2">Lead Scores</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><span className="text-navy/60">Budget Score:</span> {selectedLead.scores.budgetScore}/5</p>
                    <p><span className="text-navy/60">Timeline Score:</span> {selectedLead.scores.timelineScore}/5</p>
                    <p><span className="text-navy/60">Temperature:</span> {selectedLead.scores.leadTemperature}</p>
                    <p><span className="text-navy/60">Property Type:</span> {selectedLead.scores.propertyType}</p>
                    <p className="col-span-2"><span className="text-navy/60">Budget Range:</span> {selectedLead.scores.budgetRange}</p>
                  </div>
                </div>

                {/* Neighborhood Match */}
                <div className="bg-sand-light rounded-lg p-4">
                  <h4 className="font-semibold text-navy mb-2">Neighborhood Match</h4>
                  <p className="text-lg font-medium" style={{ color: neighborhoods[selectedLead.neighborhoodMatch]?.color }}>
                    {neighborhoods[selectedLead.neighborhoodMatch]?.name || selectedLead.neighborhoodMatch}
                  </p>
                </div>

                {/* Quiz Answers */}
                <div className="bg-sand-light rounded-lg p-4">
                  <h4 className="font-semibold text-navy mb-2">Quiz Answers</h4>
                  <div className="space-y-2 text-sm">
                    {selectedLead.answers.map((answer, idx) => (
                      <p key={idx}>
                        <span className="text-navy/60">Q{answer.questionId}:</span> {answer.answerText}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                <div className="text-xs text-navy/40">
                  <p>Lead ID: {selectedLead.id}</p>
                  <p>Submitted: {new Date(selectedLead.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
