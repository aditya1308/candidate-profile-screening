import { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import Filters from './Filters';

const JobListings = ({ jobs = [], onJobClick, userType = 'applicant' }) => {
  const [filters, setFilters] = useState({ skills: [], locations: [], titles: [] });

  const filteredJobs = useMemo(() => {
    const normalize = (value) => (value || '').toLowerCase().trim();

    const selectedTitles = (filters.titles || []).map(normalize);
    const selectedLocations = (filters.locations || []).map(normalize);
    const selectedSkills = (filters.skills || []).map(normalize);

    const hasAnyFilter = selectedTitles.length > 0 || selectedLocations.length > 0 || selectedSkills.length > 0;
    if (!hasAnyFilter) return jobs;

    return jobs.filter((job) => {
      if (selectedTitles.length > 0 && !selectedTitles.includes(normalize(job.title))) {
        return false;
      }

      if (selectedLocations.length > 0 && !selectedLocations.includes(normalize(job.location))) {
        return false;
      }

      if (selectedSkills.length > 0) {
        const jobSkills = (job.requiredSkills || '')
          .split(/[,\n]+/)
          .map(normalize)
          .filter(Boolean);

        const anySkillPresent = selectedSkills.some((skill) => jobSkills.includes(skill));
        if (!anySkillPresent) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, filters]);

  return (
    <div className="min-h-screen bg-sg-gray pb-16">
      <Header />
      
      <main className="pt-16">
        <div className="p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
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
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <Filters jobs={jobs} filters={filters} onChange={setFilters} />
              </div>

              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="card flex h-full cursor-pointer flex-col rounded-lg bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 shadow-gray-400/40 hover:shadow-xl hover:shadow-gray-500/50"
                      onClick={() => onJobClick(job)}
                    >
                      <div className="flex-grow">
                        <div className="mb-4">
                          <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900">{job.title}</h3>
                        </div>

                        <div className="mb-4">
                          <div className="mb-3 flex items-center text-gray-600">
                            <MapPin className="mr-2 h-4 w-4" />
                            <span className="text-sm">{job.location || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-4">
                        <div className="group relative">
                          <div
                            className="absolute left-0 top-0 h-full w-full bg-black transition-all duration-200 group-hover:opacity-0"
                            style={{ transform: 'translate(4px, 4px)' }}
                          />

                          <button className="relative w-full transform bg-sg-red px-6 py-4 font-semibold text-white transition-all duration-200 hover:bg-sg-red/90 group-hover:translate-x-1 group-hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-sg-red focus:ring-offset-2">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobListings;