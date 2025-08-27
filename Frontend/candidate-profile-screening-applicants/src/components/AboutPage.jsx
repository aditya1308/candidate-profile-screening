import { Users, Globe, Zap, Award, Building, Target, Heart } from 'lucide-react';
import Header from './Header';

const AboutPage = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-accent-50">
      <Header 
        showBackButton={true}
        onBackClick={onBackToLanding}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Société Générale</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">We are a leading European financial services group, delivering innovation in markets and financing, and building a positive future through responsible banking.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>For over 150 years, Société Générale has supported economies and clients worldwide. Our teams combine strong banking expertise with cutting-edge technology to create impactful solutions.</p>
              <p>We foster an inclusive culture where people grow through mobility, learning, and collaboration across global locations and diverse business lines.</p>
              <p>From sustainable finance to digital transformation, we are committed to building a responsible future with our clients and communities.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl card">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center"><div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3"><Building className="w-8 h-8 text-primary-600" /></div><div className="text-2xl font-bold text-primary-600">15+</div><div className="text-sm text-gray-600">Years of Excellence</div></div>
              <div className="text-center"><div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3"><Globe className="w-8 h-8 text-accent-600" /></div><div className="text-2xl font-bold text-accent-600">25+</div><div className="text-sm text-gray-600">Countries</div></div>
              <div className="text-center"><div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3"><Users className="w-8 h-8 text-secondary-600" /></div><div className="text-2xl font-bold text-secondary-600">1000+</div><div className="text-sm text-gray-600">Team Members</div></div>
              <div className="text-center"><div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3"><Target className="w-8 h-8 text-primary-600" /></div><div className="text-2xl font-bold text-primary-600">500+</div><div className="text-sm text-gray-600">Projects Delivered</div></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-xl card">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6"><Target className="w-8 h-8 text-primary-600" /></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600">To empower organizations with innovative technology solutions that drive growth, efficiency, and competitive advantage. We believe technology should be a force for good, making complex problems simple and enabling human potential.</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl card">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-6"><Zap className="w-8 h-8 text-accent-600" /></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600">To be the world's most trusted technology partner, known for delivering transformative solutions that shape the future of industries and create lasting positive impact on society.</p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center"><div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><Heart className="w-10 h-10 text-primary-600" /></div><h3 className="text-xl font-bold text-gray-900 mb-3">Passion</h3><p className="text-gray-600">We approach every challenge with enthusiasm and dedication, believing that passion drives innovation and excellence.</p></div>
            <div className="text-center"><div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-10 h-10 text-accent-600" /></div><h3 className="text-xl font-bold text-gray-900 mb-3">Collaboration</h3><p className="text-gray-600">We believe the best solutions come from diverse perspectives working together towards a common goal.</p></div>
            <div className="text-center"><div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4"><Award className="w-10 h-10 text-secondary-600" /></div><h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3><p className="text-gray-600">We strive for the highest quality in everything we do, continuously improving and pushing boundaries.</p></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Technology Focus</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 card"><div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3"><Zap className="w-8 h-8 text-primary-600" /></div><h3 className="font-semibold text-gray-900 mb-2">Cloud Computing</h3><p className="text-sm text-gray-600">Scalable cloud solutions for modern businesses</p></div>
            <div className="text-center p-4 card"><div className="w-16 h-16 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3"><Globe className="w-8 h-8 text-accent-600" /></div><h3 className="font-semibold text-gray-900 mb-2">AI & Machine Learning</h3><p className="text-sm text-gray-600">Intelligent automation and data insights</p></div>
            <div className="text-center p-4 card"><div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3"><Users className="w-8 h-8 text-secondary-600" /></div><h3 className="font-semibold text-gray-900 mb-2">Digital Transformation</h3><p className="text-sm text-gray-600">End-to-end digital modernization</p></div>
            <div className="text-center p-4 card"><div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3"><Building className="w-8 h-8 text-primary-600" /></div><h3 className="font-semibold text-gray-900 mb-2">Enterprise Solutions</h3><p className="text-sm text-gray-600">Robust systems for large organizations</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;


