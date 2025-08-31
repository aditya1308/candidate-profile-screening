import { useState, useEffect, useCallback } from "react";
import { candidateService } from "../services/candidateService";
import { interviewerService } from "../services/interviewerService";
import TabNavigation from "./TabNavigation";
import CandidateCard from "./CandidateCard";
import InterviewerSelectionScreen from "./InterviewerSelectionModal";
import EmailSchedulingModal from "./EmailSchedulingModal";

import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ToastNotification from "./ToastNotification";
import ResumeModal from "./ResumeModal";
import ErrorBoundary from "./ErrorBoundary";
import useToast from "../hooks/useToast";
import { 
  filterCandidatesByTab, 
  downloadResume, 
  openEmailClient, 
  copyToClipboard,
  formatDate,
  getScoreColor
} from "../utils/candidateUtils";

const ApplicantManagement = ({ jobId }) => {
  // Load initial state from localStorage or use defaults
  const getInitialState = () => {
    try {
      const savedState = localStorage.getItem(`applicantManagement_${jobId}`);
      console.log('Loading saved state for jobId:', jobId, 'savedState:', savedState);
      
      if (savedState) {
        const parsed = JSON.parse(savedState);
        console.log('Parsed saved state:', parsed);
        return {
          activeTab: parsed.activeTab || "applied",
          expandedCards: new Set(parsed.expandedCards || [])
        };
      }
    } catch (error) {
      console.warn('Error loading saved state:', error);
    }
    
    console.log('Using default state for jobId:', jobId);
    return {
      activeTab: "applied",
      expandedCards: new Set()
    };
  };

  const initialState = getInitialState();
  const [activeTab, setActiveTab] = useState(initialState.activeTab);
  const [candidates, setCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [expandedCards, setExpandedCards] = useState(initialState.expandedCards);
  
  // Interviewer selection state
  const [showInterviewerSelection, setShowInterviewerSelection] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  
  // Email scheduling state
  const [showEmailScheduling, setShowEmailScheduling] = useState(false);
  const [emailCandidate, setEmailCandidate] = useState(null);
  const [emailRound, setEmailRound] = useState(null);
  
  const { showToast, toastMessage, toastType, showToastMessage } = useToast();

  // Function to save state to localStorage
  const saveStateToStorage = (newActiveTab, newExpandedCards) => {
    try {
      const stateToSave = {
        activeTab: newActiveTab,
        expandedCards: Array.from(newExpandedCards)
      };
      console.log('Saving state to localStorage for jobId:', jobId, 'state:', stateToSave);
      localStorage.setItem(`applicantManagement_${jobId}`, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Error saving state to localStorage:', error);
    }
  };

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const allCandidatesData = await candidateService.getCandidatesByJobId(jobId);
      console.log('Fetched candidates data:', allCandidatesData);

      if (!allCandidatesData || allCandidatesData.length === 0) {
        setAllCandidates([]);
        setCandidates([]);
        return;
      }

      // Ensure all candidates have required properties
      const normalizedCandidates = allCandidatesData.map(candidate => ({
        id: candidate.id,
        name: candidate.name || 'Unknown',
        fullName: candidate.fullName || candidate.name || 'Unknown',
        email: candidate.email || '',
        phoneNumber: candidate.phoneNumber || candidate.phone || '',
        status: candidate.status || 'IN_PROCESS',
        summary: candidate.summary || '',
        matchedSkills: candidate.matchedSkills || [],
        score: candidate.score || 0,
        uniqueId: candidate.uniqueId || '',
        resumeText: candidate.resumeText || '',
        fileData: candidate.fileData || null,
        dateOfBirth: candidate.dateOfBirth || candidate.dob || '',
        appliedDate: candidate.appliedDate || candidate.applicationDate || new Date().toISOString(),
        feedbackSummary: candidate.feedbackSummary || '',
        round1Feedback: candidate.round1Feedback || '',
        round2Feedback: candidate.round2Feedback || '',
        round3Feedback: candidate.round3Feedback || '',
        interviewId: candidate.interviewId || null,
        ...candidate // Keep any other properties
      }));

      console.log('Normalized candidates:', normalizedCandidates);
      
      // Check for duplicates
      const candidateIds = normalizedCandidates.map(c => c.id);
      const uniqueIds = [...new Set(candidateIds)];
      if (candidateIds.length !== uniqueIds.length) {
        console.warn('Duplicate candidates detected!', {
          total: candidateIds.length,
          unique: uniqueIds.length,
          duplicates: candidateIds.filter((id, index) => candidateIds.indexOf(id) !== index)
        });
      }
      
      setAllCandidates(normalizedCandidates);
    } catch (err) {
      if (
        err.message &&
        (err.message.includes("not found") ||
          err.message.includes("404") ||
          err.message.includes("Resource not found"))
      ) {
        console.log("No candidates found for this job, showing empty list");
        setAllCandidates([]);
        setCandidates([]);
        setError(null);
      } else {
        setError(err.message || "Failed to fetch candidates");
        console.error("Error fetching candidates:", err);
        setCandidates([]);
        setAllCandidates([]);
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Save state when jobId changes (but don't clear on unmount)
  useEffect(() => {
    // Only clear if jobId actually changes, not on component unmount
    const prevJobId = localStorage.getItem('currentJobId');
    if (prevJobId && prevJobId !== jobId.toString()) {
      try {
        localStorage.removeItem(`applicantManagement_${prevJobId}`);
      } catch (error) {
        console.warn('Error clearing previous job state:', error);
      }
    }
    localStorage.setItem('currentJobId', jobId.toString());
  }, [jobId]);

  useEffect(() => {
    if (allCandidates.length > 0) {
      const filteredCandidates = filterCandidatesByTab(allCandidates, activeTab);
      setCandidates(filteredCandidates);
    }
  }, [allCandidates, activeTab]);

  const handleStatusUpdate = async (candidateId, newStatus, interviewId = null, interviewerEmail = null) => {
    try {
      console.log('handleStatusUpdate called with:', { candidateId, newStatus, interviewId, interviewerEmail });
      await candidateService.updateCandidateStatus(candidateId, newStatus, interviewId, interviewerEmail);

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, status: newStatus }
            : candidate
        )
      );

      setAllCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, status: newStatus }
            : candidate
        )
      );
      console.log('Status update completed successfully');
    } catch (err) {
      console.error("Error updating candidate status:", err);
      alert(`Failed to update candidate status: ${err.message}`);
    }
  };

  const handleShowInterviewerSelection = (candidate, newStatus) => {
    // Only show interviewer selection for Applied, Round1, and Round2 tabs
    if (['applied', 'round1', 'round2'].includes(activeTab)) {
      setSelectedCandidate(candidate);
      setPendingStatusUpdate(newStatus);
      setShowInterviewerSelection(true);
    }
  };

  const handleInterviewerSelected = async (interviewer) => {
    try {
      console.log('handleInterviewerSelected called with:', { interviewer, activeTab, selectedCandidate });
      
      // Store interviewer info for later use after email is sent
      const interviewerInfo = {
        interviewer,
        candidateId: selectedCandidate.id,
        newStatus: pendingStatusUpdate,
        interviewId: selectedCandidate.interviewId,
        interviewerEmail: interviewer.email
      };
      
      // Show email scheduling modal for Round 1, Round 2, and Round 3
      if (activeTab === 'applied' || activeTab === 'round1' || activeTab === 'round2') {
        console.log('Setting up email modal for:', { activeTab, selectedCandidate });
        
        // Store interviewer info in the email candidate state
        const candidateWithInterviewerInfo = {
          ...selectedCandidate,
          pendingInterviewerInfo: interviewerInfo
        };
        
        setEmailCandidate(candidateWithInterviewerInfo);
        setEmailRound(activeTab === 'applied' ? 1 : activeTab === 'round1' ? 2 : 3);
        setShowEmailScheduling(true);
        
        console.log('Email modal should now be visible with interviewer info:', interviewerInfo);
      } else {
        // For other tabs, proceed with status update immediately
        await handleStatusUpdate(selectedCandidate.id, pendingStatusUpdate, selectedCandidate.interviewId, interviewer.email);
        showToastMessage(`Interviewer ${interviewer.fullName} assigned successfully!`, 'success');
      }
      
      // Go back to candidate view
      setShowInterviewerSelection(false);
      setPendingStatusUpdate(null);
    } catch (error) {
      console.error('Error in handleInterviewerSelected:', error);
      showToastMessage(`Error: ${error.message}`, 'error');
    }
  };

  const handleBackToCandidate = () => {
    setShowInterviewerSelection(false);
    setSelectedCandidate(null);
    setPendingStatusUpdate(null);
  };

  const handleSendInterviewEmail = async (subject, body) => {
    try {
      console.log('handleSendInterviewEmail called with:', { subject, body, emailCandidate });
      console.log('emailCandidate.pendingInterviewerInfo:', emailCandidate?.pendingInterviewerInfo);
      
      // First, send the email
      const result = await interviewerService.sendInterviewEmail(
        emailCandidate.email,
        subject,
        body
      );
      
      console.log('Email service returned:', result);
      showToastMessage('Interview email sent successfully!', 'success');
      
      // After successful email sending, move candidate to next round
      if (emailCandidate.pendingInterviewerInfo) {
        const { interviewer, candidateId, newStatus, interviewId, interviewerEmail } = emailCandidate.pendingInterviewerInfo;
        
        console.log('Moving candidate to next round after email sent:', { candidateId, newStatus, interviewer });
        
        // Update candidate status to move to next round
        await handleStatusUpdate(candidateId, newStatus, interviewId, interviewerEmail);
        
        // Show success message for interviewer assignment
        showToastMessage(`Interviewer ${interviewer.fullName} assigned successfully!`, 'success');
        
        // Show interview scheduled popup
        setTimeout(() => {
          showToastMessage(`Interview for Round ${emailRound} has been scheduled successfully!`, 'success');
        }, 1000);
      } else {
        console.error('No pendingInterviewerInfo found in emailCandidate:', emailCandidate);
        showToastMessage('Error: Interviewer information not found. Please try again.', 'error');
      }
      
      setShowEmailScheduling(false);
      setEmailCandidate(null);
      setEmailRound(null);
      setSelectedCandidate(null); // Clear the selected candidate after everything is done
    } catch (error) {
      console.error('Error sending interview email:', error);
      showToastMessage(`Failed to send email: ${error.message}`, 'error');
    }
  };

  const handleCloseEmailScheduling = () => {
    setShowEmailScheduling(false);
    setEmailCandidate(null);
    setEmailRound(null);
    setSelectedCandidate(null); // Clear the selected candidate when email modal is closed
  };





  const getNextRound = (currentRound) => {
    switch (currentRound) {
      case "applied": return "round1";
      case "round1": return "round2";
      case "round2": return "round3";
      default: return "";
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
      // Save state to localStorage
      saveStateToStorage(activeTab, newSet);
      return newSet;
    });
  };

  const handleCopyPhone = async (phoneNumber) => {
    const result = await copyToClipboard(phoneNumber);
    showToastMessage(result.message, result.success ? "success" : "error");
  };

  const handleOpenEmail = (email, candidateName) => {
    const result = openEmailClient(email, candidateName);
    showToastMessage(result.message, result.success ? "success" : "error");
  };

  const tabs = [
    {
      id: "applied",
      label: "Applied",
      status: "IN_PROCESS",
      count: allCandidates.filter((c) => c.status === "IN_PROCESS").length,
    },
    {
      id: "round1",
      label: "Round 1",
      status: "IN_PROCESS_ROUND1",
      count: allCandidates.filter((c) => c.status === "IN_PROCESS_ROUND1").length,
    },
    {
      id: "round2",
      label: "Round 2",
      status: "IN_PROCESS_ROUND2",
      count: allCandidates.filter((c) => c.status === "IN_PROCESS_ROUND2").length,
    },
    {
      id: "round3",
      label: "Round 3",
      status: "IN_PROCESS_ROUND3",
      count: allCandidates.filter((c) => c.status === "IN_PROCESS_ROUND3").length,
    },
    {
      id: "onhold",
      label: "Shortlisted",
      status: "ON_HOLD",
      count: allCandidates.filter((c) => c.status === "ON_HOLD").length,
    },
    {
      id: "hired",
      label: "Hired",
      status: "HIRED",
      count: allCandidates.filter((c) => c.status === "HIRED").length,
    },
    {
      id: "rejected",
      label: "Rejected",
      status: "REJECTED",
      count: allCandidates.filter((c) => c.status === "REJECTED").length,
    },
  ];

  const handleTabSwitch = (newTabId) => {
    if (newTabId === activeTab) return;

    // Reset interviewer selection screen when switching tabs
    setShowInterviewerSelection(false);
    setSelectedCandidate(null);
    setPendingStatusUpdate(null);

    if (allCandidates.length > 0) {
      const filteredCandidates = filterCandidatesByTab(allCandidates, newTabId);
      setCandidates(filteredCandidates);
    }

    setActiveTab(newTabId);
    // Save state to localStorage
    saveStateToStorage(newTabId, expandedCards);
  };

  const renderCandidateCard = (candidate) => {
    console.log('renderCandidateCard called with:', candidate);
    
    if (!candidate) {
      console.error('renderCandidateCard: candidate is null or undefined');
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: Candidate data is missing</p>
        </div>
      );
    }

    if (!candidate.id) {
      console.error('renderCandidateCard: candidate.id is missing');
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: Candidate ID is missing</p>
          <pre className="text-xs mt-2">{JSON.stringify(candidate, null, 2)}</pre>
        </div>
      );
    }

    const isExpanded = expandedCards.has(candidate.id);
    console.log('isExpanded:', isExpanded, 'candidate.id:', candidate.id);

    return (
      <CandidateCard
        key={candidate.id}
        candidate={candidate}
        isExpanded={isExpanded}
        activeTab={activeTab}
        onToggleExpansion={toggleCardExpansion}
        onOpenResume={openResumeModal}
        onDownloadResume={handleDownloadResume}
        onCopyPhone={handleCopyPhone}
        onOpenEmail={handleOpenEmail}
        onStatusUpdate={handleStatusUpdate}
        onShowToast={showToastMessage}
                 onShowInterviewerSelection={(newStatus) => handleShowInterviewerSelection(candidate, newStatus)}
        getScoreColor={getScoreColor}
        formatDate={formatDate}
      />
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading candidates..." />;
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600">{error}</p>
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

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes floatDelayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            opacity: 1;
            filter: brightness(1);
          }
          50% {
            opacity: 0.8;
            filter: brightness(1.2);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-modalFadeIn {
          animation: modalFadeIn 0.3s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
      
             <div className="space-y-6">
         {/* Enhanced Navigation Tabs */}
         <TabNavigation 
           tabs={tabs} 
           activeTab={activeTab} 
           onTabSwitch={handleTabSwitch} 
         />

        {/* Candidate Cards Grid or Interviewer Selection Screen */}
        <div className="space-y-3">
          {console.log('Rendering candidates:', candidates.length, candidates)}
          {showInterviewerSelection && selectedCandidate && ['applied', 'round1', 'round2'].includes(activeTab) ? (
            <InterviewerSelectionScreen
              candidate={selectedCandidate}
              onBack={handleBackToCandidate}
              onConfirm={handleInterviewerSelected}
              currentRound={activeTab}
              nextRound={getNextRound(activeTab)}
            />
          ) : candidates.length === 0 ? (
            <EmptyState activeTabLabel={activeTabLabel} />
          ) : (
            candidates.map((candidate, index) => (
              <ErrorBoundary key={`${candidate.id}-${index}`}>
                {renderCandidateCard(candidate)}
              </ErrorBoundary>
            ))
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

         {/* Email Scheduling Modal */}
         {console.log('Email modal state:', { showEmailScheduling, emailCandidate, emailRound })}
         <EmailSchedulingModal
           show={showEmailScheduling}
           onClose={handleCloseEmailScheduling}
           onSend={handleSendInterviewEmail}
           candidateName={emailCandidate?.name || ''}
           candidateEmail={emailCandidate?.email || ''}
           round={emailRound}
         />
         
       </div>
    </>
  );
};

export default ApplicantManagement;
