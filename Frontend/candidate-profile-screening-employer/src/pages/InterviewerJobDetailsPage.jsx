import { useParams } from 'react-router-dom';
import { jobOpenings } from '../../../shared/data/mockData';
import ApplicantManagement from '../components/ApplicantManagement';

const InterviewerJobDetailsPage = () => {
  const { id } = useParams();
  const jobId = parseInt(id);
  const job = jobOpenings.find(j => j.id === jobId);

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{job.title} - Candidates</h1>
        <ApplicantManagement jobId={jobId} />
      </div>
    </div>
  );
};

export default InterviewerJobDetailsPage;
