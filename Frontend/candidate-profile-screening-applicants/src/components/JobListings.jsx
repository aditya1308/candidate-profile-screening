import { useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, MapPin, Search, Upload, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import Filters from './Filters';
import { useCandidateAuth } from '../context/useCandidateAuth';
import { jobService } from '../services/jobService';

const JobListings = ({ jobs = [], onJobClick, userType = 'applicant' }) => {
  const [filters, setFilters] = useState({ skills: [], locations: [], titles: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [showMatchUpload, setShowMatchUpload] = useState(false);
  const [resume, setResume] = useState(null);
  const [matchScores, setMatchScores] = useState({});
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState('');
  const resumeInputRef = useRef(null);
  const { isAuthenticated, loading: authLoading } = useCandidateAuth();
  const candidateIsAuthenticated = !authLoading && isAuthenticated();

  const filteredJobs = useMemo(() => {
    const normalize = (value) => (value || '').toLowerCase().trim();
    const normalizedSearch = normalize(searchTerm);

    const selectedTitles = (filters.titles || []).map(normalize);
    const selectedLocations = (filters.locations || []).map(normalize);
    const selectedSkills = (filters.skills || []).map(normalize);

    const hasAnyFilter = normalizedSearch || selectedTitles.length > 0 || selectedLocations.length > 0 || selectedSkills.length > 0;
    if (!hasAnyFilter) return jobs;

    return jobs.filter((job) => {
      if (normalizedSearch && ![job.title, job.description].some((value) => normalize(value).includes(normalizedSearch))) {
        return false;
      }

      if (selectedTitles.length > 0 && !selectedTitles.includes(normalize(job.title))) {
        return false;
      }

      if (selectedLocations.length > 0 && !selectedLocations.includes(normalize(job.location))) {
        return false;
      }

      if (selectedSkills.length > 0) {
        const jobSkills = (job.requiredSkills || '')
          .split(/[,\n]+/)
          .map(normalize)
          .filter(Boolean);

        const anySkillPresent = selectedSkills.some((skill) => jobSkills.includes(skill));
        if (!anySkillPresent) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, filters, searchTerm]);

  const handleMatchSubmit = async (selectedResume = resume) => {
    if (!selectedResume || isMatching) return;
    setIsMatching(true);
    setMatchError('');
    setMatchScores({});
    try {
      const matches = await jobService.matchJobs(selectedResume);
      setMatchScores(Object.fromEntries(
        matches.map(({ jobId, matchPercentage }) => [String(jobId), matchPercentage])
      ));
      setShowMatchUpload(false);
      setResume(null);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    } catch (error) {
      setMatchError(error.message || 'Unable to match this resume to the available jobs.');
    } finally {
      setIsMatching(false);
    }
  };

  const selectResume = (file) => {
    setMatchError('');
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') || file.type && file.type !== 'application/pdf') {
      setResume(null);
      setMatchError('Please upload a PDF resume.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResume(null);
      setMatchError('The PDF must be 5MB or smaller.');
      return;
    }
    setResume(file);
    void handleMatchSubmit(file);
  };

  return (
    <div className="min-h-screen bg-sg-gray pb-16">
      <Header />
      
      <main className="pt-16">
        <div className="p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {userType === 'applicant' ? 'Available Positions' : 'Job Openings Dashboard'}
                </h1>
                <p className="text-gray-600">
                  {userType === 'applicant' 
                    ? 'Explore exciting opportunities and find your next career move'
                    : 'Manage and monitor all active job postings'
                  }
                </p>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="text-sm text-gray-600">
                  Browse {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
                </div>
                <button
                  type="button"
                  disabled={!candidateIsAuthenticated}
                  onClick={() => {
                    setMatchError('');
                    setShowMatchUpload(true);
                  }}
                  title={candidateIsAuthenticated ? 'Match your resume to available jobs' : 'Sign in to use Match %'}
                  className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors enabled:border-sg-red enabled:bg-white enabled:text-sg-red enabled:hover:bg-sg-red/5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Match %
                </button>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center rounded-md border border-gray-200 bg-white px-3 shadow-sm">
                  <Search className="mr-2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search jobs..."
                    aria-label="Search jobs by title or description"
                    className="w-56 py-2 text-sm outline-none"
                  />
                </label>
                <Filters jobs={jobs} filters={filters} onChange={setFilters} />
              </div>
            </div>

            <div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="card relative flex h-full cursor-pointer flex-col rounded-lg bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 shadow-gray-400/40 hover:shadow-xl hover:shadow-gray-500/50"
                      onClick={() => onJobClick(job)}
                    >
                      <div className="flex-grow">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900">{job.title}</h3>
                          {matchScores[job.id] !== undefined && (
                            <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                              {matchScores[job.id]}% match
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <div className="mb-3 flex items-center text-gray-600">
                            <MapPin className="mr-2 h-4 w-4" />
                            <span className="text-sm">{job.location || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-4">
                        <div className="group relative">
                          <div
                            className="absolute left-0 top-0 h-full w-full bg-black transition-all duration-200 group-hover:opacity-0"
                            style={{ transform: 'translate(4px, 4px)' }}
                          />

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onJobClick(job);
                            }}
                            className="relative w-full transform bg-sg-red px-6 py-4 font-semibold text-white transition-all duration-200 hover:bg-sg-red/90 group-hover:translate-x-1 group-hover:translate-y-1 focus:outline-none focus:ring-2 focus:ring-sg-red focus:ring-offset-2"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredJobs.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-lg text-gray-500">No jobs found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
        </div>
      </main>

      <Footer />

      {showMatchUpload && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isMatching) setShowMatchUpload(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="match-upload-title"
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 id="match-upload-title" className="text-xl font-semibold text-gray-900">Match your resume</h2>
                <p className="mt-1 text-sm text-gray-600">Upload a PDF to see how it matches every open position.</p>
              </div>
              <button
                type="button"
                aria-label="Close resume upload"
                disabled={isMatching}
                onClick={() => setShowMatchUpload(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(event) => {
              event.preventDefault();
              void handleMatchSubmit();
            }}>
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  selectResume(event.dataTransfer.files[0]);
                }}
                className="flex min-h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition-colors hover:border-sg-red"
              >
                {resume ? (
                  <>
                    <CheckCircle2 className="mb-3 h-10 w-10 text-green-600" />
                    <p className="max-w-full truncate text-sm font-medium text-gray-800">{resume.name}</p>
                    <button
                      type="button"
                      disabled={isMatching}
                      onClick={() => {
                        setResume(null);
                        if (resumeInputRef.current) resumeInputRef.current.value = '';
                      }}
                      className="mt-2 text-sm font-medium text-sg-red hover:underline"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="mb-3 h-10 w-10 text-gray-400" />
                    <label htmlFor="match-resume" className="cursor-pointer text-sm text-gray-600">
                      <span className="font-semibold text-sg-red hover:text-sg-red/80">Choose a PDF</span>
                      <span> or drag and drop it here</span>
                    </label>
                    <input
                      ref={resumeInputRef}
                      id="match-resume"
                      type="file"
                      accept="application/pdf,.pdf"
                      disabled={isMatching}
                      onChange={(event) => selectResume(event.target.files[0])}
                      className="sr-only"
                    />
                    <p className="mt-2 text-xs text-gray-500">PDF up to 5MB</p>
                  </>
                )}
              </div>

              {matchError && (
                <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {matchError}
                </p>
              )}
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isMatching}
                  onClick={() => setShowMatchUpload(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!resume || isMatching}
                  className="rounded-lg bg-sg-red px-4 py-2 text-sm font-semibold text-white hover:bg-sg-red/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isMatching ? 'Matching jobs...' : matchError && resume ? 'Try again' : 'Find matches'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default JobListings;