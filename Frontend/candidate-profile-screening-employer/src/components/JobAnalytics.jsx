import { useState, useEffect, useCallback } from 'react';
import { candidateService } from '../services/candidateService';

const JobAnalytics = ({ jobId }) => {
  const [stats, setStats] = useState({
    total: 0,
    inProcess: 0,
    inProcessRound1: 0,
    inProcessRound2: 0,
    inProcessRound3: 0,
    onHold: 0,
    rejected: 0,
    selected: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      
      const candidates = await candidateService.getCandidatesByJobId(jobId);
      
      // Calculate statistics based on candidate status
      const newStats = {
        total: candidates.length,
        inProcess: candidates.filter(c => c.status === 'IN_PROCESS').length,
        inProcessRound1: candidates.filter(c => c.status === 'IN_PROCESS_ROUND1').length,
        inProcessRound2: candidates.filter(c => c.status === 'IN_PROCESS_ROUND2').length,
        inProcessRound3: candidates.filter(c => c.status === 'IN_PROCESS_ROUND3').length,
        onHold: candidates.filter(c => c.status === 'ON_HOLD').length,
        rejected: candidates.filter(c => c.status === 'REJECTED').length,
        selected: candidates.filter(c => c.status === 'SELECTED').length
      };
      
      setStats(newStats);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Instead of showing error, set all stats to 0 to show empty state
      setStats({
        total: 0,
        inProcess: 0,
        inProcessRound1: 0,
        inProcessRound2: 0,
        inProcessRound3: 0,
        onHold: 0,
        rejected: 0,
        selected: 0
      });
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const statItems = [
    { label: 'Resume Under Review', value: stats.inProcess, percentage: stats.total > 0 ? (stats.inProcess / stats.total * 100).toFixed(1) : 0, color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700' },
    { label: 'Round 1', value: stats.inProcessRound1, percentage: stats.total > 0 ? (stats.inProcessRound1 / stats.total * 100).toFixed(1) : 0, color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
    { label: 'Round 2', value: stats.inProcessRound2, percentage: stats.total > 0 ? (stats.inProcessRound2 / stats.total * 100).toFixed(1) : 0, color: 'bg-orange-500', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
    { label: 'Round 3', value: stats.inProcessRound3, percentage: stats.total > 0 ? (stats.inProcessRound3 / stats.total * 100).toFixed(1) : 0, color: 'bg-indigo-500', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
    { label: 'Shortlisted', value: stats.onHold, percentage: stats.total > 0 ? (stats.onHold / stats.total * 100).toFixed(1) : 0, color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
    { label: 'Selected', value: stats.selected, percentage: stats.total > 0 ? (stats.selected / stats.total * 100).toFixed(1) : 0, color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { label: 'Rejected', value: stats.rejected, percentage: stats.total > 0 ? (stats.rejected / stats.total * 100).toFixed(1) : 0, color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' }
  ];

  if (loading) {
    return (
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Application Analytics</h2>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-b-2 rounded-full animate-spin border-sg-red"></div>
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }



  return (
    <div className="p-6 transition-all duration-300 ease-in-out bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 animate-pulse">Application Analytics</h2>
        <div className="text-right transition-transform duration-200 transform hover:scale-105">
          <div className="text-2xl font-bold text-gray-900 animate-bounce">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Applications</div>
        </div>
      </div>
      
      <div className="space-y-4">
        {statItems.map((item, index) => (
          <div 
            key={index} 
            className="p-3 space-y-2 transition-all duration-300 ease-in-out transform rounded-lg hover:scale-105 hover:bg-gray-50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900">{item.label}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900 animate-pulse">{item.value}</span>
                <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full animate-pulse">({item.percentage}%)</span>
              </div>
            </div>
            <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${item.color} transform origin-left`}
                style={{ 
                  width: `${item.percentage}%`,
                  animation: `slideIn 1s ease-out ${index * 0.1}s both`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default JobAnalytics;
