import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { jobService } from '../services/jobService';
import Button3D from './Button3D';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const fetchedJobs = await jobService.getAllJobs();
      setJobs(fetchedJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-sg-red"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={fetchJobs}
              className="px-4 py-2 mt-4 text-white transition-colors rounded-lg bg-sg-red hover:bg-sg-red-dark"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Job Openings Dashboard
            </h1>
            <p className="text-gray-600">
              Manage and monitor all active job postings
            </p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search jobs by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map(job => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="flex flex-col h-full p-6 transition-all duration-200 bg-white rounded-lg shadow-lg card hover:-translate-y-1 shadow-gray-400/40 hover:shadow-xl hover:shadow-gray-500/50"
            >
              <div className="flex-grow">
                <div className="mb-4">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-3 text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{job.location || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <Button3D 
                  buttonColor="bg-sg-red" 
                  shadowColor="bg-black"
                >
                  View Details
                </Button3D>
              </div>
            </Link>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
