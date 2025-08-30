import InterviewerCandidateManagement from '../components/InterviewerCandidateManagement';

const InterviewerDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
          <p className="mt-2 text-gray-600">
            Manage your pending and completed interviews
          </p>
        </div>
        
        <InterviewerCandidateManagement />
      </div>
    </div>
  );
};

export default InterviewerDashboardPage;
