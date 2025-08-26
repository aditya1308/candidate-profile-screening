import { useState } from 'react';
import { MapPin, Clock, DollarSign, Users, Calendar } from 'lucide-react';

const JobListings = ({ jobs, onJobClick, userType = 'applicant' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || job.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(jobs.map(job => job.department))];

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

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search jobs by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => onJobClick(job)}
              className="card cursor-pointer hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{job.title}</h3>
                  <p className="text-primary-600 font-medium">{job.company}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600"><MapPin className="w-4 h-4 mr-2" /><span className="text-sm">{job.location}</span></div>
                <div className="flex items-center text-gray-600"><Clock className="w-4 h-4 mr-2" /><span className="text-sm">{job.type}</span></div>
                <div className="flex items-center text-gray-600"><DollarSign className="w-4 h-4 mr-2" /><span className="text-sm">{job.salary}</span></div>
                <div className="flex items-center text-gray-600"><Users className="w-4 h-4 mr-2" /><span className="text-sm">{job.experience}</span></div>
                <div className="flex items-center text-gray-600"><Calendar className="w-4 h-4 mr-2" /><span className="text-sm">Posted {new Date(job.postedDate).toLocaleDateString()}</span></div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3 mb-4">{job.description}</p>
              <div className="mt-4"><button className="btn-primary w-full">Apply Now</button></div>
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


