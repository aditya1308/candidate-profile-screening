import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, MapPin, Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/useAuth';
import Button3D from './Button3D';
import JobFormModal from './JobFormModal';
import ConfirmationModal from './ConfirmationModal';
import ToastNotification from './ToastNotification';
import useToast from '../hooks/useToast';
import Filters from './Filters';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ skills: [], locations: [], titles: [] });
  const [applicationCounts, setApplicationCounts] = useState(null);
  const [applicationSortOrder, setApplicationSortOrder] = useState(null);
  
  // Modal states
  const [showJobModal, setShowJobModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toast notifications
  const { showToast, toastMessage, toastType, showToastMessage, hideToast } = useToast();
  
  // Get user from auth context for role-based access control
  const { user } = useAuth();
  
  // Role-based access control
  const canManageJobs = user?.role === 'SUPERADMIN' || user?.role === 'HR';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const [fetchedJobs, fetchedApplicationCounts] = await Promise.all([
        jobService.getAllJobs(),
        jobService.getApplicationCountsByJob()
      ]);
      setApplicationCounts(fetchedApplicationCounts);
      setJobs(fetchedJobs.map(job => ({
        ...job,
        applications: fetchedApplicationCounts[job.id] ?? 0
      })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateJob = () => {
    if (!canManageJobs) return;
    setSelectedJob(null);
    setShowJobModal(true);
  };

  const handleEditJob = (job, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canManageJobs) return;
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleDeleteJob = (job, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canManageJobs) return;
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const handleJobSubmit = async (jobData) => {
    try {
      setIsSubmitting(true);
      
      if (selectedJob) {
        // Update existing job
        await jobService.updateJob(selectedJob.id, jobData);
        showToastMessage('Job updated successfully!', 'success');
      } else {
        // Create new job
        await jobService.createJob(jobData);
        showToastMessage('Job created successfully!', 'success');
      }
      
      setShowJobModal(false);
      setSelectedJob(null);
      await fetchJobs(); // Refresh the job list
    } catch (err) {
      showToastMessage(err.message || 'Failed to save job', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await jobService.deleteJob(selectedJob.id);
      showToastMessage('Job deleted successfully!', 'success');
      setShowDeleteModal(false);
      setSelectedJob(null);
      await fetchJobs(); // Refresh the job list
    } catch (err) {
      showToastMessage(err.message || 'Failed to delete job', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowJobModal(false);
      setShowDeleteModal(false);
      setSelectedJob(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const matchesSearch = !normalizedSearch ||
      job.title?.toLowerCase().includes(normalizedSearch) ||
      job.description?.toLowerCase().includes(normalizedSearch);
    const normalize = value => (value || '').toLowerCase().trim();
    const matchesTitle = filters.titles.length === 0 || filters.titles.some(title => normalize(title) === normalize(job.title));
    const matchesLocation = filters.locations.length === 0 || filters.locations.some(location => normalize(location) === normalize(job.location));
    const jobSkills = (job.requiredSkills || '').split(/[,\n]+/).map(normalize).filter(Boolean);
    const matchesSkill = filters.skills.length === 0 || filters.skills.some(skill => jobSkills.includes(normalize(skill)));
    return matchesSearch && matchesTitle && matchesLocation && matchesSkill;
  });
  const sortedJobs = applicationSortOrder
    ? [...filteredJobs].sort((first, second) => {
      const difference = first.applications - second.applications;
      return applicationSortOrder === 'desc' ? -difference : difference;
    })
    : filteredJobs;

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-sg-red"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={fetchJobs}
              className="px-4 py-2 mt-4 text-white transition-colors rounded-lg bg-sg-red hover:bg-sg-red-dark"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <label className="flex min-w-0 flex-1 items-center rounded-md border border-gray-200 bg-white px-3 shadow-sm">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs..."
              aria-label="Search jobs by title or description"
              className="w-full min-w-0 py-2 text-sm outline-none"
            />
          </label>
          <Filters jobs={jobs} filters={filters} onChange={setFilters} />
          <button
            type="button"
            disabled={applicationCounts === null}
            onClick={() => setApplicationSortOrder(currentOrder => currentOrder === 'desc' ? 'asc' : 'desc')}
            title={applicationCounts === null ? 'Application counts are not available yet' : 'Sort jobs by applicant count'}
            aria-label={applicationSortOrder === 'desc'
              ? 'Sort by applicant count, currently high to low'
              : applicationSortOrder === 'asc'
                ? 'Sort by applicant count, currently low to high'
                : 'Sort by applicant count'}
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors enabled:hover:border-sg-red enabled:hover:text-sg-red disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          >
            <ArrowUpDown className="h-4 w-4" />
            {applicationSortOrder === 'desc'
              ? 'Applicants: High to Low'
              : applicationSortOrder === 'asc'
                ? 'Applicants: Low to High'
                : 'Sort by Applicants'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Add Job Plus Card - Only for HR and SuperAdmin */}
          {canManageJobs && (
            <div
              onClick={handleCreateJob}
              className="flex flex-col items-center justify-center h-full p-6 transition-all duration-200 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sg-red hover:bg-gray-50 min-h-[200px]"
            >
              <div className="flex flex-col items-center text-gray-500 hover:text-sg-red">
                <Plus className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold">Add New Job</h3>
                <p className="text-sm text-center">Click to create a new job posting</p>
              </div>
            </div>
          )}

          {/* Existing Job Cards */}
          {sortedJobs.map(job => (
            <div
              key={job.id}
              className="flex flex-col h-full p-6 transition-all duration-200 bg-white rounded-lg shadow-lg card hover:-translate-y-1 shadow-gray-400/40 hover:shadow-xl hover:shadow-gray-500/50 relative group"
            >
              {/* Action Buttons - Only for HR and SuperAdmin */}
              {canManageJobs && (
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEditJob(job, e)}
                    className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                    title="Edit Job"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteJob(job, e)}
                    className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <Link
                to={`/jobs/${job.id}`}
                className="flex flex-col h-full"
              >
                <div className="flex-grow">
                  <div className={`mb-4 ${canManageJobs ? 'pr-16' : ''}`}>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center mb-3 text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{job.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {job.applications} {job.applications === 1 ? 'applicant' : 'applicants'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <Button3D 
                    buttonColor="bg-sg-red" 
                    shadowColor="bg-black"
                  >
                    View Details
                  </Button3D>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Job Form Modal - Only render if user can manage jobs */}
      {canManageJobs && (
        <JobFormModal
          isOpen={showJobModal}
          onClose={handleCloseModal}
          onSubmit={handleJobSubmit}
          job={selectedJob}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal - Only render if user can manage jobs */}
      {canManageJobs && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title="Delete Job"
          message={`Are you sure you want to delete "${selectedJob?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={isSubmitting}
          type="danger"
        />
      )}

      {/* Toast Notification */}
      <ToastNotification
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={hideToast}
      />
    </div>
  );
};

export default JobList;