import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage.jsx'
import JobListings from './components/JobListings.jsx'
import ApplicationForm from './components/ApplicationForm.jsx'
import AboutPage from './components/AboutPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import Header from './components/Header.jsx'
import { jobService } from './services/jobService.js'
import { useState, useEffect } from 'react'

const ApplicantRoutes = () => {
  const [currentPage, setCurrentPage] = useState('landing')
  const [selectedJob, setSelectedJob] = useState(null)
  const [submittedApplication, setSubmittedApplication] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (currentPage === 'jobs') {
      fetchJobs()
    }
  }, [currentPage])

  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedJobs = await jobService.getAllJobs()
      setJobs(fetchedJobs)
    } catch (err) {
      setError('Failed to load jobs. Please try again later.')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExploreClick = () => setCurrentPage('jobs')
  const handleJobClick = (job) => { setSelectedJob(job); setCurrentPage('apply') }
  const handleBackToJobs = () => { setCurrentPage('jobs'); setSelectedJob(null) }
  const handleApplicationSubmit = (application) => { setSubmittedApplication(application); setCurrentPage('success') }
  const handleBackToLanding = () => { setCurrentPage('landing'); setSelectedJob(null); setSubmittedApplication(null) }

  if (currentPage === 'landing') return <LandingPage onExploreClick={handleExploreClick} />
  if (currentPage === 'jobs') return (
    <div>
      <Header 
        showBackButton={true}
        backButtonText="← Back to Home"
        onBackClick={handleBackToLanding}
      />
      
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job openings...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Error Loading Jobs</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={fetchJobs} className="btn-primary w-full mb-3">Try Again</button>
            <button onClick={handleBackToLanding} className="btn-secondary w-full">Back to Home</button>
          </div>
        </div>
      )}
      
      {!loading && !error && (
        <JobListings jobs={jobs} onJobClick={handleJobClick} userType="applicant" />
      )}
    </div>
  )
  if (currentPage === 'apply' && selectedJob) return (
    <div>
      <Header 
        showBackButton={true}
        backButtonText="← Back to Jobs"
        onBackClick={handleBackToJobs}
      />
      <ApplicationForm job={selectedJob} onBack={handleBackToJobs} onSubmit={handleApplicationSubmit} />
    </div>
  )
  if (currentPage === 'success' && submittedApplication) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
        <p className="text-gray-600 mb-6">Thank you for your application. We've received your submission and will review it carefully.</p>
        <button onClick={handleBackToLanding} className="btn-primary w-full">Back to Home</button>
      </div>
    </div>
  )
  return <LandingPage onExploreClick={handleExploreClick} />
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<ApplicantRoutes />} />
        <Route path="/jobs" element={<ApplicantRoutes />} />
        <Route path="/apply" element={<ApplicantRoutes />} />
        <Route path="/about" element={<AboutPage onBackToLanding={() => (window.location.href = '/')} />} />
        <Route path="/contact" element={<ContactPage onBackToLanding={() => (window.location.href = '/')} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
