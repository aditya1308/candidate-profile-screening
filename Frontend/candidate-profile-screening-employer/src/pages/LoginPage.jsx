import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import SGLogo from '../assets/SG.svg';
import Button3D from '../components/Button3D';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const success = login(credentials.email, credentials.password);
    if (success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // For now, just show success message (no actual implementation)
    setError('Registration feature coming soon!');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating elements with blur */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-200/30 rounded-full animate-float blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-200/30 rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-200/30 rounded-full animate-float blur-xl" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-indigo-200/30 rounded-full animate-float blur-xl" style={{ animationDelay: '6s' }}></div>
        
        {/* Subtle animated lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200/50 to-transparent animate-slide"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent animate-slide" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-200/30 to-transparent animate-slide" style={{ animationDelay: '10s' }}></div>
      </div>

      {/* Logo - Larger */}
      <div className="absolute top-6 left-6 z-20">
        <img src={SGLogo} alt="Societe Generale" className="h-10 w-auto opacity-80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Tab Switching - Floating rectangles with animation */}
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
                              className={`flex-1 py-3 px-6 text-base font-semibold transition-all duration-500 ease-in-out transform ${
                  isLogin 
                    ? 'bg-white text-sg-red shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-gray-800 scale-100'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
                              className={`flex-1 py-3 px-6 text-base font-semibold transition-all duration-500 ease-in-out transform ${
                  !isLogin 
                    ? 'bg-white text-sg-red shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-gray-800 scale-100'
                }`}
            >
              Register
            </button>
          </div>

          {/* Card with dynamic height based on content */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/40 relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            
            {/* Content wrapper with animation */}
            <div className="relative z-10">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                  <div className="text-sm text-red-600">{error}</div>
                </div>
              )}

              {/* Login Form with slide animation */}
              <div className={`transition-all duration-500 ease-in-out transform ${isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
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
                      className="text-base py-4"
                    >
                      Sign In
                    </Button3D>
                  </div>
                </form>
              </div>

              {/* Register Form with slide animation */}
              <div className={`transition-all duration-500 ease-in-out transform ${!isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'}`}>
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
                        placeholder="Full name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-3">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        required
                        className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 text-base"
                        value={registerData.role}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                      >
                        <option value="" className="bg-white text-gray-800">Select role</option>
                        <option value="hr" className="bg-white text-gray-800">HR Manager</option>
                        <option value="interviewer" className="bg-white text-gray-800">Interviewer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="regEmail" className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address
                    </label>
                    <input
                      id="regEmail"
                      name="email"
                      type="email"
                      required
                      className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="regPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                      Password
                    </label>
                    <input
                      id="regPassword"
                      name="password"
                      type="password"
                      required
                      className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sg-red/50 focus:border-sg-red/50 transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
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
                      className="text-base py-4"
                    >
                      Create Account
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
