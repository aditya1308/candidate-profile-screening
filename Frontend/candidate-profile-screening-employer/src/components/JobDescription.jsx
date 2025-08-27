const JobDescription = ({ job }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="mb-3 text-lg text-gray-600">{job.company || 'Societe Generale'}</p>
          </div>
          <div className="px-3 py-1 text-sm font-medium border rounded-full bg-sg-red/10 text-sg-red border-sg-red/20">
            {job.status || 'Active'}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{job.location || 'Not specified'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{job.type || 'Full-time'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{job.experience || 'Not specified'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{job.salary || 'Competitive'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Posted on {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Applications:</span>
            <span className="px-3 py-1 text-sm font-bold text-white bg-sg-red rounded-full">
              {job.applications || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Job Description</h2>
        <p className="mb-6 leading-relaxed text-gray-600">
          {job.description || 'No description available'}
        </p>
        
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center mb-3 font-semibold text-gray-900">
                Requirements
              </h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-sg-red"></span>
                    <span className="text-sm text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center mb-3 font-semibold text-gray-900">
                Responsibilities
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-sg-red"></span>
                    <span className="text-sm text-gray-600">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {job.department && (
          <div className="pt-6 mt-6 border-t border-gray-200">
            <h3 className="mb-2 text-sm font-medium text-gray-900">Department</h3>
            <p className="text-sm text-gray-600">{job.department}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescription;
