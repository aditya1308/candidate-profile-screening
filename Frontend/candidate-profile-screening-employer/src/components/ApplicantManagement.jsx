import { useState, useEffect } from 'react';
import { Check, X, Eye, Download, Phone, Mail, Calendar, Star, User, FileText, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { candidateService } from '../services/candidateService';

const ApplicantManagement = ({ jobId }) => {
  const [activeTab, setActiveTab] = useState('applied');
  const [candidates, setCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());

  useEffect(() => {
    fetchCandidates();
  }, [jobId]);

  useEffect(() => {
    if (allCandidates.length > 0) {
      const filteredCandidates = filterCandidatesByTab(allCandidates, activeTab);
      setCandidates(filteredCandidates);
    }
  }, [activeTab, allCandidates]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all candidates for this job from backend
      const allCandidatesData = await candidateService.getCandidatesByJobId(jobId);
      setAllCandidates(allCandidatesData);
      
      // Filter candidates based on active tab
      const filteredCandidates = filterCandidatesByTab(allCandidatesData, activeTab);
      setCandidates(filteredCandidates);
    } catch (err) {
      setError(err.message || 'Failed to fetch candidates');
      console.error('Error fetching candidates:', err);
      setCandidates([]);
      setAllCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidatesByTab = (candidates, tabId) => {
    switch (tabId) {
      case 'applied':
        return candidates.filter(c => c.status === 'IN_PROCESS');
      case 'round1':
        return candidates.filter(c => c.status === 'IN_PROCESS_ROUND1');
      case 'round2':
        return candidates.filter(c => c.status === 'IN_PROCESS_ROUND2');
      case 'round3':
        return candidates.filter(c => c.status === 'IN_PROCESS_ROUND3');
      case 'onhold':
        return candidates.filter(c => c.status === 'ON_HOLD');
      case 'hired':
        return candidates.filter(c => c.status === 'SELECTED');
      case 'rejected':
        return candidates.filter(c => c.status === 'REJECTED');
      default:
        return [];
    }
  };

  const handleStatusUpdate = async (candidateId, newStatus) => {
    try {
      await candidateService.updateCandidateStatus(candidateId, newStatus);
      
      // Update both local candidates and allCandidates state
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status: newStatus }
            : candidate
        )
      );
      
      setAllCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status: newStatus }
            : candidate
        )
      );
    } catch (err) {
      console.error('Error updating candidate status:', err);
      alert(`Failed to update candidate status: ${err.message}`);
    }
  };

  const openResumeModal = (fileData, candidateName) => {
    setSelectedResume({ fileData, candidateName });
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setShowResumeModal(false);
    setSelectedResume(null);
  };

  const downloadResume = (fileData, candidateName) => {
    try {
      const byteCharacters = atob(fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${candidateName}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume');
    }
  };

  const toggleCardExpansion = (candidateId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 9.0) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 8.0) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 7.0) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const tabs = [
    { id: 'applied', label: 'Applied', status: 'IN_PROCESS', count: allCandidates.filter(c => c.status === 'IN_PROCESS').length },
    { id: 'round1', label: 'Round 1', status: 'IN_PROCESS_ROUND1', count: allCandidates.filter(c => c.status === 'IN_PROCESS_ROUND1').length },
    { id: 'round2', label: 'Round 2', status: 'IN_PROCESS_ROUND2', count: allCandidates.filter(c => c.status === 'IN_PROCESS_ROUND2').length },
    { id: 'round3', label: 'Round 3', status: 'IN_PROCESS_ROUND3', count: allCandidates.filter(c => c.status === 'IN_PROCESS_ROUND3').length },
    { id: 'onhold', label: 'On Hold', status: 'ON_HOLD', count: allCandidates.filter(c => c.status === 'ON_HOLD').length },
    { id: 'hired', label: 'Hired', status: 'SELECTED', count: allCandidates.filter(c => c.status === 'SELECTED').length },
    { id: 'rejected', label: 'Rejected', status: 'REJECTED', count: allCandidates.filter(c => c.status === 'REJECTED').length }
  ];

  const renderCandidateCard = (candidate) => {
    const isExpanded = expandedCards.has(candidate.id);
    
    return (
      <div key={candidate.id} className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
        {/* Card Header */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sg-red to-red-600">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{candidate.name}</h3>
                <div className="flex items-center mt-1 space-x-3 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    <span className="truncate">{candidate.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {candidate.phoneNumber}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(candidate.dateOfBirth)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Score and Actions */}
            <div className="flex items-center ml-3 space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(candidate.score)}`}>
                <Star className="w-3 h-3 mr-1" />
                {candidate.score}/10
              </span>
              <div className="flex items-center text-xs text-gray-600">
                <Tag className="w-3 h-3 mr-1" />
                {candidate.matchedSkills?.length || 0}
              </div>
              <div className="flex items-center ml-2 space-x-1">
                <button
                  onClick={() => openResumeModal(candidate.fileData, candidate.name)}
                  className="flex items-center px-2 py-1 text-xs text-blue-600 transition-colors duration-200 rounded hover:text-blue-800 hover:bg-blue-50"
                  title="Preview Resume"
                >
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  onClick={() => downloadResume(candidate.fileData, candidate.name)}
                  className="flex items-center px-2 py-1 text-xs text-green-600 transition-colors duration-200 rounded hover:text-green-800 hover:bg-green-50"
                  title="Download Resume"
                >
                  <Download className="w-3 h-3" />
                </button>
                <button
                  onClick={() => toggleCardExpansion(candidate.id)}
                  className="flex items-center px-2 py-1 text-xs text-gray-600 transition-colors duration-200 rounded hover:text-gray-800 hover:bg-gray-50"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-100 bg-gray-50">
            <div className="p-4 space-y-4">
              {/* Summary */}
              <div>
                <h4 className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Summary
                </h4>
                <p className="p-3 text-sm leading-relaxed text-gray-600 bg-white border rounded">
                  {candidate.summary || 'No summary available'}
                </p>
              </div>

              {/* Matched Skills */}
              <div>
                <h4 className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                  <Tag className="w-4 h-4 mr-2" />
                  Matched Skills ({candidate.matchedSkills?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.matchedSkills?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sg-red bg-opacity-10 text-sg-red border border-sg-red border-opacity-20"
                    >
                      {skill}
                    </span>
                  )) || <span className="text-sm text-gray-500">No skills data available</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end pt-3 space-x-2 border-t border-gray-200">
                {activeTab === 'applied' && (
                  <>
                                         <button
                       onClick={() => handleStatusUpdate(candidate.id, 'IN_PROCESS_ROUND1')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded hover:bg-green-700"
                     >
                       <Check className="w-4 h-4 mr-1" />
                       Select for Round 1
                     </button>
                     <button
                       onClick={() => handleStatusUpdate(candidate.id, 'REJECTED')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded hover:bg-red-700"
                     >
                       <X className="w-4 h-4 mr-1" />
                       Reject
                     </button>
                  </>
                )}
                {activeTab === 'round1' && (
                  <>
                                         <button
                       onClick={() => handleStatusUpdate(candidate.id, 'IN_PROCESS_ROUND2')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded hover:bg-green-700"
                     >
                       <Check className="w-4 h-4 mr-1" />
                       Select for Round 2
                     </button>
                     <button
                       onClick={() => handleStatusUpdate(candidate.id, 'ON_HOLD')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-yellow-600 rounded hover:bg-yellow-700"
                     >
                       ⏸ Put on Hold
                     </button>
                     <button
                       onClick={() => handleStatusUpdate(candidate.id, 'REJECTED')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded hover:bg-red-700"
                     >
                       <X className="w-4 h-4 mr-1" />
                       Reject
                     </button>
                  </>
                )}
                {activeTab === 'round2' && (
                  <>
                                         <button
                       onClick={() => handleStatusUpdate(candidate.id, 'IN_PROCESS_ROUND3')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded hover:bg-green-700"
                     >
                       <Check className="w-4 h-4 mr-1" />
                       Select for Round 3
                     </button>
                     <button
                       onClick={() => handleStatusUpdate(candidate.id, 'ON_HOLD')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-yellow-600 rounded hover:bg-yellow-700"
                     >
                       ⏸ Put on Hold
                     </button>
                     <button
                       onClick={() => handleStatusUpdate(candidate.id, 'REJECTED')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded hover:bg-red-700"
                     >
                       <X className="w-4 h-4 mr-1" />
                       Reject
                     </button>
                  </>
                )}
                {activeTab === 'round3' && (
                  <>
                                         <button
                       onClick={() => handleStatusUpdate(candidate.id, 'SELECTED')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded hover:bg-green-700"
                     >
                       <Check className="w-4 h-4 mr-1" />
                       Hire Candidate
                     </button>
                     <button
                       onClick={() => handleStatusUpdate(candidate.id, 'ON_HOLD')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-yellow-600 rounded hover:bg-yellow-700"
                     >
                       ⏸ Put on Hold
                     </button>
                     <button
                       onClick={() => handleStatusUpdate(candidate.id, 'REJECTED')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded hover:bg-red-700"
                     >
                       <X className="w-4 h-4 mr-1" />
                       Reject
                     </button>
                  </>
                )}
                {activeTab === 'onhold' && (
                  <>
                                         <button
                       onClick={() => handleStatusUpdate(candidate.id, 'IN_PROCESS_ROUND1')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded hover:bg-green-700"
                     >
                       <Check className="w-4 h-4 mr-1" />
                       Move to Round 1
                     </button>
                     <button
                       onClick={() => handleStatusUpdate(candidate.id, 'REJECTED')}
                       className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded hover:bg-red-700"
                     >
                       <X className="w-4 h-4 mr-1" />
                       Reject
                     </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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
      {/* Enhanced Navigation Tabs with 7 tabs */}
      <div className="w-full">
        <div className="relative p-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Animated Background Slider */}
          <div 
            className="absolute transition-all duration-500 ease-out rounded-md top-1 bottom-1 bg-sg-red"
            style={{
              width: 'calc(14.285% - 0.125rem)',
              left: `calc(${tabs.findIndex(tab => tab.id === activeTab) * 14.285}% + 0.125rem)`
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
                } flex-1 py-4 px-1 rounded-md font-semibold text-xs transition-all duration-300 ease-out flex items-center justify-center space-x-1 relative z-10 hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span className="transition-all duration-300">{tab.label}</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
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



             {/* Candidate Cards Grid */}
       <div className="space-y-3">
                 {candidates.length === 0 ? (
           <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full">
               <User className="w-6 h-6 text-gray-400" />
             </div>
             <h3 className="mb-1 text-base font-medium text-gray-900">No candidates found</h3>
             <p className="text-sm text-gray-600">There are no candidates in the {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} stage.</p>
           </div>
        ) : (
          candidates.map(renderCandidateCard)
        )}
      </div>

      {/* Resume Preview Modal */}
      {showResumeModal && selectedResume && (
        <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
          <div className="relative w-11/12 p-5 mx-auto bg-white border rounded-md shadow-lg top-20 md:w-3/4 lg:w-1/2">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Resume Preview - {selectedResume.candidateName}</h3>
                <button
                  onClick={closeResumeModal}
                  className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium text-gray-600">Resume Preview</p>
                  <button
                    onClick={() => downloadResume(selectedResume.fileData, selectedResume.candidateName)}
                    className="flex items-center px-3 py-1 text-sm text-white transition-colors duration-200 rounded bg-sg-red hover:bg-sg-red-dark"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
                <div className="bg-white p-4 rounded border min-h-[400px]">
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="mb-2 text-lg font-medium text-gray-900">PDF Preview</h4>
                    <p className="mb-4 text-sm text-gray-600">
                      PDF preview functionality will be implemented here.
                      <br />
                      For now, you can download the resume using the button above.
                    </p>
                    <div className="text-xs text-gray-500">
                      File: {selectedResume.candidateName}_resume.pdf
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
