import React from 'react';
import CandidateHeader from './CandidateHeader';
import CandidateExpandedContent from './CandidateExpandedContent';

const CandidateCard = ({ 
  candidate, 
  isExpanded, 
  activeTab,
  onToggleExpansion, 
  onOpenResume, 
  onDownloadResume, 
  onCopyPhone, 
  onOpenEmail,
  onStatusUpdate,
  onShowToast,
  onShowInterviewerSelection,
  getScoreColor,
  formatDate 
}) => {
  // Add error boundary and debugging
  if (!candidate) {
    console.error('CandidateCard: candidate prop is null or undefined');
    return <div className="p-4 text-red-600">Error: Candidate data not available</div>;
  }

  console.log('CandidateCard rendering:', { candidate, isExpanded, activeTab });

  return (
    <div className="overflow-hidden transition-all duration-500 ease-out bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transform-gpu">
      {/* Card Header */}
      <CandidateHeader
        candidate={candidate}
        isExpanded={isExpanded}
        onToggleExpansion={onToggleExpansion}
        onOpenResume={onOpenResume}
        onDownloadResume={onDownloadResume}
        onCopyPhone={onCopyPhone}
        onOpenEmail={onOpenEmail}
        getScoreColor={getScoreColor}
        formatDate={formatDate}
      />

      {/* Expanded Content */}
      {isExpanded && (
        <div 
          className="max-h-[600px] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f3f4f6'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          <CandidateExpandedContent
            candidate={candidate}
            activeTab={activeTab}
            onStatusUpdate={onStatusUpdate}
            onShowToast={onShowToast}
            onShowInterviewerSelection={onShowInterviewerSelection}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateCard;
