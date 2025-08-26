import { LogOut, User, Briefcase, Home, FileText, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, currentPage }) => {
  const { currentUser, logout } = useAuth();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'talent-acquisition':
        return 'Talent Acquisition';
      case 'interview-team':
        return 'Interview Team';
      default:
        return 'Team Member';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'talent-acquisition':
        return <Briefcase className="w-4 h-4" />;
      case 'interview-team':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const navigationItems = [
    {
      name: 'Job Openings',
      href: '#',
      icon: <FileText className="w-4 h-4" />,
      current: currentPage === 'dashboard'
    },
    {
      name: 'Applications',
      href: '#',
      icon: <Users className="w-4 h-4" />,
      current: currentPage === 'applications'
    },
    {
      name: 'Analytics',
      href: '#',
      icon: <BarChart3 className="w-4 h-4" />,
      current: currentPage === 'analytics'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechCorp Solutions</h1>
                <p className="text-sm text-gray-600">Hiring Management System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  {getRoleIcon(currentUser.role)}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-gray-600">{getRoleDisplayName(currentUser.role)}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  item.current
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
