import { useState, useEffect, useCallback } from "react";
import TabNavigation from "./TabNavigation";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ToastNotification from "./ToastNotification";
import ResumeModal from "./ResumeModal";
import Button3D from "./Button3D";
import useToast from "../hooks/useToast";
import { interviewService } from "../services/interviewService";
import { 
  downloadResume, 
  copyToClipboard,
  formatDate
} from "../utils/candidateUtils";
import { 
  User, 
  Phone, 
  Calendar, 
  Tag, 
  Eye, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Copy
} from 'lucide-react';

const InterviewerCandidateManagement = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [candidates, setCandidates] = useState([]);
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [completedCandidates, setCompletedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [feedbackInputs, setFeedbackInputs] = useState({});
  
  const { showToast, toastMessage, toastType, showToastMessage } = useToast();

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both pending and completed interviews
      const [pendingData, completedData] = await Promise.all([
        interviewService.getPendingInterviews(),
        interviewService.getCompletedInterviews()
      ]);

      // Transform the data to match our component's expected format
      const transformCandidateData = (interviewData, status) => {
        console.log(`Transforming ${status} interviews:`, interviewData);
        
                 return interviewData.map(interview => {
           const transformed = {
             id: interview.interviewId,
             name: interview.candidate?.name || 'Unknown Candidate',
             email: interview.candidate?.email || '',
             phone: interview.candidate?.phoneNumber || '',
             status: status,
             matchedSkills: interview.candidate?.matchedSkills || [],
             summary: interview.candidate?.summary || '',
             resumeData: interview.candidate?.fileData || null,
             appliedDate: new Date().toISOString(), // This will be populated from jobApplication if available
             feedback: interview.feedback || '',
             jobTitle: interview.jobApplication?.jobTitle || '',
             jobLocation: interview.jobApplication?.jobLocation || '',
             jobApplicationId: interview.jobApplication?.id || null,
             round1Details: interview.round1Details || null,
             round2Details: interview.round2Details || null,
             round3Details: interview.round3Details || null,
             round1Interviewer: interview.round1Interviewer || null,
             round2Interviewer: interview.round2Interviewer || null,
             round3Interviewer: interview.round3Interviewer || null,
             score: interview.candidate?.score || 0,
             uniqueId: interview.candidate?.uniqueId || '',
             resumeText: interview.candidate?.resumeText || ''
           };
          
          console.log(`Transformed candidate ${transformed.name}:`, transformed);
          return transformed;
        });
      };

      const pending = transformCandidateData(pendingData, "PENDING");
      const completed = transformCandidateData(completedData, "DONE");

      setPendingCandidates(pending);
      setCompletedCandidates(completed);
    } catch (err) {
      setError(err.message || "Failed to fetch candidates");
      console.error("Error fetching candidates:", err);
      setPendingCandidates([]);
      setCompletedCandidates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    // Set candidates based on active tab
    if (activeTab === "pending") {
      setCandidates(pendingCandidates);
    } else {
      setCandidates(completedCandidates);
    }
  }, [activeTab, pendingCandidates, completedCandidates]);

  const handleSubmitFeedback = async (candidateId) => {
    try {
      const feedback = feedbackInputs[candidateId] || "";
      
      if (!feedback.trim()) {
        showToastMessage("Please provide feedback before submitting", "error");
        return;
      }

      // Find the candidate to get the interview data
      const candidate = candidates.find(c => c.id === candidateId);
      if (!candidate) {
        showToastMessage("Candidate not found", "error");
        return;
      }

      // Get current user info for interviewer name
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const interviewerName = currentUser.name || "Current Interviewer";

      // Determine which round to populate based on existing data
      let round1Details = candidate.round1Details;
      let round2Details = candidate.round2Details;
      let round3Details = candidate.round3Details;

      // Logic to determine which round to populate
      if (!round1Details) {
        // Round 1 is empty, populate it
        round1Details = {
          interviewerName: interviewerName,
          feedback: feedback,
          status: "IN_PROCESS_ROUND1"
        };
      } else if (!round2Details) {
        // Round 1 exists but Round 2 is empty, populate Round 2
        round2Details = {
          interviewerName: interviewerName,
          feedback: feedback,
          status: "IN_PROCESS_ROUND2"
        };
      } else if (!round3Details) {
        // Round 1 and 2 exist but Round 3 is empty, populate Round 3
        round3Details = {
          interviewerName: interviewerName,
          feedback: feedback,
          status: "IN_PROCESS_ROUND3"
        };
      } else {
        // All rounds are filled, update the latest round (Round 3)
        round3Details = {
          interviewerName: interviewerName,
          feedback: feedback,
          status: "IN_PROCESS_ROUND3"
        };
      }

      // Prepare feedback data according to the backend model
      const feedbackData = {
        round1Details: round1Details,
        round2Details: round2Details,
        round3Details: round3Details,
        feedback: feedback, // Overall feedback
        jobApplication: {
          id: candidate.jobApplicationId || null
        }
      };

      console.log('Submitting feedback data:', feedbackData);

      // Call the API to submit feedback
      await interviewService.submitFeedback(candidateId, feedbackData);
      
      showToastMessage("Feedback submitted successfully!", "success");
      
      // Clear feedback input
      setFeedbackInputs((prev) => {
        const newInputs = { ...prev };
        delete newInputs[candidateId];
        return newInputs;
      });

      // Refresh the data to show updated status
      await fetchCandidates();
      
    } catch (err) {
      console.error("Error submitting feedback:", err);
      showToastMessage("Failed to submit feedback: " + (err.message || "Unknown error"), "error");
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

  const handleDownloadResume = (fileData, candidateName) => {
    downloadResume(fileData, candidateName);
  };

  const toggleCardExpansion = (candidateId) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  };

  const handleCopyPhone = async (phoneNumber) => {
    const result = await copyToClipboard(phoneNumber);
    showToastMessage(result.message, result.success ? "success" : "error");
  };



  const handleFeedbackChange = (candidateId, value) => {
    setFeedbackInputs((prev) => ({
      ...prev,
      [candidateId]: value
    }));
  };

  const tabs = [
    {
      id: "pending",
      label: "Pending",
      count: pendingCandidates.length,
    },
    {
      id: "done",
      label: "Done",
      count: completedCandidates.length,
    },
  ];

  const handleTabSwitch = (newTabId) => {
    if (newTabId === activeTab) return;
    setActiveTab(newTabId);
  };

  const renderCandidateCard = (candidate) => {
    const isExpanded = expandedCards.has(candidate.id);
    const isPending = candidate.status === "PENDING";

    return (
      <div key={candidate.id} className="overflow-hidden transition-all duration-500 ease-out bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transform-gpu">
        {/* Card Header - Compact like ApplicantManagement */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 space-x-3">
              <div className="flex items-center justify-center w-10 h-10 transition-transform duration-300 ease-out rounded-full shadow-lg bg-gradient-to-br from-sg-red to-red-600 hover:scale-110">
                <User className="w-5 h-5 text-white hover:animate-float" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {candidate.name}
                </h3>
                <div className="flex items-center mt-1 space-x-3 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1 hover:animate-float" />
                    <button
                      onClick={() => handleCopyPhone(candidate.phone)}
                      className="flex items-center transition-colors duration-200 hover:text-blue-600 group"
                      title="Click to copy phone number"
                    >
                      <span className="truncate">{candidate.phone}</span>
                      <Copy className="w-3 h-3 ml-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 hover:animate-float" />
                    {formatDate(candidate.appliedDate)}
                  </div>
                </div>
                {candidate.jobTitle && (
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Tag className="w-3 h-3 mr-1" />
                    {candidate.jobTitle}
                    {candidate.jobLocation && ` - ${candidate.jobLocation}`}
                  </div>
                )}

              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center ml-3 space-x-2">
              <div className="flex items-center text-xs text-gray-600">
                <Tag className="w-4 h-4 mr-1 hover:animate-float" />
                {candidate.matchedSkills?.length || 0}
              </div>
              <div className="flex items-center ml-2 space-x-1">
                {candidate.resumeData && (
                  <>
                    <button
                      onClick={() => openResumeModal(candidate.resumeData, candidate.name)}
                      className="flex items-center px-2 py-1 text-xs text-blue-600 transition-all duration-500 ease-out rounded hover:text-blue-800 hover:bg-blue-50 hover:scale-110 hover:rotate-6 transform-gpu"
                      title="Preview Resume"
                    >
                      <Eye className="w-5 h-5 hover:animate-float" />
                    </button>
                    <button
                      onClick={() => handleDownloadResume(candidate.resumeData, candidate.name)}
                      className="flex items-center px-2 py-1 text-xs text-green-600 transition-all duration-500 ease-out rounded hover:text-green-800 hover:bg-green-50 hover:scale-110 hover:-rotate-6 transform-gpu"
                      title="Download Resume"
                    >
                      <Download className="w-5 h-5 hover:animate-float" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => toggleCardExpansion(candidate.id)}
                  className="flex items-center px-2 py-1 text-xs text-gray-600 transition-all duration-500 ease-out rounded hover:text-gray-800 hover:bg-gray-50 hover:scale-110 transform-gpu"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 hover:animate-float" />
                  ) : (
                    <ChevronDown className="w-5 h-5 hover:animate-float" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

                 {/* Expanded Content */}
         {isExpanded && (
           <div className="p-6 border-t border-gray-200 bg-gray-50">
             <div className="mb-6">
               <h4 className="mb-3 text-sm font-medium text-gray-700">Matched Skills</h4>
               <div className="flex flex-wrap gap-2">
                 {candidate.matchedSkills && candidate.matchedSkills.length > 0 ? (
                   candidate.matchedSkills.map((skill, index) => (
                     <span
                       key={index}
                       className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full"
                     >
                       {skill}
                     </span>
                   ))
                 ) : (
                   <span className="text-xs text-gray-500">No skills data available</span>
                 )}
               </div>
             </div>

             <div className="mb-6">
               <h4 className="mb-3 text-sm font-semibold text-gray-700">Summary</h4>
               <p className="text-sm leading-relaxed text-gray-900 font-semibold">
                 {candidate.summary || 'No summary available'}
               </p>
             </div>

                           {isPending ? (
                <div className="space-y-4">
                  <div>
                    {(() => {
                      let roundNumber = 1;
                      if (candidate.round1Details) roundNumber = 2;
                      if (candidate.round2Details) roundNumber = 3;
                      if (candidate.round3Details) roundNumber = 3; // Max round
                      
                      return (
                        <label htmlFor={`feedback-${candidate.id}`} className="block mb-3 text-sm font-medium text-gray-700">
                          Round {roundNumber} Interview Feedback
                        </label>
                      );
                    })()}
                    <textarea
                      id={`feedback-${candidate.id}`}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your interview feedback here..."
                      value={feedbackInputs[candidate.id] || ""}
                      onChange={(e) => handleFeedbackChange(candidate.id, e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button3D
                      onClick={() => handleSubmitFeedback(candidate.id)}
                      buttonColor="bg-green-600"
                      shadowColor="bg-green-800"
                      className="px-4 py-2 text-sm"
                    >
                      Submit Feedback
                    </Button3D>
                  </div>
                </div>
                           ) : (
                <div>
                  {/* Overall Feedback Summary */}
                  {candidate.feedback && (
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-gray-700">Overall Feedback Summary</h4>
                      <div className="p-4 bg-white border border-gray-200 rounded-md">
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {candidate.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
           </div>
         )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading candidates..." />;
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchCandidates}
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || "";

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
      `}</style>
      
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabSwitch={handleTabSwitch} 
        />

        {/* Candidate Cards Grid */}
        <div className="space-y-3">
          {candidates.length === 0 ? (
            <EmptyState activeTabLabel={activeTabLabel} />
          ) : (
            candidates.map(renderCandidateCard)
          )}
        </div>

        {/* Toast Notification */}
        <ToastNotification 
          show={showToast} 
          message={toastMessage} 
          type={toastType} 
        />

        {/* Resume Preview Modal */}
        <ResumeModal 
          show={showResumeModal} 
          resume={selectedResume} 
          onClose={closeResumeModal} 
        />
      </div>
    </>
  );
};

export default InterviewerCandidateManagement;
