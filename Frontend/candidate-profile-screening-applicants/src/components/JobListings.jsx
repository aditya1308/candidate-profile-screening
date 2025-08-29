import { useState } from 'react';
import { MapPin } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const JobListings = ({ jobs, onJobClick, userType = 'applicant' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-sg-gray pb-16">
      <Header />
      
      <main className="pt-16">
        <div className="p-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {userType === 'applicant' ? 'Available Positions' : 'Job Openings Dashboard'}
                </h1>
                <p className="text-gray-600">
                  {userType === 'applicant' 
                    ? 'Explore exciting opportunities and find your next career move'
                    : 'Manage and monitor all active job postings'
                  }
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search jobs by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sg-red focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map(job => (
                <div
                  key={job.id}
                  className="flex flex-col h-full p-6 transition-all duration-200 bg-white rounded-lg shadow-lg card hover:-translate-y-1 shadow-gray-400/40 hover:shadow-xl hover:shadow-gray-500/50 cursor-pointer"
                  onClick={() => onJobClick(job)}
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
                    <div className="relative group">
                      {/* Shadow layer */}
                      <div 
                        className="absolute top-0 left-0 w-full h-full bg-black transition-all duration-200 group-hover:opacity-0"
                        style={{ transform: 'translate(4px, 4px)' }}
                      />
                      
                      {/* Button layer */}
                      <button 
                        className="relative w-full py-4 px-6 text-white font-semibold bg-sg-red hover:bg-sg-red/90 transition-all duration-200 transform group-hover:translate-x-1 group-hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sg-red"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-500">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobListings;


