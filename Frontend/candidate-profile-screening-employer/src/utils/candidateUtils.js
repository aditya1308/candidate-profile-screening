// Utility functions for candidate management

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getScoreColor = (score) => {
  // Score is now out of 100, so we adjust the thresholds accordingly
  if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
  if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-red-100 text-red-800 border-red-200";
};

export const filterCandidatesByTab = (candidates, tabId) => {
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

export const downloadResume = (fileData, candidateName) => {
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

export const openEmailClient = (email, candidateName) => {
  try {
    const subject = encodeURIComponent(
      `Regarding your application - ${candidateName}`
    );
    const body = encodeURIComponent(
      `Dear ${candidateName},\n\nThank you for your interest in our position.\n\nBest regards,\n[Your Name]`
    );
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    window.open(mailtoLink, "_blank");
    return { success: true, message: "Email client opened successfully!" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Failed to open email client" };
  }
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: "Phone number copied to clipboard!" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Failed to copy phone number" };
  }
};
