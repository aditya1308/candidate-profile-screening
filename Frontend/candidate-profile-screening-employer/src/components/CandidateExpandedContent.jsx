import React from 'react';
import { FileText, Tag } from 'lucide-react';
import ActionButtons from './ActionButtons';

const CandidateExpandedContent = ({ 
  candidate, 
  activeTab, 
  onStatusUpdate,
  onShowToast,
  onShowInterviewerSelection
}) => {
  const getCommentsContent = () => {
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
  };

  const shouldShowComments = ["round1", "round2", "round3", "onhold"].includes(activeTab);

  return (
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
        {shouldShowComments && (
          <div>
            <h4 className="flex items-center mb-2 text-base font-bold text-gray-800">
              <FileText className="w-5 h-5 mr-2 hover:animate-float" />
              Comments
            </h4>
            <div className="p-4 text-sm leading-relaxed text-gray-800 transition-shadow duration-300 bg-white border rounded shadow-sm hover:shadow-md">
              {getCommentsContent()}
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
        <ActionButtons 
          activeTab={activeTab} 
          candidateId={candidate.id} 
          candidateName={candidate.fullName}
          onStatusUpdate={onStatusUpdate}
          onShowToast={onShowToast}
          onShowInterviewerSelection={onShowInterviewerSelection}
        />
      </div>
    </div>
  );
};

export default CandidateExpandedContent;
