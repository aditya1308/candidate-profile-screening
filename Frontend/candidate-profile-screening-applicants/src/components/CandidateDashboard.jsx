import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Briefcase, Award, CheckCircle, Clock, LogOut, ArrowRight } from 'lucide-react';
import { useCandidateAuth } from '../context/useCandidateAuth';
import { candidateAuthService } from '../services/candidateAuthService';
import Header from './Header';
import Footer from './Footer';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useCandidateAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/candidate/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await candidateAuthService.getProfile();
        setProfile(data);
        const candidateId = data?.id || user?.id;
        if (candidateId) {
          const apps = await candidateAuthService.getApplications(candidateId);
          setApplications(apps);
        }
      } catch (err) {
        console.warn('Could not fetch detailed profile from server, using local user data:', err);
        setProfile(user);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toUpperCase() : 'IN_PROCESS';
    if (s.includes('HIRED')) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Hired
        </span>
      );
    }
    if (s.includes('REJECTED')) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          Not Selected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
        <Clock className="w-3.5 h-3.5 mr-1" /> {status || 'In Process'}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sg-gray via-white to-sg-gray/30">
      <Header
        showNavigation={true}
        showBackButton={true}
        backButtonText="Back to Jobs"
        onBackClick={() => navigate('/jobs')}
        className="relative z-20 bg-white/90 backdrop-blur-md border-b border-gray-100"
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-sg-red"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Candidate Header Banner */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sg-red to-red-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {profile?.name || user?.name || 'Candidate'}
                    </h1>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {profile?.email || user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/jobs')}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-sg-red hover:bg-sg-red/90 text-white font-medium rounded-xl text-sm transition-colors shadow flex items-center justify-center"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  View Open Jobs
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 font-medium rounded-xl text-sm transition-colors flex items-center"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile & Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Details */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
                  <User className="w-5 h-5 text-sg-red mr-2" /> Personal Details
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs font-medium">Full Name</span>
                    <span className="text-gray-900 font-semibold">{profile?.name || user?.name || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs font-medium">Email</span>
                    <span className="text-gray-900 font-semibold break-all">{profile?.email || user?.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs font-medium">Phone</span>
                    <span className="text-gray-900 font-semibold">{profile?.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Match Score & Skills */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 md:col-span-2 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
                  <Award className="w-5 h-5 text-sg-red mr-2" /> Application Highlights
                </h2>
                {profile?.score !== undefined && profile?.score !== null && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-600">Profile Match Score</span>
                      <span className="text-sm font-bold text-sg-red">{profile.score}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-sg-red h-2.5 rounded-full"
                        style={{ width: `${Math.min(Math.max(profile.score, 0), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {profile?.summary && (
                  <div>
                    <span className="text-gray-500 block text-xs font-medium mb-1">AI Screening Summary</span>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      {profile.summary}
                    </p>
                  </div>
                )}

                {profile?.matchedSkills && profile.matchedSkills.length > 0 && (
                  <div>
                    <span className="text-gray-500 block text-xs font-medium mb-2">Matched Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.matchedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-red-50 text-sg-red border border-red-200 rounded-lg text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {!profile?.summary && (!profile?.matchedSkills || profile.matchedSkills.length === 0) && (
                  <div className="text-center py-6 text-gray-500">
                    <p className="text-sm">Ready to apply for jobs? Explore open roles and submit your resume.</p>
                    <button
                      onClick={() => navigate('/jobs')}
                      className="mt-3 inline-flex items-center text-sg-red hover:underline text-sm font-semibold"
                    >
                      Browse Available Positions <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Applied Jobs Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 text-sg-red mr-2" /> My Applications
              </h2>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{app.job?.title || 'Unknown Job'}</h3>
                        <p className="text-sm text-gray-500">{app.job?.location || 'Unknown Location'}</p>
                        <p className="text-xs text-gray-400 mt-1">Applied on: {new Date(app.applicationDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        {getStatusBadge(app.candidate?.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't applied to any jobs yet.</p>
                  <button onClick={() => navigate('/jobs')} className="mt-3 text-sg-red hover:underline text-sm font-semibold">
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
            
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CandidateDashboard;
