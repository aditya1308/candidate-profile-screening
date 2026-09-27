import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCandidateAuth } from '../context/useCandidateAuth';
import Header from './Header';
import Footer from './Footer';

const CandidateLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useCandidateAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Inline field errors
  const [errors, setErrors] = useState({});

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (generalError) setGeneralError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      setRegisterData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (generalError) setGeneralError('');
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginData.identifier.trim()) {
      newErrors.identifier = 'Email or username is required';
    }
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    if (!registerData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!registerData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateLoginForm()) return;

    setLoading(true);
    try {
      await login(loginData.identifier, loginData.password);
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/jobs';
        navigate(from, { replace: true });
      }, 500);
    } catch (err) {
      setGeneralError(err.message || 'Invalid email/username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateRegisterForm()) return;

    setLoading(true);
    try {
      await register({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        phoneNumber: registerData.phone || '0000000000',
        password: registerData.password
      });

      setSuccessMessage('Registration successful! Please sign in with your credentials.');
      setIsLogin(true);
      setLoginData({
        identifier: registerData.email,
        password: ''
      });
      setRegisterData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setLoginData({
      identifier: 'candidate@socgen.com',
      password: 'password123'
    });
    setErrors({});
    setGeneralError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sg-gray via-white to-sg-gray/30">
      <Header
        showNavigation={true}
        showBackButton={true}
        backButtonText="Back to Home"
        onBackClick={() => navigate('/')}
        className="relative z-20 bg-white/90 backdrop-blur-md border-b border-gray-100"
      />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        {/* Background decorative elements matching landing page */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-sg-red/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-tr from-sg-red/3 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Card Header Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-3 py-1.5 bg-sg-red/10 text-sg-red text-xs sm:text-sm font-medium rounded-full border border-sg-red/20 mb-3">
              <span className="w-1.5 h-1.5 bg-sg-red rounded-full mr-2 animate-pulse"></span>
              Candidate Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isLogin
                ? 'Sign in to track your job applications and status'
                : 'Register to start applying and managing your profile'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrors({});
                setGeneralError('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${
                isLogin
                  ? 'bg-white text-sg-red shadow-md transform scale-[1.02]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrors({});
                setGeneralError('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${
                !isLogin
                  ? 'bg-white text-sg-red shadow-md transform scale-[1.02]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/60">
            {/* Feedback Notifications */}
            {generalError && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 text-red-700 animate-fadeIn">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium">{generalError}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-2.5 text-green-700 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium">{successMessage}</span>
              </div>
            )}

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Email or Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="identifier"
                      value={loginData.identifier}
                      onChange={handleLoginChange}
                      disabled={loading}
                      placeholder="Enter your email or username"
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-sg-red/30 focus:border-sg-red transition-all duration-200 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:bg-white ${
                        errors.identifier ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.identifier && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.identifier}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      disabled={loading}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-11 py-2.5 sm:py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-sg-red/30 focus:border-sg-red transition-all duration-200 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:bg-white ${
                        errors.password ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 sm:py-3.5 px-6 text-white font-semibold bg-gradient-to-r from-sg-red to-sg-red/90 hover:from-sg-red/90 hover:to-sg-red transition-all duration-300 rounded-xl flex items-center justify-center text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Sign In</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Demo Helper */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-500 mb-2">Want to test with sample credentials?</p>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-xs font-semibold text-sg-red hover:underline focus:outline-none"
                  >
                    Auto-fill Demo Credentials (candidate@socgen.com)
                  </button>
                </div>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      disabled={loading}
                      placeholder="e.g. John Doe"
                      className={`w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-sg-red/30 focus:border-sg-red transition-all duration-200 text-sm text-gray-800 focus:bg-white ${
                        errors.name ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      disabled={loading}
                      placeholder="e.g. candidate@example.com"
                      className={`w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-sg-red/30 focus:border-sg-red transition-all duration-200 text-sm text-gray-800 focus:bg-white ${
                        errors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      disabled={loading}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sg-red/30 focus:border-sg-red transition-all duration-200 text-sm text-gray-800 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      disabled={loading}
                      placeholder="At least 6 characters"
                      className={`w-full pl-10 pr-11 py-2 sm:py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-sg-red/30 focus:border-sg-red transition-all duration-200 text-sm text-gray-800 focus:bg-white ${
                        errors.password ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      disabled={loading}
                      placeholder="Re-enter your password"
                      className={`w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-sg-red/30 focus:border-sg-red transition-all duration-200 text-sm text-gray-800 focus:bg-white ${
                        errors.confirmPassword ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 sm:py-3.5 px-6 text-white font-semibold bg-gradient-to-r from-sg-red to-sg-red/90 hover:from-sg-red/90 hover:to-sg-red transition-all duration-300 rounded-xl flex items-center justify-center text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Register Account</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CandidateLogin;
