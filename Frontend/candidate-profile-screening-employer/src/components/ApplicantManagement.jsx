import { useState, useEffect, useCallback } from "react";
import { candidateService } from "../services/candidateService";
import TabNavigation from "./TabNavigation";
import CandidateCard from "./CandidateCard";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ToastNotification from "./ToastNotification";
import ResumeModal from "./ResumeModal";
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
  const [activeTab, setActiveTab] = useState("applied");
  const [candidates, setCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  
  const { showToast, toastMessage, toastType, showToastMessage } = useToast();

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const allCandidatesData = await candidateService.getCandidatesByJobId(jobId);

      if (!allCandidatesData || allCandidatesData.length === 0) {
        setAllCandidates([]);
        setCandidates([]);
        return;
      }

      setAllCandidates(allCandidatesData);
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

  useEffect(() => {
    if (allCandidates.length > 0) {
      const filteredCandidates = filterCandidatesByTab(allCandidates, activeTab);
      setCandidates(filteredCandidates);
    }
  }, [allCandidates, activeTab]);

  const handleStatusUpdate = async (candidateId, newStatus) => {
    try {
      await candidateService.updateCandidateStatus(candidateId, newStatus);

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
    } catch (err) {
      console.error("Error updating candidate status:", err);
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

    if (allCandidates.length > 0) {
      const filteredCandidates = filterCandidatesByTab(allCandidates, newTabId);
      setCandidates(filteredCandidates);
    }

    setActiveTab(newTabId);
  };

  const renderCandidateCard = (candidate) => {
    const isExpanded = expandedCards.has(candidate.id);

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

export default ApplicantManagement;
