import { ArrowRight, Users, Globe, Zap, Award, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

const LandingPage = ({ onExploreClick }) => {
  const [counts, setCounts] = useState({
    roles: 0,
    employees: 0,
    countries: 0
  });

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        animateCounts();
        setHasAnimated(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [hasAnimated]);

  const animateCounts = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Smooth easing

      setCounts({
        roles: Math.floor(200 * easeOutQuart),
        employees: Math.floor(117000 * easeOutQuart),
        countries: Math.floor(60 * easeOutQuart)
      });

      if (currentStep >= steps) {
        setCounts({
          roles: 200,
          employees: 117000,
          countries: 60
        });
        clearInterval(interval);
      }
    }, stepDuration);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+';
    }
    return num + '+';
  };

  return (
    <div className="h-screen bg-gradient-to-br from-sg-gray via-white to-sg-gray/30 overflow-hidden">
      <Header className="relative z-20 bg-white/90 backdrop-blur-md border-b border-gray-100" />
      
      <main className="h-full flex items-center relative overflow-hidden pb-20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-sg-red/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-sg-red/3 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-sg-red/2 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-4 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
            {/* Left Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center px-3 py-1.5 bg-sg-red/10 text-sg-red text-xs font-medium rounded-full border border-sg-red/20">
                  <span className="w-1.5 h-1.5 bg-sg-red rounded-full mr-2 animate-pulse"></span>
                  Now Hiring - 200+ Open Positions
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Shape the Future of
                  <span className="text-sg-red block bg-gradient-to-r from-sg-red to-sg-red/80 bg-clip-text text-transparent">
                    Banking
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mt-1 block">
                    With Société Générale
                  </span>
                </h1>
                
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
                  Join a global leader in banking and financial services. Discover opportunities 
                  that match your skills and aspirations in an environment that values innovation, 
                  diversity, and sustainable growth.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={onExploreClick} className="group relative w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-sg-red to-sg-red/90 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
                  <button className="relative w-full py-3 px-6 text-white font-semibold bg-gradient-to-r from-sg-red to-sg-red/90 hover:from-sg-red/90 hover:to-sg-red transition-all duration-300 transform group-hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sg-red/30 rounded-xl flex items-center justify-center text-sm sm:text-base shadow-lg">
                    Explore Opportunities
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </button>
                
                <a 
                  href="/about" 
                  className="group w-full sm:w-auto py-3 px-6 text-sg-red font-semibold border-2 border-sg-red/30 hover:border-sg-red hover:bg-sg-red/5 transition-all duration-300 rounded-xl text-center text-sm sm:text-base flex items-center justify-center"
                >
                  Learn More
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-3">
                <div className="text-center group">
                  <div className="text-xl sm:text-2xl font-bold text-sg-red group-hover:scale-110 transition-transform">
                    {formatNumber(counts.roles)}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Open Roles</div>
                </div>
                <div className="text-center group">
                  <div className="text-xl sm:text-2xl font-bold text-sg-red group-hover:scale-110 transition-transform">
                    {formatNumber(counts.employees)}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Employees</div>
                </div>
                <div className="text-center group">
                  <div className="text-xl sm:text-2xl font-bold text-sg-red group-hover:scale-110 transition-transform">
                    {formatNumber(counts.countries)}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Countries</div>
                </div>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-sg-red to-sg-red/80 rounded-xl flex items-center justify-center mr-3">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Why Société Générale?</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-sg-red/5 transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sg-red/10 to-sg-red/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-4 h-4 text-sg-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm">Inclusive Culture</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">Grow in an inclusive, collaborative environment that celebrates diversity and innovation.</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-sg-red/5 transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sg-red/10 to-sg-red/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Globe className="w-4 h-4 text-sg-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm">Global Impact</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">Work across markets with global teams on projects that shape the future of finance.</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-sg-red/5 transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sg-red/10 to-sg-red/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4 text-sg-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm">Innovation</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">Build cutting-edge digital & sustainable finance solutions that drive progress.</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-sg-red/5 transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sg-red/10 to-sg-red/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="w-4 h-4 text-sg-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm">Growth</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">Clear career paths with recognition, mobility, and continuous learning opportunities.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-500 text-xs font-medium">
                  Part of a global banking group • <span className="text-sg-red font-bold">150+ years of excellence</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;



