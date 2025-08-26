import { ArrowRight, Users, Globe, Zap, Award } from 'lucide-react';

const LandingPage = ({ onExploreClick }) => {
  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-secondary-50 via-white to-accent-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary-900 to-secondary-700 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gradient-to-tr from-accent-300 to-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-tilt"></div>
      </div>

      <header className="relative z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-secondary-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SG</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Société Générale</h1>
                <p className="text-sm text-gray-600">Careers</p>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Shape the Future of Banking<span className="text-primary-600 block">With Société Générale</span></h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">Join a global leader in financial services. Build innovative solutions in markets, technology, and sustainable finance while growing your career.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onExploreClick} className="btn-primary text-lg px-8 py-4 flex items-center justify-center group">Explore Opportunities<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></button>
                <a href="/about" className="btn-secondary text-lg px-8 py-4 text-center">Learn More</a>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center"><div className="text-xl font-bold text-primary-600">200+</div><div className="text-sm text-gray-600">Open Roles</div></div>
                <div className="text-center"><div className="text-xl font-bold text-primary-600">117,000+</div><div className="text-sm text-gray-600">Employees</div></div>
                <div className="text-center"><div className="text-xl font-bold text-primary-600">60+</div><div className="text-sm text-gray-600">Countries</div></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Why Société Générale?</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3"><div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center"><Users className="w-5 h-5 text-primary-600" /></div><div><h3 className="font-semibold text-gray-900 mb-1">Inclusive Culture</h3><p className="text-gray-600 text-sm">Grow in an inclusive, collaborative environment</p></div></div>
                  <div className="flex items-start space-x-3"><div className="flex-shrink-0 w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center"><Globe className="w-5 h-5 text-accent-600" /></div><div><h3 className="font-semibold text-gray-900 mb-1">Global Impact</h3><p className="text-gray-600 text-sm">Work across markets with global teams</p></div></div>
                  <div className="flex items-start space-x-3"><div className="flex-shrink-0 w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center"><Zap className="w-5 h-5 text-secondary-600" /></div><div><h3 className="font-semibold text-gray-900 mb-1">Innovation</h3><p className="text-gray-600 text-sm">Build digital & sustainable finance solutions</p></div></div>
                  <div className="flex items-start space-x-3"><div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center"><Award className="w-5 h-5 text-primary-600" /></div><div><h3 className="font-semibold text-gray-900 mb-1">Growth</h3><p className="text-gray-600 text-sm">Clear paths with recognition and mobility</p></div></div>
                </div>
              </div>
              <div className="text-center"><p className="text-gray-500 text-sm">Part of a global banking group • <span className="text-primary-600 font-medium">150+ years of excellence</span></p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


