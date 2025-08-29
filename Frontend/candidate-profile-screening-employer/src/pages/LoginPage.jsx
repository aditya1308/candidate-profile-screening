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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating elements with blur */}
        <div className="absolute w-40 h-40 rounded-full -top-20 -right-20 bg-red-200/30 animate-float blur-xl"></div>
        <div className="absolute w-40 h-40 rounded-full -bottom-20 -left-20 bg-blue-200/30 animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-32 h-32 rounded-full top-1/3 right-1/4 bg-purple-200/30 animate-float blur-xl" style={{ animationDelay: '4s' }}></div>
        <div className="absolute w-24 h-24 rounded-full bottom-1/3 left-1/4 bg-indigo-200/30 animate-float blur-xl" style={{ animationDelay: '6s' }}></div>
        
        {/* Subtle animated lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200/50 to-transparent animate-slide"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent animate-slide" style={{ animationDelay: '5s' }}></div>
        <div className="absolute left-0 w-full h-px top-1/2 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent animate-slide" style={{ animationDelay: '10s' }}></div>
      </div>

      {/* Logo - Larger */}
      <div className="absolute z-20 top-6 left-6">
        <img src={SGLogo} alt="Societe Generale" className="w-auto h-10 opacity-80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-lg">
          {/* Tab Switching - Floating rectangles with animation */}
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              disabled={loading}
              className={`flex-1 py-3 px-6 text-base font-semibold transition-all duration-500 ease-in-out transform ${
                isLogin 
                  ? 'bg-white text-sg-red shadow-lg scale-105' 
                  : 'text-gray-600 hover:text-gray-800 scale-100'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              disabled={loading}
              className={`flex-1 py-3 px-6 text-base font-semibold transition-all duration-500 ease-in-out transform ${
                !isLogin 
                  ? 'bg-white text-sg-red shadow-lg scale-105' 
                  : 'text-gray-600 hover:text-gray-800 scale-100'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Register
            </button>
          </div>

          {/* Card with dynamic height based on content */}
          <div className="relative p-8 overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-md rounded-2xl border-white/40">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            
            {/* Content wrapper with animation */}
            <div className="relative z-10">
              {/* Error Message */}
              {error && (
                <div className={`mb-6 p-4 rounded-lg animate-fadeIn ${
                  error.includes('successful') 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`text-sm ${
                    error.includes('successful') ? 'text-green-600' : 'text-red-600'
                  }`}>{error}</div>
                </div>
              )}

              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
                  <div className="font-semibold text-sg-red">Loading...</div>
                </div>
              )}

              {/* Login Form with slide animation */}
              <div className={`transition-all duration-500 ease-in-out transform ${isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block mb-3 text-sm font-semibold text-gray-700">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      disabled={loading}
                      className="w-full px-5 py-4 text-base text-gray-800 placeholder-gray-500 transition-all duration-300 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 disabled:opacity-50"
                      placeholder="Enter your username"
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-3 text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      disabled={loading}
                      className="w-full px-5 py-4 text-base text-gray-800 placeholder-gray-500 transition-all duration-300 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 disabled:opacity-50"
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
                      className="py-4 text-base"
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button3D>
                  </div>
                </form>
              </div>

              {/* Register Form with slide animation */}
              <div className={`transition-all duration-500 ease-in-out transform ${!isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'}`}>
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block mb-3 text-sm font-semibold text-gray-700">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        disabled={loading}
                        className="w-full px-5 py-4 text-base text-gray-800 placeholder-gray-500 transition-all duration-300 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 disabled:opacity-50"
                        placeholder="Full name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block mb-3 text-sm font-semibold text-gray-700">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        required
                        disabled={loading}
                        className="w-full px-5 py-4 text-base text-gray-800 transition-all duration-300 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 disabled:opacity-50"
                        value={registerData.role}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                      >
                        <option value="" className="text-gray-800 bg-white">Select role</option>
                        <option value="HR" className="text-gray-800 bg-white">HR Manager</option>
                        <option value="Interviewer" className="text-gray-800 bg-white">Interviewer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="regUsername" className="block mb-3 text-sm font-semibold text-gray-700">
                      Username
                    </label>
                    <input
                      id="regUsername"
                      name="username"
                      type="text"
                      required
                      disabled={loading}
                      className="w-full px-5 py-4 text-base text-gray-800 placeholder-gray-500 transition-all duration-300 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 disabled:opacity-50"
                      placeholder="Choose a username"
                      value={registerData.username}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="regEmail" className="block mb-3 text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <input
                      id="regEmail"
                      name="email"
                      type="email"
                      required
                      disabled={loading}
                      className="w-full px-5 py-4 text-base text-gray-800 placeholder-gray-500 transition-all duration-300 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 disabled:opacity-50"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="regPassword" className="block mb-3 text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <input
                      id="regPassword"
                      name="password"
                      type="password"
                      required
                      disabled={loading}
                      className="w-full px-5 py-4 text-base text-gray-800 placeholder-gray-500 transition-all duration-300 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 disabled:opacity-50"
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
                      className="py-4 text-base"
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button3D>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
