import { useState } from 'react';
import { MapPin } from 'lucide-react';

const JobListings = ({ jobs, onJobClick, userType = 'applicant' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

    return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {userType === 'applicant' ? 'Available Positions' : 'Job Openings Dashboard'}
          </h1>
          <p className="text-gray-600">
            {userType === 'applicant' 
              ? 'Explore exciting opportunities and find your next career move'
              : 'Manage and monitor all active job postings'
            }
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search jobs by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className="card hover:-translate-y-1"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{job.title}</h3>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{job.location}</span>
                </div>
              </div>

              <div className="mt-4">
                <button 
                  onClick={() => onJobClick(job)}
                  className="btn-primary w-full"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;


