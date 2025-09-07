import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { candidateService } from '../services/candidateService';
import Button3D from './Button3D';

/**
 * BulkUploadModal - Modal component for bulk uploading resumes
 * 
 * Note: This component should only be rendered for HR and SUPERADMIN roles.
 * Role-based access control is handled in the parent component (HRJobDetailsPage).
 */

const BulkUploadModal = ({ isOpen, onClose, jobId, jobTitle }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadResults, setUploadResults] = useState(null); // Store the detailed results
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      setUploadStatus('error');
      setUploadMessage('Please select only PDF files.');
      return;
    }
    
    setSelectedFiles(pdfFiles);
    setUploadStatus(null);
    setUploadMessage('');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      setUploadStatus('error');
      setUploadMessage('Please drop only PDF files.');
      return;
    }
    
    setSelectedFiles(pdfFiles);
    setUploadStatus(null);
    setUploadMessage('');
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('error');
      setUploadMessage('Please select at least one PDF file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    setUploadMessage('');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await candidateService.bulkUploadResumes(jobId, selectedFiles);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Store the detailed results
      setUploadResults(result);
      
      const processedCount = result.processedCandidates?.length || 0;
      const unprocessedCount = result.unProcessedCandidates?.length || 0;
      
      setUploadStatus('success');
      setUploadMessage(`Upload completed! ${processedCount} candidates processed successfully, ${unprocessedCount} files could not be processed.`);
      
      // Don't auto-close the modal, let user review the results
      
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(error.message || 'Failed to upload resumes. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFiles([]);
      setUploadProgress(0);
      setUploadStatus(null);
      setUploadMessage('');
      setUploadResults(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  const handleNewUpload = () => {
    setSelectedFiles([]);
    setUploadProgress(0);
    setUploadStatus(null);
    setUploadMessage('');
    setUploadResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Bulk Upload Resumes</h2>
            <p className="text-sm text-gray-600">Upload multiple resumes for: {jobTitle}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 p-6 overflow-y-auto"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* File Upload Area */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isUploading}
            />
            
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <Upload className={`w-12 h-12 ${selectedFiles.length > 0 ? 'text-green-500' : 'text-gray-400'}`} />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Drop PDF files anywhere or click to browse'}
                </p>
                <p className="text-sm text-gray-500">
                  Select multiple PDF resume files to upload
                </p>
              </div>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-gray-900">Selected Files ({selectedFiles.length}):</h3>
              <div className="p-4 space-y-2 overflow-y-auto border border-gray-200 rounded-lg max-h-80 bg-gray-50">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                      className="p-1 text-gray-400 transition-colors rounded hover:text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 transition-all duration-300 rounded-full bg-sg-red"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {uploadStatus && (
            <div className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
              uploadStatus === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {uploadStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <p className={`text-sm ${
                uploadStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {uploadMessage}
              </p>
            </div>
          )}

          {/* Detailed Results */}
          {uploadResults && uploadStatus === 'success' && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Results</h3>
              
              {/* Successfully Processed Candidates */}
              {uploadResults.processedCandidates && uploadResults.processedCandidates.length > 0 && (
                <div className="space-y-3">
                  <h4 className="flex items-center space-x-2 text-sm font-medium text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Successfully Processed ({uploadResults.processedCandidates.length})</span>
                  </h4>
                  <div className="p-3 space-y-2 overflow-y-auto border border-green-200 rounded-lg max-h-80 bg-green-50">
                    {uploadResults.processedCandidates.map((candidate, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                              <span className="text-xs font-medium text-green-700">{candidate.score || 'N/A'}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                              <p className="text-xs text-gray-600">{candidate.email}</p>
                              <p className="text-xs text-gray-500">Score: {candidate.score}/10</p>
                            </div>
                          </div>
                          {candidate.matchedSkills && candidate.matchedSkills.length > 0 && (
                            <div className="mt-2">
                              <p className="mb-1 text-xs text-gray-600">Matched Skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {candidate.matchedSkills.slice(0, 3).map((skill, skillIndex) => (
                                  <span key={skillIndex} className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
                                    {skill}
                                  </span>
                                ))}
                                {candidate.matchedSkills.length > 3 && (
                                  <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded">
                                    +{candidate.matchedSkills.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            Processed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unprocessed Files */}
              {uploadResults.unProcessedCandidates && uploadResults.unProcessedCandidates.length > 0 && (
                <div className="space-y-3">
                  <h4 className="flex items-center space-x-2 text-sm font-medium text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span>Could Not Process ({uploadResults.unProcessedCandidates.length})</span>
                  </h4>
                  <div className="p-3 space-y-2 overflow-y-auto border border-red-200 rounded-lg max-h-60 bg-red-50">
                    {uploadResults.unProcessedCandidates.map((filename, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-red-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">{filename}</span>
                            <p className="text-xs text-red-600">Duplicate candidate, already applied</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                          Duplicate
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-red-600">
                    These candidates have already applied for this job position.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 space-x-4 border-t border-gray-200 rounded-b-lg bg-gray-50">
          {uploadResults ? (
            // Show different buttons after upload completion
            <>
              <div className="w-40">
                <Button3D
                  onClick={handleNewUpload}
                  disabled={isUploading}
                  buttonColor="bg-gray-500"
                  shadowColor="bg-black"
                  className="px-6 py-3 text-sm font-medium"
                >
                  Upload More
                </Button3D>
              </div>
              <div className="w-32">
                <Button3D
                  onClick={handleClose}
                  disabled={isUploading}
                  buttonColor="bg-sg-red"
                  shadowColor="bg-black"
                  className="px-6 py-3 text-sm font-medium"
                >
                  Done
                </Button3D>
              </div>
            </>
          ) : (
            // Show normal upload buttons
            <>
              <div className="w-32">
                <Button3D
                  onClick={handleClose}
                  disabled={isUploading}
                  buttonColor="bg-gray-500"
                  shadowColor="bg-black"
                  className="px-6 py-3 text-sm font-medium"
                >
                  Cancel
                </Button3D>
              </div>
              <div className="w-64">
                <Button3D
                  onClick={handleUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                  buttonColor="bg-sg-red"
                  shadowColor="bg-black"
                  className="px-6 py-3 text-sm font-medium"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload {selectedFiles.length} Resume{selectedFiles.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </Button3D>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
