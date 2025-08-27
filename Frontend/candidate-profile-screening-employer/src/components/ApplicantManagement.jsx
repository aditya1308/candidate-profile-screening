import { useState, useEffect } from 'react';
import { Check, X, Eye, Download } from 'lucide-react';
import { candidateService } from '../services/candidateService';
import { fileUtils, stringUtils } from '../services/utilityService';

const ApplicantManagement = ({ jobId }) => {
  const [activeTab, setActiveTab] = useState('applied');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, [jobId, activeTab]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For Table 1 (Applied candidates) - Real data from backend
      if (activeTab === 'applied') {
        const data = await candidateService.getCandidatesByJob();
        setCandidates(data);
      } else {
        // For other tables - Dummy data
        const dummyCandidates = getDummyCandidatesForTab(activeTab);
        setCandidates(dummyCandidates);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch candidates');
      console.error('Error fetching candidates:', err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const getDummyCandidatesForTab = (tabId) => {
    const dummyData = {
      round1: [
        {
          id: 101,
          name: "Alice Johnson",
          email: "alice.johnson@example.com",
          phoneNumber: "+91 98765 43213",
          score: 8.8,
          status: "IN_PROCESS_ROUND1",
          resumeUrl: "path/to/resume101.pdf",
          appliedDate: "2024-01-18T11:30:00"
        },
        {
          id: 102,
          name: "Charlie Brown",
          email: "charlie.brown@example.com",
          phoneNumber: "+91 98765 43214",
          score: 9.1,
          status: "IN_PROCESS_ROUND1",
          resumeUrl: "path/to/resume102.pdf",
          appliedDate: "2024-01-17T15:20:00"
        }
      ],
      round2: [
        {
          id: 201,
          name: "David Miller",
          email: "david.miller@example.com",
          phoneNumber: "+91 98765 43215",
          score: 9.4,
          status: "IN_PROCESS_ROUND2",
          resumeUrl: "path/to/resume201.pdf",
          appliedDate: "2024-01-16T09:15:00"
        }
      ],
      round3: [
        {
          id: 301,
          name: "Emma Davis",
          email: "emma.davis@example.com",
          phoneNumber: "+91 98765 43216",
          score: 9.6,
          status: "IN_PROCESS_ROUND3",
          resumeUrl: "path/to/resume301.pdf",
          appliedDate: "2024-01-15T14:45:00"
        }
      ],
      onhold: [
        {
          id: 401,
          name: "Frank Wilson",
          email: "frank.wilson@example.com",
          phoneNumber: "+91 98765 43217",
          score: 8.2,
          status: "ON_HOLD",
          resumeUrl: "path/to/resume401.pdf",
          appliedDate: "2024-01-14T10:30:00"
        }
      ],
      rejected: [
        {
          id: 501,
          name: "Grace Lee",
          email: "grace.lee@example.com",
          phoneNumber: "+91 98765 43218",
          score: 6.5,
          status: "REJECTED",
          resumeUrl: "path/to/resume501.pdf",
          appliedDate: "2024-01-13T16:20:00"
        },
        {
          id: 502,
          name: "Henry Taylor",
          email: "henry.taylor@example.com",
          phoneNumber: "+91 98765 43219",
          score: 5.8,
          status: "REJECTED",
          resumeUrl: "path/to/resume502.pdf",
          appliedDate: "2024-01-12T11:15:00"
        }
      ]
    };
    
    return dummyData[tabId] || [];
  };

  const handleStatusUpdate = async (candidateId, newStatus) => {
    try {
      // Only implement real functionality for Table 1 (Applied candidates)
      if (activeTab === 'applied') {
        try {
          await candidateService.updateCandidateStatus(candidateId, newStatus);
          // Update local state on success
          setCandidates(prev => 
            prev.map(candidate => 
              candidate.id === candidateId 
                ? { ...candidate, status: newStatus }
                : candidate
            )
          );
        } catch (err) {
          console.error('Error updating candidate status:', err);
          // Show error to user
          alert(`Failed to update candidate status: ${err.message}`);
        }
      } else {
        // For other tables - Just mock update
        console.log(`Mock update: Candidate ${candidateId} status to ${newStatus} (Table: ${activeTab})`);
        setCandidates(prev => 
          prev.map(candidate => 
            candidate.id === candidateId 
              ? { ...candidate, status: newStatus }
              : candidate
          )
        );
      }
    } catch (err) {
      console.error('Error updating candidate status:', err);
      alert(`Failed to update candidate status: ${err.message}`);
    }
  };

  const openResumeModal = (resumeUrl) => {
    setSelectedResume(resumeUrl);
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setShowResumeModal(false);
    setSelectedResume(null);
  };

  const downloadResume = (resumeUrl, candidateName) => {
    const filename = `${candidateName}_resume.pdf`;
    fileUtils.downloadFile(resumeUrl, filename);
  };


  const tabs = [
    { id: 'applied', label: 'Applied', status: 'IN_PROCESS', count: activeTab === 'applied' ? candidates.length : 3 },
    { id: 'round1', label: 'Round 1', status: 'IN_PROCESS_ROUND1', count: activeTab === 'round1' ? candidates.length : 2 },
    { id: 'round2', label: 'Round 2', status: 'IN_PROCESS_ROUND2', count: activeTab === 'round2' ? candidates.length : 1 },
    { id: 'round3', label: 'Round 3', status: 'IN_PROCESS_ROUND3', count: activeTab === 'round3' ? candidates.length : 1 },
    { id: 'onhold', label: 'On Hold', status: 'ON_HOLD', count: activeTab === 'onhold' ? candidates.length : 1 },
    { id: 'rejected', label: 'Rejected', status: 'REJECTED', count: activeTab === 'rejected' ? candidates.length : 2 }
  ];

  const renderTable = (candidates) => {
    if (candidates.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">No candidates in this stage</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Phone
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Score
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Resume
              </th>
              {activeTab === 'applied' && (
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {candidate.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {candidate.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {candidate.phoneNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    candidate.score >= 9.0 ? 'bg-green-100 text-green-800' :
                    candidate.score >= 8.0 ? 'bg-blue-100 text-blue-800' :
                    candidate.score >= 7.0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {candidate.score}/10
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <button
                    onClick={() => openResumeModal(candidate.resumeUrl)}
                    className="flex items-center text-blue-600 hover:text-blue-900 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </button>
                </td>
                {activeTab === 'applied' && (
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex space-x-2">
                                              <button
                          onClick={() => handleStatusUpdate(candidate.id, 'IN_PROCESS_ROUND1')}
                          className="flex items-center text-green-600 hover:text-green-900 transition-colors duration-200"
                          title="Select for Round 1"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(candidate.id, 'REJECTED')}
                          className="flex items-center text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="Reject"
                        >
                          <X className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-sg-red"></div>
        <span className="ml-2 text-gray-600">Loading candidates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Navigation Tabs with Smooth Animations */}
      <div className="w-full">
        <div className="relative p-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Animated Background Slider */}
          <div 
            className="absolute top-1 bottom-1 bg-sg-red rounded-md transition-all duration-500 ease-out"
            style={{
              width: 'calc(16.67% - 0.125rem)',
              left: `calc(${tabs.findIndex(tab => tab.id === activeTab) * 16.67}% + 0.125rem)`
            }}
          />
          
          <nav className="relative flex w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                } flex-1 py-4 px-2 rounded-md font-semibold text-sm transition-all duration-300 ease-out flex items-center justify-center space-x-2 relative z-10 hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span className="transition-all duration-300">{tab.label}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-sg-red'
                    : 'bg-gray-200 text-gray-900'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {tabs.find(tab => tab.id === activeTab)?.label} Candidates
          </h3>
        </div>
        <div className="p-6">
          {renderTable(candidates)}
        </div>
      </div>

      {/* Resume Preview Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
          <div className="relative w-11/12 p-5 mx-auto bg-white border rounded-md shadow-lg top-20 md:w-3/4 lg:w-1/2">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Resume Preview</h3>
                <button
                  onClick={closeResumeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600 font-medium">Resume: {selectedResume}</p>
                  <button
                    onClick={() => downloadResume(selectedResume, 'Candidate')}
                    className="flex items-center px-3 py-1 text-sm text-white bg-sg-red rounded hover:bg-red-700 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
                <div className="bg-white p-4 rounded border min-h-[300px]">
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">PDF Preview</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      PDF preview functionality will be implemented here.
                      <br />
                      For now, you can download the resume using the button above.
                    </p>
                    <div className="text-xs text-gray-500">
                      File: {selectedResume}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantManagement;
