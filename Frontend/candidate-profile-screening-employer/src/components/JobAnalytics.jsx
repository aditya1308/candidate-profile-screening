import { applicants } from '../../../shared/data/mockData';

const JobAnalytics = ({ jobId }) => {
  const jobApplicants = applicants.filter(app => app.jobId === parseInt(jobId));

  const stats = {
    total: jobApplicants.length,
    resumeSelected: jobApplicants.filter(app => app.stage === 'resume_selected').length,
    round1: jobApplicants.filter(app => app.stage === 'round1').length,
    round2: jobApplicants.filter(app => app.stage === 'round2').length,
    round3: jobApplicants.filter(app => app.stage === 'round3').length,
    hiring: jobApplicants.filter(app => app.stage === 'hiring').length,
  };

  const statItems = [
    { label: 'Total Applications', value: stats.total, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Resume Selected', value: stats.resumeSelected, color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Round 1', value: stats.round1, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Round 2', value: stats.round2, color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { label: 'Round 3', value: stats.round3, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { label: 'Hiring', value: stats.hiring, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  ];

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Application Analytics</h2>
      <div className="grid grid-cols-1 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className={`flex justify-between items-center p-4 rounded-lg border ${item.color}`}>
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-lg font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobAnalytics;
