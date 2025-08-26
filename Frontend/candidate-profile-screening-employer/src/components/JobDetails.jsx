import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Users, Calendar, TrendingUp, FileText } from 'lucide-react';

const JobDetails = ({ job, onBack }) => {
  const [expandedSections, setExpandedSections] = useState({
    applications: true,
    requirements: true,
    responsibilities: true,
    analytics: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock data for applications
  const mockApplications = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      appliedDate: "2024-01-20",
      status: "Under Review",
      experience: "4 years",
      skills: ["React", "JavaScript", "CSS", "HTML"]
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      appliedDate: "2024-01-19",
      status: "Shortlisted",
      experience: "3 years",
      skills: ["Vue.js", "TypeScript", "SCSS", "Webpack"]
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      appliedDate: "2024-01-18",
      status: "Rejected",
      experience: "2 years",
      skills: ["Angular", "JavaScript", "CSS"]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-xl text-gray-600 mb-4">{job.company}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span>{job.type}</span>
                  <span>•</span>
                  <span>{job.experience}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600 mb-2">{job.salary}</div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-6">
          {/* Applications Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection('applications')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Applications ({mockApplications.length})</h2>
              </div>
              {expandedSections.applications ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.applications && (
              <div className="px-6 pb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Applicant</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Applied Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Experience</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Skills</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockApplications.map((app) => (
                        <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{app.name}</div>
                              <div className="text-sm text-gray-500">{app.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{app.experience}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {app.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Requirements Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection('requirements')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
              </div>
              {expandedSections.requirements ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.requirements && (
              <div className="px-6 pb-6">
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Responsibilities Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection('responsibilities')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Responsibilities</h2>
              </div>
              {expandedSections.responsibilities ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.responsibilities && (
              <div className="px-6 pb-6">
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Analytics Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection('analytics')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Analytics & Insights</h2>
              </div>
              {expandedSections.analytics ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.analytics && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{job.applications}</div>
                    <div className="text-sm text-blue-600">Total Applications</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-green-600">Shortlisted</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-600">8</div>
                    <div className="text-sm text-yellow-600">Under Review</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    Detailed analytics and insights will be implemented based on ongoing discussions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
