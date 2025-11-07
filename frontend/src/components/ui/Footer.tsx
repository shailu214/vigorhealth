import React from 'react';
import Logo from '../ui/Logo';

interface FooterProps {
  onStartAssessment?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onStartAssessment }) => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Medical Services',
      links: [
        { label: '🩺 Health Assessment', href: '#assessment' },
        { label: '🔬 AI Diagnostics', href: '#diagnostics' },
        { label: '📊 Health Reports', href: '#reports' },
        { label: '🏥 Provider Network', href: '#providers' },
        { label: '💊 Medication Tracking', href: '#medications' },
      ]
    },
    {
      title: 'Health Resources',
      links: [
        { label: '📖 Health Library', href: '#library' },
        { label: '🎓 Health Education', href: '#education' },
        { label: '📱 Mobile App', href: '#app' },
        { label: '🔔 Health Alerts', href: '#alerts' },
        { label: '📈 Wellness Tips', href: '#wellness' },
      ]
    },
    {
      title: 'Support & Legal',
      links: [
        { label: '🔐 Privacy Policy', href: '#privacy' },
        { label: '⚕️ Medical Terms', href: '#terms' },
        { label: '🛡️ GDPR Compliance', href: '#gdpr' },
        { label: '📞 Medical Support', href: '#support' },
        { label: '❓ FAQ', href: '#faq' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#facebook' },
    { name: 'Twitter', icon: '🐦', href: '#twitter' },
    { name: 'LinkedIn', icon: '💼', href: '#linkedin' },
    { name: 'Instagram', icon: '📷', href: '#instagram' },
    { name: 'YouTube', icon: '📺', href: '#youtube' },
  ];

  return (
    <footer className="medical-footer text-white">
      <div className="medical-footer-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Logo size="md" className="mb-6" />
              <p className="text-medical-blue-light mb-6 text-lg leading-relaxed max-w-md">
                <strong>VIGOR HEALTH 360</strong> provides AI-powered medical assessments trusted by healthcare professionals worldwide. 
                Get personalized health insights with medical-grade accuracy and professional guidance.
              </p>
              <div className="flex space-x-4 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 medical-bg-primary-soft rounded-full flex items-center justify-center hover:bg-medical-teal-light transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                    title={social.name}
                  >
                    <span className="text-xl">{social.icon}</span>
                  </a>
                ))}
              </div>
              <button
                onClick={onStartAssessment}
                className="px-8 py-3 bg-white text-medical-blue rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl medical-glow-blue"
              >
                🩺 Start Your Health Assessment
              </button>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-xl font-bold text-medical-white mb-6 flex items-center">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-medical-blue-light hover:text-medical-mint transition-colors duration-300 flex items-center space-x-2 group"
                      >
                        <span className="group-hover:transform group-hover:scale-110 transition-transform duration-300">
                          {link.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Medical Certifications & Badges */}
          <div className="border-t border-medical-blue/20 pt-8 mb-8">
            <div className="text-center">
              <h5 className="text-lg font-semibold text-medical-white mb-4">
                🏆 Medical Certifications & Compliance
              </h5>
              <div className="flex flex-wrap justify-center items-center gap-6 text-medical-blue-light">
                <span className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                  <span>🛡️</span>
                  <span>HIPAA Compliant</span>
                </span>
                <span className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                  <span>⚕️</span>
                  <span>FDA Guidelines</span>
                </span>
                <span className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                  <span>🔐</span>
                  <span>GDPR Compliant</span>
                </span>
                <span className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                  <span>🏥</span>
                  <span>Medical Grade AI</span>
                </span>
              </div>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="border-t border-medical-blue/20 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-medical-blue-light text-lg">
                © {currentYear} <strong>VIGOR HEALTH 360</strong>. All rights reserved.
              </p>
              <p className="text-medical-blue-light/80 text-sm max-w-2xl">
                ⚕️ This medical AI platform provides health insights and is designed to support, 
                not replace, professional medical consultation and diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;