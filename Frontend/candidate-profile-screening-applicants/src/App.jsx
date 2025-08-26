import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage.jsx'
import JobListings from './components/JobListings.jsx'
import ApplicationForm from './components/ApplicationForm.jsx'
import AboutPage from './components/AboutPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import { jobOpenings } from '../../shared/data/mockData.js'
import { useState } from 'react'

const ApplicantRoutes = () => {
  const [currentPage, setCurrentPage] = useState('landing')
  const [selectedJob, setSelectedJob] = useState(null)
  const [submittedApplication, setSubmittedApplication] = useState(null)

  const handleExploreClick = () => setCurrentPage('jobs')
  const handleJobClick = (job) => { setSelectedJob(job); setCurrentPage('apply') }
  const handleBackToJobs = () => { setCurrentPage('jobs'); setSelectedJob(null) }
  const handleApplicationSubmit = (application) => { setSubmittedApplication(application); setCurrentPage('success') }
  const handleBackToLanding = () => { setCurrentPage('landing'); setSelectedJob(null); setSubmittedApplication(null) }

  if (currentPage === 'landing') return <LandingPage onExploreClick={handleExploreClick} />
  if (currentPage === 'jobs') return (
    <div>
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-secondary-900 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">SG</span></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Société Générale</h1>
                <p className="text-sm text-gray-600">Career Opportunities</p>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
              <button onClick={handleBackToLanding} className="text-primary-600 hover:text-primary-700 font-medium transition-colors">← Back to Home</button>
            </nav>
          </div>
        </div>
      </div>
      <JobListings jobs={jobOpenings} onJobClick={handleJobClick} userType="applicant" />
    </div>
  )
  if (currentPage === 'apply' && selectedJob) return (
    <div>
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-secondary-900 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">SG</span></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Société Générale</h1>
                <p className="text-sm text-gray-600">Apply for {selectedJob.title}</p>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
              <button onClick={handleBackToJobs} className="text-primary-600 hover:text-primary-700 font-medium transition-colors">← Back to Jobs</button>
            </nav>
          </div>
        </div>
      </div>
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
