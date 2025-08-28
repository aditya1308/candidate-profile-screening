import { ArrowRight, Users, Globe, Zap, Award, ChevronRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const LandingPage = ({ onExploreClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sg-gray via-white to-sg-gray/30">
      <Header className="relative z-20 bg-white/90 backdrop-blur-md border-b border-gray-100" />
      
      <main className="pt-20 h-screen flex items-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-sg-red/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-sg-red/3 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-sg-red/2 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left Section */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-sg-red/10 text-sg-red text-sm font-medium rounded-full border border-sg-red/20">
                  <span className="w-2 h-2 bg-sg-red rounded-full mr-2 animate-pulse"></span>
                  Now Hiring - 200+ Open Positions
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Shape the Future of
                  <span className="text-sg-red block bg-gradient-to-r from-sg-red to-sg-red/80 bg-clip-text text-transparent">
                    Banking
                  </span>
                  <span className="text-2xl lg:text-3xl font-semibold text-gray-600 mt-2 block">
                    With Société Générale
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Join a global leader in banking and financial services. Discover opportunities 
                  that match your skills and aspirations in an environment that values innovation, 
                  diversity, and sustainable growth.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onExploreClick} className="group relative w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-sg-red to-sg-red/90 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
                  <button className="relative w-full py-4 px-8 text-white font-semibold bg-gradient-to-r from-sg-red to-sg-red/90 hover:from-sg-red/90 hover:to-sg-red transition-all duration-300 transform group-hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sg-red/30 rounded-xl flex items-center justify-center text-lg shadow-lg">
                    Explore Opportunities
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </button>
                
                <a 
                  href="/about" 
                  className="group w-full sm:w-auto py-4 px-8 text-sg-red font-semibold border-2 border-sg-red/30 hover:border-sg-red hover:bg-sg-red/5 transition-all duration-300 rounded-xl text-center text-lg flex items-center justify-center"
                >
                  Learn More
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center group">
                  <div className="text-3xl font-bold text-sg-red group-hover:scale-110 transition-transform">200+</div>
                  <div className="text-sm text-gray-600 font-medium">Open Roles</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold text-sg-red group-hover:scale-110 transition-transform">117K+</div>
                  <div className="text-sm text-gray-600 font-medium">Employees</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold text-sg-red group-hover:scale-110 transition-transform">60+</div>
                  <div className="text-sm text-gray-600 font-medium">Countries</div>
                </div>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-sg-red to-sg-red/80 rounded-2xl flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Why Société Générale?</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-sg-red/5 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sg-red/10 to-sg-red/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-sg-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Inclusive Culture</h3>
                      <p className="text-gray-600 leading-relaxed">Grow in an inclusive, collaborative environment that celebrates diversity and innovation.</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-sg-red/5 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sg-red/10 to-sg-red/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Globe className="w-6 h-6 text-sg-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Global Impact</h3>
                      <p className="text-gray-600 leading-relaxed">Work across markets with global teams on projects that shape the future of finance.</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-sg-red/5 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sg-red/10 to-sg-red/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-sg-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Innovation</h3>
                      <p className="text-gray-600 leading-relaxed">Build cutting-edge digital & sustainable finance solutions that drive progress.</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-sg-red/5 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sg-red/10 to-sg-red/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6 text-sg-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Growth</h3>
                      <p className="text-gray-600 leading-relaxed">Clear career paths with recognition, mobility, and continuous learning opportunities.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-500 text-sm font-medium">
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



