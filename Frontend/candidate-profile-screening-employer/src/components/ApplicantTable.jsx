import { useState } from 'react';
import { applicants } from '../../../shared/data/mockData';

const ApplicantTable = ({ jobId, stage, title }) => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredApplicants = applicants.filter(
    app => app.jobId === jobId && app.stage === stage
  );

  const openPreview = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const closePreview = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const Modal = ({ isOpen, onClose, applicant }) => {
    if (!isOpen || !applicant) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-[800px] h-[600px] bg-white rounded-2xl shadow-2xl transform transition-all">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-2 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* PDF Content */}
            <div className="pt-16 pb-8 px-8 h-full">
              <iframe
                src={applicant.resumeUrl}
                className="w-full h-[400px] border-0 rounded-lg"
                title={`${applicant.name}'s Resume`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApplicants.map((applicant) => (
              <tr key={applicant.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {applicant.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {applicant.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {applicant.experience}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(applicant.appliedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => openPreview(applicant)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    View Resume
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closePreview} 
        applicant={selectedApplicant} 
      />
    </div>
  );
};

export default ApplicantTable;
