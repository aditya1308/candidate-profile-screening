import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import SGLogo from '../assets/SG.svg';
import Button3D from '../components/Button3D';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    username: '', 
    email: '',
    password: '', 
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(credentials.username, credentials.password);
      if (success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const adminData = {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.name,
        role: registerData.role
      };
      
      await register(adminData);
      setError('Registration successful! Please login with your credentials.');
      setIsLogin(true);
      setRegisterData({ name: '', username: '', email: '', password: '', role: '' });
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Side - Modern Background */}
      <div className="hidden md:flex md:w-2/5 lg:w-1/3 xl:w-2/5 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sg-red via-red-600 to-red-800"></div>
        
        {/* Modern geometric patterns */}
        <div className="absolute inset-0">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          
                  {/* Floating elements - Responsive sizes */}
        <div className="absolute top-10 md:top-20 right-8 md:right-16 w-24 md:w-32 lg:w-40 h-24 md:h-32 lg:h-40 bg-white/8 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 md:bottom-32 left-8 md:left-20 w-32 md:w-40 lg:w-48 h-32 md:h-40 lg:h-48 bg-white/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-4 md:left-8 lg:left-16 w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
          
          {/* Modern grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
        </div>

        {/* Logo with white shadow - Responsive positioning */}
        <div className="absolute top-4 md:top-6 lg:top-8 left-4 md:left-6 lg:left-8 z-20">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5 md:p-2 shadow-lg">
            <img src={SGLogo} alt="Societe Generale" className="h-6 md:h-8 lg:h-10 w-auto opacity-95" />
          </div>
        </div>
        
        {/* Main Content - Responsive spacing */}
        <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-6 lg:px-8 xl:px-12 pt-12 md:pt-16 lg:pt-20">
          <div className="max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            {/* Welcome Section - Responsive typography */}
            <div className="mb-6 md:mb-8 text-left">
              <div className="text-center mb-4 md:mb-6">
                <div className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/25">
                  <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full mr-1.5 md:mr-2 animate-pulse"></div>
                  <span className="text-white text-xs md:text-sm font-bold">Recruitment Dashboard</span>
                </div>
              </div>
              
              <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 md:mb-3 leading-tight text-center">
                Welcome to the Future
              </h1>
              
              <p className="text-xs md:text-sm lg:text-base text-white/90 font-bold leading-relaxed mb-3 md:mb-4 text-center md:text-left">
                Transform your recruitment process with our advanced candidate screening platform. 
                Make data-driven decisions and find the perfect talent for your organization.
              </p>
            </div>

            {/* Features Grid - Responsive cards */}
            <div className="space-y-2 md:space-y-3 lg:space-y-4 mb-6 md:mb-8">
              <div className="group flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-white/15 backdrop-blur-md rounded-lg md:rounded-xl border border-white/25 hover:bg-white/20 transition-all duration-300">
                <div className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 bg-white/25 rounded-md md:rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-3 md:w-3.5 lg:w-4 h-3 md:h-3.5 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs md:text-sm">Smart Screening</h3>
                  <p className="text-white/80 font-bold text-xs md:text-xs">AI-powered candidate evaluation</p>
                </div>
              </div>

              <div className="group flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-white/15 backdrop-blur-md rounded-lg md:rounded-xl border border-white/25 hover:bg-white/20 transition-all duration-300">
                <div className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 bg-white/25 rounded-md md:rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-3 md:w-3.5 lg:w-4 h-3 md:h-3.5 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs md:text-sm">Real-time Analytics</h3>
                  <p className="text-white/80 font-bold text-xs md:text-xs">Track recruitment metrics instantly</p>
                </div>
              </div>

              <div className="group flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-white/15 backdrop-blur-md rounded-lg md:rounded-xl border border-white/25 hover:bg-white/20 transition-all duration-300">
                <div className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 bg-white/25 rounded-md md:rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-3 md:w-3.5 lg:w-4 h-3 md:h-3.5 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs md:text-sm">Team Collaboration</h3>
                  <p className="text-white/80 font-bold text-xs md:text-xs">Seamless HR team coordination</p>
                </div>
              </div>
            </div>

            {/* Stats - Responsive grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-md md:rounded-lg p-2 md:p-3 border border-white/20">
                <div className="text-sm md:text-lg lg:text-xl font-bold text-white mb-0.5 md:mb-1">500+</div>
                <div className="text-white/80 font-bold text-xs md:text-xs">Candidates</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-md md:rounded-lg p-2 md:p-3 border border-white/20">
                <div className="text-sm md:text-lg lg:text-xl font-bold text-white mb-0.5 md:mb-1">50+</div>
                <div className="text-white/80 font-bold text-xs md:text-xs">Positions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-md md:rounded-lg p-2 md:p-3 border border-white/20">
                <div className="text-sm md:text-lg lg:text-xl font-bold text-white mb-0.5 md:mb-1">95%</div>
                <div className="text-white/80 font-bold text-xs md:text-xs">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Hero Section - Enhanced responsiveness */}
      <div className="md:hidden relative overflow-hidden bg-gradient-to-br from-sg-red via-red-600 to-red-800 py-6 sm:py-8 px-4 sm:px-6">
        {/* Mobile background elements - Responsive sizes */}
        <div className="absolute inset-0">
          <div className="absolute top-6 sm:top-8 right-6 sm:right-8 w-20 sm:w-24 h-20 sm:h-24 bg-white/8 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 w-24 sm:w-28 h-24 sm:h-28 bg-white/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Mobile Logo with white shadow - Responsive */}
        <div className="relative z-10 mb-4 sm:mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 shadow-lg inline-block">
            <img src={SGLogo} alt="Societe Generale" className="h-6 sm:h-8 w-auto opacity-95" />
          </div>
        </div>

        {/* Mobile Content - Enhanced responsiveness */}
        <div className="relative z-10 text-left">
          <div className="text-center mb-3 sm:mb-4">
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/25">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
              <span className="text-white text-xs sm:text-sm font-bold">Recruitment Dashboard</span>
            </div>
          </div>
          
          <h1 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 text-center">
            Welcome to the Future
          </h1>
          
          <p className="text-xs sm:text-sm text-white/90 font-bold leading-relaxed mb-3 sm:mb-4 text-center">
            Transform your recruitment process with our advanced candidate screening platform.
          </p>

          {/* Mobile Stats - Responsive */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-white/20">
              <div className="text-sm sm:text-base font-bold text-white">500+</div>
              <div className="text-white/80 font-bold text-xs">Candidates</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-white/20">
              <div className="text-sm sm:text-base font-bold text-white">50+</div>
              <div className="text-white/80 font-bold text-xs">Positions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-white/20">
              <div className="text-sm sm:text-base font-bold text-white">95%</div>
              <div className="text-white/80 font-bold text-xs">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form - Enhanced responsiveness */}
      <div className="flex-1 md:w-3/5 lg:w-2/3 xl:w-3/5 flex flex-col">
        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 lg:py-0">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-2xl">
            {/* Header - Responsive typography */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 bg-sg-red/10 rounded-full border border-sg-red/20 mb-3 sm:mb-4">
                <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-sg-red rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
                <span className="text-sg-red text-xs font-medium">Secure Access</span>
              </div>
              
              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                {isLogin ? 'Welcome Back' : 'Join Our Team'}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                {isLogin 
                  ? 'Sign in to access your recruitment dashboard' 
                  : 'Create your account to start managing applications'
                }
              </p>
            </div>

            {/* Tab Switching - Responsive */}
            <div className="flex bg-gray-100 rounded-lg sm:rounded-xl p-1 sm:p-1.5 mb-6 sm:mb-8">
            <button
              onClick={() => setIsLogin(true)}
              disabled={loading}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all duration-300 rounded-md sm:rounded-lg ${
                isLogin 
                    ? 'bg-white text-sg-red shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-800'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              disabled={loading}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all duration-300 rounded-md sm:rounded-lg ${
                !isLogin 
                    ? 'bg-white text-sg-red shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-800'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Register
            </button>
          </div>

            {/* Form Card - Responsive padding */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8 xl:p-10 relative">
              {/* Error Message - Responsive */}
              {error && (
                <div className={`mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-md sm:rounded-lg ${
                  error.includes('successful') 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`text-xs sm:text-sm font-medium ${
                    error.includes('successful') ? 'text-green-600' : 'text-red-600'
                  }`}>{error}</div>
                </div>
              )}

              {/* Loading Overlay - Responsive */}
              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-sg-red"></div>
                    <span className="font-semibold text-sg-red text-sm sm:text-base">Loading...</span>
                  </div>
                </div>
              )}

              {/* Login Form - Responsive */}
              <div className={`transition-all duration-500 ease-in-out ${isLogin ? 'block' : 'hidden'}`}>
                <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 focus:bg-white text-sm sm:text-base disabled:opacity-50"
                      placeholder="Enter your username"
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 focus:bg-white text-sm sm:text-base disabled:opacity-50"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Button3D
                      type="submit"
                      buttonColor="bg-sg-red"
                      shadowColor="bg-black"
                      className="w-full py-2.5 sm:py-3 lg:py-3.5 text-sm sm:text-base font-semibold rounded-md sm:rounded-lg"
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In to Dashboard'}
                    </Button3D>
                  </div>
                </form>
              </div>

              {/* Register Form - Responsive */}
              <div className={`transition-all duration-500 ease-in-out ${!isLogin ? 'block' : 'hidden'}`}>
                <form onSubmit={handleRegisterSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        disabled={loading}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 focus:bg-white text-sm sm:text-base disabled:opacity-50"
                        placeholder="Full name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        required
                        disabled={loading}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 focus:bg-white text-sm sm:text-base disabled:opacity-50"
                        value={registerData.role}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                      >
                        <option value="">Select role</option>
                        <option value="HR">HR Manager</option>
                        <option value="Interviewer">Interviewer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="regUsername" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Username
                    </label>
                    <input
                      id="regUsername"
                      name="username"
                      type="text"
                      required
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 focus:bg-white text-sm sm:text-base disabled:opacity-50"
                      placeholder="Choose a username"
                      value={registerData.username}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="regEmail" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Email Address
                    </label>
                    <input
                      id="regEmail"
                      name="email"
                      type="email"
                      required
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 focus:bg-white text-sm sm:text-base disabled:opacity-50"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="regPassword" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Password
                    </label>
                    <input
                      id="regPassword"
                      name="password"
                      type="password"
                      required
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 focus:bg-white text-sm sm:text-base disabled:opacity-50"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Button3D
                      type="submit"
                      buttonColor="bg-sg-red"
                      shadowColor="bg-black"
                      className="w-full py-2.5 sm:py-3 lg:py-3.5 text-sm sm:text-base font-semibold rounded-md sm:rounded-lg"
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button3D>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer - Responsive */}
            <div className="text-center mt-6 sm:mt-8">
              <p className="text-xs sm:text-sm text-gray-500">
                © 2025 Société Générale. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
