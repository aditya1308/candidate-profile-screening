import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import Button3D from './Button3D';

const ActionButtons = ({ activeTab, candidateId, candidateName, onStatusUpdate, onShowToast, onShowInterviewerSelection }) => {
  const handleStatusUpdateWithInterviewer = (newStatus) => {
    if (onShowInterviewerSelection) {
      onShowInterviewerSelection(newStatus);
    }
  };

  const getActionButtons = () => {
    switch (activeTab) {
      case "applied":
        return [
          {
            onClick: () => handleStatusUpdateWithInterviewer("IN_PROCESS_ROUND1"),
            buttonColor: "bg-green-600",
            shadowColor: "bg-green-800",
            icon: <Check className="w-3 h-3 mr-1" />,
            text: "Select for Interview"
          },
          {
            onClick: () => onStatusUpdate(candidateId, "REJECTED"),
            buttonColor: "bg-red-600",
            shadowColor: "bg-red-800",
            icon: <X className="w-3 h-3 mr-1" />,
            text: "Reject"
          }
        ];
      case "round1":
        return [
          {
            onClick: () => handleStatusUpdateWithInterviewer("IN_PROCESS_ROUND2"),
            buttonColor: "bg-green-600",
            shadowColor: "bg-green-800",
            icon: <Check className="w-3 h-3 mr-1" />,
            text: "Move to Next Round"
          },
          {
            onClick: () => onStatusUpdate(candidateId, "REJECTED"),
            buttonColor: "bg-red-600",
            shadowColor: "bg-red-800",
            icon: <X className="w-3 h-3 mr-1" />,
            text: "Reject"
          }
        ];
      case "round2":
        return [
          {
            onClick: () => handleStatusUpdateWithInterviewer("IN_PROCESS_ROUND3"),
            buttonColor: "bg-green-600",
            shadowColor: "bg-green-800",
            icon: <Check className="w-3 h-3 mr-1" />,
            text: "Move to Next Round"
          },
          {
            onClick: () => onStatusUpdate(candidateId, "REJECTED"),
            buttonColor: "bg-red-600",
            shadowColor: "bg-red-800",
            icon: <X className="w-3 h-3 mr-1" />,
            text: "Reject"
          }
        ];
      case "round3":
        return [
          {
            onClick: () => onStatusUpdate(candidateId, "ON_HOLD"),
            buttonColor: "bg-green-600",
            shadowColor: "bg-green-800",
            icon: <Check className="w-3 h-3 mr-1" />,
            text: "Consider for Hiring"
          },
          {
            onClick: () => onStatusUpdate(candidateId, "REJECTED"),
            buttonColor: "bg-red-600",
            shadowColor: "bg-red-800",
            icon: <X className="w-3 h-3 mr-1" />,
            text: "Reject"
          }
        ];
      case "onhold":
        return [
          {
            onClick: () => onStatusUpdate(candidateId, "HIRED"),
            buttonColor: "bg-green-600",
            shadowColor: "bg-green-800",
            icon: <Check className="w-3 h-3 mr-1" />,
            text: "Hire"
          },
          {
            onClick: () => onStatusUpdate(candidateId, "REJECTED"),
            buttonColor: "bg-red-600",
            shadowColor: "bg-red-800",
            icon: <X className="w-3 h-3 mr-1" />,
            text: "Reject"
          }
        ];
      default:
        return [];
    }
  };

  const buttons = getActionButtons();

  if (buttons.length === 0) return null;

  return (
    <div className="flex items-center justify-end pt-3 space-x-2 border-t border-gray-200">
      {buttons.map((button, index) => (
        <Button3D
          key={index}
          onClick={button.onClick}
          buttonColor={button.buttonColor}
          shadowColor={button.shadowColor}
          className="flex items-center justify-center px-3 py-1.5 text-xs font-medium"
        >
          {button.icon}
          {button.text}
        </Button3D>
      ))}
    </div>
  );
};

export default ActionButtons;
