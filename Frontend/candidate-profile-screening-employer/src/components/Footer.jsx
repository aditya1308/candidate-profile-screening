import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: 'https://m.facebook.com/socgensolutions/', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/societegenerale?lang=en', label: 'Twitter' },
    { icon: Linkedin, href: 'https://in.linkedin.com/company/societe_generale_global_solution_centre', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/societegenerale?igsh=ZHp3b2w0ZHBxNW5l', label: 'Instagram' }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-700 shadow-lg">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Copyright */}
        <div className="flex items-center">
          <p className="text-sm text-gray-300 transition-colors duration-200 hover:text-white">
            © {currentYear} Société Générale. All rights reserved.
          </p>
        </div>

        {/* Right side - Social Media */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white">
            Follow us:
          </span>
          <div className="flex items-center space-x-3">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex items-center justify-center w-8 h-8 text-gray-400 transition-all duration-300 rounded-full hover:text-sg-red hover:bg-sg-red/10 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sg-red/50"
                  aria-label={social.label}
                >
                  <IconComponent className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
