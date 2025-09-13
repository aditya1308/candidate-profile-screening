import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './components/LandingPage.jsx'
import JobListings from './components/JobListings.jsx'
import ApplicationForm from './components/ApplicationForm.jsx'
import AboutPage from './components/AboutPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import ChatBot from './components/ChatBot.jsx'
import { jobService } from './services/jobService.js'
import { useState, useEffect } from 'react'

const ApplicantRoutes = () => {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState('landing')
  const [selectedJob, setSelectedJob] = useState(null)
  const [submittedApplication, setSubmittedApplication] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Handle URL changes
  useEffect(() => {
    const path = location.pathname
    if (path === '/jobs') {
      setCurrentPage('jobs')
    } else if (path === '/apply') {
      setCurrentPage('apply')
    } else if (path === '/') {
      setCurrentPage('landing')
    }
  }, [location.pathname])

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
  
  if (currentPage === 'jobs') {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-sg-gray">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-sg-red"></div>
            <p className="text-gray-600">Loading job openings...</p>
          </div>
        </div>
      )
    }
    
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen p-6 bg-sg-gray">
          <div className="w-full max-w-md p-8 text-center bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="mb-2 text-xl font-bold text-gray-900">Error Loading Jobs</h1>
            <p className="mb-6 text-gray-600">{error}</p>
            <button onClick={fetchJobs} className="w-full px-6 py-3 mb-3 font-semibold text-white transition-all duration-200 rounded-lg bg-sg-red hover:bg-sg-red/90">Try Again</button>
            <button onClick={handleBackToLanding} className="w-full px-6 py-3 font-semibold transition-all duration-200 border rounded-lg text-sg-red border-sg-red hover:bg-sg-red/10">Back to Home</button>
          </div>
        </div>
      )
    }
    
    return <JobListings jobs={jobs} onJobClick={handleJobClick} userType="applicant" />
  }
  
  if (currentPage === 'apply' && selectedJob) {
    return <ApplicationForm job={selectedJob} onBack={handleBackToJobs} onSubmit={handleApplicationSubmit} />
  }
  
  if (currentPage === 'success' && submittedApplication) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-sg-gray">
        <div className="w-full max-w-md p-8 text-center bg-white shadow-xl rounded-xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Application Submitted!</h1>
          <p className="mb-6 text-gray-600">Thank you for your application. We've received your submission and will review it carefully.</p>
          <button onClick={handleBackToLanding} className="w-full px-6 py-3 font-semibold text-white transition-all duration-200 rounded-lg bg-sg-red hover:bg-sg-red/90">Back to Home</button>
        </div>
      </div>
    )
  }
  
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
      <ChatBot />
    </Router>
  )
}
