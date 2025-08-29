import { useState, useEffect, useCallback } from "react";
import TabNavigation from "./TabNavigation";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ToastNotification from "./ToastNotification";
import ResumeModal from "./ResumeModal";
import Button3D from "./Button3D";
import useToast from "../hooks/useToast";
import { 
  downloadResume, 
  openEmailClient, 
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

// Mock candidate data for now (since backend is not implemented)
const mockCandidates = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    status: "PENDING",
    matchedSkills: ["React", "JavaScript", "TypeScript", "Node.js"],
    summary: "Experienced frontend developer with 3+ years of experience in React and modern JavaScript frameworks. Strong understanding of component-based architecture and state management.",
    resumeData: "base64-encoded-resume-data",
    appliedDate: "2024-01-15T10:30:00Z",
    feedback: ""
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 234-5678",
    status: "PENDING",
    matchedSkills: ["Python", "Django", "PostgreSQL", "AWS"],
    summary: "Backend developer with expertise in Python and Django. Experience with database design and cloud deployment. Strong problem-solving skills and attention to detail.",
    resumeData: "base64-encoded-resume-data",
    appliedDate: "2024-01-14T14:20:00Z",
    feedback: ""
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 345-6789",
    status: "DONE",
    matchedSkills: ["React", "Vue.js", "CSS3", "HTML5"],
    summary: "Frontend specialist with experience in multiple frameworks. Strong UI/UX skills and responsive design expertise. Collaborative team player with excellent communication skills.",
    resumeData: "base64-encoded-resume-data",
    appliedDate: "2024-01-13T09:15:00Z",
    feedback: "Strong technical skills and good communication. Recommended for next round."
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 456-7890",
    status: "DONE",
    matchedSkills: ["JavaScript", "Node.js", "MongoDB", "Express"],
    summary: "Full-stack developer with strong JavaScript skills. Experience with Node.js backend development and MongoDB. Quick learner with passion for new technologies.",
    resumeData: "base64-encoded-resume-data",
    appliedDate: "2024-01-12T16:45:00Z",
    feedback: "Good technical foundation but needs more experience with our tech stack."
  }
];

const InterviewerCandidateManagement = ({ jobId }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [candidates, setCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
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

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filter candidates for this job (in real implementation, this would come from API)
      const jobCandidates = mockCandidates.filter(candidate => 
        candidate.jobId === jobId || true // For now, show all candidates
      );

      setAllCandidates(jobCandidates);
    } catch (err) {
      setError(err.message || "Failed to fetch candidates");
      console.error("Error fetching candidates:", err);
      setCandidates([]);
      setAllCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    if (allCandidates.length > 0) {
      const filteredCandidates = allCandidates.filter(candidate => 
        activeTab === "pending" ? candidate.status === "PENDING" : candidate.status === "DONE"
      );
      setCandidates(filteredCandidates);
    }
  }, [allCandidates, activeTab]);

  const handleSubmitFeedback = async (candidateId) => {
    try {
      const feedback = feedbackInputs[candidateId] || "";
      
      if (!feedback.trim()) {
        showToastMessage("Please provide feedback before submitting", "error");
        return;
      }

      // Update candidate status and feedback
      setAllCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, status: "DONE", feedback: feedback }
            : candidate
        )
      );

      // Clear feedback input
      setFeedbackInputs((prev) => {
        const newInputs = { ...prev };
        delete newInputs[candidateId];
        return newInputs;
      });

      showToastMessage("Feedback submitted successfully!", "success");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      showToastMessage("Failed to submit feedback", "error");
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
      count: allCandidates.filter((c) => c.status === "PENDING").length,
    },
    {
      id: "done",
      label: "Done",
      count: allCandidates.filter((c) => c.status === "DONE").length,
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
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center ml-3 space-x-2">
              <div className="flex items-center text-xs text-gray-600">
                <Tag className="w-4 h-4 mr-1 hover:animate-float" />
                {candidate.matchedSkills?.length || 0}
              </div>
              <div className="flex items-center ml-2 space-x-1">
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
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Matched Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
              <p className="text-gray-900 text-sm leading-relaxed">{candidate.summary}</p>
            </div>

            {isPending ? (
              <div className="space-y-3">
                <div>
                  <label htmlFor={`feedback-${candidate.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Feedback
                  </label>
                  <textarea
                    id={`feedback-${candidate.id}`}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                    className="py-2 px-4 text-sm"
                  >
                    Submit Feedback
                  </Button3D>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted Feedback</h4>
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  <p className="text-gray-900 text-sm">{candidate.feedback}</p>
                </div>
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
