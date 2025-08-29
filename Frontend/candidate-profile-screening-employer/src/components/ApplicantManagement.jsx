import { useState, useEffect, useCallback } from "react";
import {
  Check,
  X,
  Eye,
  Download,
  Phone,
  Mail,
  Calendar,
  Star,
  User,
  FileText,
  Tag,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle,
} from "lucide-react";
import { candidateService } from "../services/candidateService";
import Button3D from "./Button3D";

const ApplicantManagement = ({ jobId }) => {
  const [activeTab, setActiveTab] = useState("applied");
  const [candidates, setCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all candidates for this job from backend
      const allCandidatesData = await candidateService.getCandidatesByJobId(
        jobId
      );

      // Handle case where no candidates are found (empty array or null)
      if (!allCandidatesData || allCandidatesData.length === 0) {
        setAllCandidates([]);
        setCandidates([]);
        return;
      }

      setAllCandidates(allCandidatesData);
    } catch (err) {
      // Gracefully handle "Resource not found" or similar errors
      if (
        err.message &&
        (err.message.includes("not found") ||
          err.message.includes("404") ||
          err.message.includes("Resource not found"))
      ) {
        console.log("No candidates found for this job, showing empty list");
        setAllCandidates([]);
        setCandidates([]);
        setError(null); // Don't show error for empty data
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

  // Handle initial filtering when allCandidates changes
  useEffect(() => {
    if (allCandidates.length > 0) {
      const filteredCandidates = filterCandidatesByTab(allCandidates, activeTab);
      setCandidates(filteredCandidates);
    }
  }, [allCandidates, activeTab]);

  const filterCandidatesByTab = (candidates, tabId) => {
    switch (tabId) {
      case "applied":
        return candidates.filter((c) => c.status === "IN_PROCESS");
      case "round1":
        return candidates.filter((c) => c.status === "IN_PROCESS_ROUND1");
      case "round2":
        return candidates.filter((c) => c.status === "IN_PROCESS_ROUND2");
      case "round3":
        return candidates.filter((c) => c.status === "IN_PROCESS_ROUND3");
      case "onhold":
        return candidates.filter((c) => c.status === "ON_HOLD");
      case "hired":
        return candidates.filter((c) => c.status === "HIRED");
      case "rejected":
        return candidates.filter((c) => c.status === "REJECTED");
      default:
        return [];
    }
  };

  const handleStatusUpdate = async (candidateId, newStatus) => {
    try {
      await candidateService.updateCandidateStatus(candidateId, newStatus);

      // Update both local candidates and allCandidates state
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

  const downloadResume = (fileData, candidateName) => {
    try {
      const byteCharacters = atob(fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${candidateName}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Failed to download resume");
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 9.0) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 8.0) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 7.0) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage("Phone number copied to clipboard!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.log(err);
      setToastMessage("Failed to copy phone number");
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const openEmailClient = (email, candidateName) => {
    try {
      const subject = encodeURIComponent(
        `Regarding your application - ${candidateName}`
      );
      const body = encodeURIComponent(
        `Dear ${candidateName},\n\nThank you for your interest in our position.\n\nBest regards,\n[Your Name]`
      );
      const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

      window.open(mailtoLink, "_blank");

      setToastMessage("Email client opened successfully!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.log(err);
      setToastMessage("Failed to open email client");
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
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
      count: allCandidates.filter((c) => c.status === "IN_PROCESS_ROUND1")
        .length,
    },
    {
      id: "round2",
      label: "Round 2",
      status: "IN_PROCESS_ROUND2",
      count: allCandidates.filter((c) => c.status === "IN_PROCESS_ROUND2")
        .length,
    },
    {
      id: "round3",
      label: "Round 3",
      status: "IN_PROCESS_ROUND3",
      count: allCandidates.filter((c) => c.status === "IN_PROCESS_ROUND3")
        .length,
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

    // Instantly filter and show candidates for the new tab without loading state
    if (allCandidates.length > 0) {
      const filteredCandidates = filterCandidatesByTab(allCandidates, newTabId);
      setCandidates(filteredCandidates);
    }

    setActiveTab(newTabId);
  };

  const renderCandidateCard = (candidate) => {
    const isExpanded = expandedCards.has(candidate.id);

    return (
      <div
        key={candidate.id}
        className="overflow-hidden transition-all duration-500 ease-out bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transform-gpu"
      >
        {/* Card Header */}
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
                    <Mail className="w-4 h-4 mr-1 hover:animate-float" />
                    <button
                      onClick={() =>
                        openEmailClient(candidate.email, candidate.name)
                      }
                      className="flex items-center transition-colors duration-200 hover:text-blue-600 group"
                      title="Click to send email"
                    >
                      <span className="truncate">{candidate.email}</span>
                      <svg
                        className="w-3 h-3 ml-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1 hover:animate-float" />
                    <button
                      onClick={() => copyToClipboard(candidate.phoneNumber)}
                      className="flex items-center transition-colors duration-200 hover:text-blue-600 group"
                      title="Click to copy phone number"
                    >
                      <span className="truncate">{candidate.phoneNumber}</span>
                      <Copy className="w-3 h-3 ml-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 hover:animate-float" />
                    {formatDate(candidate.dateOfBirth)}
                  </div>
                </div>
              </div>
            </div>

            {/* Score and Actions */}
            <div className="flex items-center ml-3 space-x-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border hover:animate-float ${getScoreColor(
                  candidate.score
                )} hover:scale-105 transition-transform duration-300 ease-out`}
              >
                <Star className="w-4 h-4 mr-1 hover:animate-glow" />
                {candidate.score}/10
              </span>
              <div className="flex items-center text-xs text-gray-600">
                <Tag className="w-4 h-4 mr-1 hover:animate-float" />
                {candidate.matchedSkills?.length || 0}
              </div>
              <div className="flex items-center ml-2 space-x-1">
                <button
                  onClick={() =>
                    openResumeModal(candidate.fileData, candidate.name)
                  }
                  className="flex items-center px-2 py-1 text-xs text-blue-600 transition-all duration-500 ease-out rounded hover:text-blue-800 hover:bg-blue-50 hover:scale-110 hover:rotate-6 transform-gpu"
                  title="Preview Resume"
                >
                  <Eye className="w-5 h-5 hover:animate-float" />
                </button>
                <button
                  onClick={() =>
                    downloadResume(candidate.fileData, candidate.name)
                  }
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
          <div className="border-t border-gray-100 bg-gray-50 animate-slideDown">
            <div className="p-4 space-y-4">
                             {/* Summary */}
               <div>
                 <h4 className="flex items-center mb-2 text-base font-bold text-gray-800">
                   <FileText className="w-5 h-5 mr-2 hover:animate-float" />
                   Summary
                 </h4>
                 <p className="p-4 text-sm font-bold leading-relaxed text-gray-800 transition-shadow duration-300 bg-white border rounded shadow-sm hover:shadow-md">
                   {candidate.summary || "No summary available"}
                 </p>
               </div>

               {/* Interview Comments - Only show for Round1, Round2, Round3, and On-Hold tabs */}
               {(activeTab === "round1" || activeTab === "round2" || activeTab === "round3" || activeTab === "onhold") && (
                 <div>
                   <h4 className="flex items-center mb-2 text-base font-bold text-gray-800">
                     <FileText className="w-5 h-5 mr-2 hover:animate-float" />
                     Comments
                   </h4>
                   <div className="p-4 text-sm leading-relaxed text-gray-800 transition-shadow duration-300 bg-white border rounded shadow-sm hover:shadow-md">
                     {(() => {
                       switch (activeTab) {
                         case "onhold":
                           return candidate.feedbackSummary || "No feedback summary available yet.";
                         case "round1":
                           return candidate.round1Feedback || "No Round 1 feedback available yet.";
                         case "round2":
                           return candidate.round2Feedback || "No Round 2 feedback available yet.";
                         case "round3":
                           return candidate.round3Feedback || "No Round 3 feedback available yet.";
                         default:
                           return "No comments available yet. Comments will appear here once the interview is completed.";
                       }
                     })()}
                   </div>
                 </div>
               )}

               {/* Matched Skills */}
               <div>
                 <h4 className="flex items-center mb-2 text-base font-bold text-gray-800">
                   <Tag className="w-5 h-5 mr-2 hover:animate-float" />
                   Matched Skills ({candidate.matchedSkills?.length || 0})
                 </h4>
                 <div className="flex flex-wrap gap-1.5">
                   {candidate.matchedSkills?.map((skill, index) => (
                     <span
                       key={index}
                       className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 hover:scale-110 hover:bg-green-200 transition-all duration-300 transform-gpu"
                     >
                       {skill}
                     </span>
                   )) || (
                     <span className="text-sm text-gray-500">
                       No skills data available
                     </span>
                   )}
                 </div>
               </div>

                                                                                                                       {/* Action Buttons */}
                 <div className="flex items-center justify-end pt-3 space-x-2 border-t border-gray-200">
                   {activeTab === "applied" && (
                     <>
                                               <Button3D
                          onClick={() =>
                            handleStatusUpdate(candidate.id, "IN_PROCESS_ROUND1")
                          }
                          buttonColor="bg-green-600"
                          shadowColor="bg-green-800"
                          className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Select for Interview
                        </Button3D>
                       <Button3D
                         onClick={() =>
                           handleStatusUpdate(candidate.id, "REJECTED")
                         }
                         buttonColor="bg-red-600"
                         shadowColor="bg-red-800"
                         className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
                       >
                         <X className="w-3 h-3 mr-1" />
                         Reject
                       </Button3D>
                     </>
                   )}
                   {activeTab === "round1" && (
                     <>
                       <Button3D
                         onClick={() =>
                           handleStatusUpdate(candidate.id, "IN_PROCESS_ROUND2")
                         }
                         buttonColor="bg-green-600"
                         shadowColor="bg-green-800"
                         className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
                       >
                         <Check className="w-3 h-3 mr-1" />
                         Move to Next Round
                       </Button3D>
                       <Button3D
                         onClick={() =>
                           handleStatusUpdate(candidate.id, "REJECTED")
                         }
                         buttonColor="bg-red-600"
                         shadowColor="bg-red-800"
                         className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
                       >
                         <X className="w-3 h-3 mr-1" />
                         Reject
                       </Button3D>
                     </>
                   )}
                   {activeTab === "round2" && (
                     <>
                       <Button3D
                         onClick={() =>
                           handleStatusUpdate(candidate.id, "IN_PROCESS_ROUND3")
                         }
                         buttonColor="bg-green-600"
                         shadowColor="bg-green-800"
                         className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
                       >
                         <Check className="w-3 h-3 mr-1" />
                         Move to Next Round
                       </Button3D>
                       <Button3D
                         onClick={() =>
                           handleStatusUpdate(candidate.id, "REJECTED")
                         }
                         buttonColor="bg-red-600"
                         shadowColor="bg-red-800"
                         className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
                       >
                         <X className="w-3 h-3 mr-1" />
                         Reject
                       </Button3D>
                     </>
                   )}
                   {activeTab === "round3" && (
                     <>
                       <Button3D
                         onClick={() =>
                           handleStatusUpdate(candidate.id, "ON_HOLD")
                         }
                         buttonColor="bg-green-600"
                         shadowColor="bg-green-800"
                         className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
                       >
                         Consider for Hiring
                       </Button3D>
                       <Button3D
                         onClick={() =>
                           handleStatusUpdate(candidate.id, "REJECTED")
                         }
                         buttonColor="bg-red-600"
                         shadowColor="bg-red-800"
                         className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
                       >
                         <X className="w-3 h-3 mr-1" />
                         Reject
                       </Button3D>
                     </>
                   )}
                   {activeTab === "onhold" && (
                     <>
                       <Button3D
                         onClick={() =>
                           handleStatusUpdate(candidate.id, "HIRED")
                         }
                         buttonColor="bg-green-600"
                         shadowColor="bg-green-800"
                         className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
                       >
                         <Check className="w-3 h-3 mr-1" />
                         Hire
                       </Button3D>
                       <Button3D
                         onClick={() =>
                           handleStatusUpdate(candidate.id, "REJECTED")
                         }
                         buttonColor="bg-red-600"
                         shadowColor="bg-red-800"
                         className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
                       >
                         <X className="w-3 h-3 mr-1" />
                         Reject
                       </Button3D>
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
        {/* Enhanced Navigation Tabs with 7 tabs */}
        <div className="w-full animate-fadeIn">
          <div className="relative p-1 overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
            {/* Animated Background Slider */}
            <div
              className="absolute transition-all duration-500 ease-out rounded-md top-1 bottom-1 bg-sg-red"
              style={{
                width: "calc(14.285% - 0.125rem)",
                left: `calc(${
                  tabs.findIndex((tab) => tab.id === activeTab) * 14.285
                }% + 0.125rem)`,
              }}
            />

            <nav className="relative flex w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  } flex-1 py-4 px-1 rounded-md font-semibold text-xs transition-all duration-300 ease-out flex items-center justify-center space-x-1 relative z-10 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <span className="transition-all duration-300">
                    {tab.label}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-white text-sg-red"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
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
              <h3 className="mb-1 text-base font-medium text-gray-900">
                No candidates found
              </h3>
              <p className="text-sm text-gray-600">
                There are no candidates in the{" "}
                {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()}{" "}
                stage.
              </p>
            </div>
          ) : (
            candidates.map(renderCandidateCard)
          )}
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed z-50 top-4 right-4 animate-fadeIn">
            <div
              className={`flex items-center px-4 py-3 rounded-lg shadow-lg border-l-4 ${
                toastType === "success"
                  ? "bg-green-50 border-green-400 text-green-800"
                  : "bg-red-50 border-red-400 text-red-800"
              }`}
            >
              {toastType === "success" ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <X className="w-5 h-5 mr-2" />
              )}
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Resume Preview Modal */}
        {showResumeModal && selectedResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50">
            <div className="relative flex flex-col w-full max-w-4xl h-[80vh] bg-white border rounded-lg shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between flex-shrink-0 p-4 border-b bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">
                  Resume Preview - {selectedResume.candidateName}
                </h3>
                <button
                  onClick={closeResumeModal}
                  className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-auto">
                <iframe
                  src={`data:application/pdf;base64,${selectedResume.fileData}`}
                  className="w-full h-full border-0 rounded shadow-sm"
                  title={`Resume - ${selectedResume.candidateName}`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicantManagement;
