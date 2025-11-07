import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface SiteSettings {
  siteName: string;
  logoUrl: string;
  footerText: string;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'HEALTH INSIGHT AI',
    logoUrl: '',
    footerText: 'Your Personal Health Assessment Platform'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/settings/public');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        console.log('Settings API not available, using defaults');
      }
    } catch (error) {
      console.log('Settings API not available, using defaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  const textSizes = {
    sm: { main: 'text-lg', sub: 'text-sm', tagline: 'text-xs' },
    md: { main: 'text-2xl', sub: 'text-lg', tagline: 'text-sm' },
    lg: { main: 'text-3xl', sub: 'text-xl', tagline: 'text-base' }
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className={`${sizeClasses[size]} w-auto animate-pulse bg-gray-300 rounded`}></div>
        {size !== 'sm' && (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Image or Default SVG */}
      <div className={`${sizeClasses[size]} w-auto flex items-center`}>
        {settings.logoUrl ? (
          <img 
            src={settings.logoUrl} 
            alt={settings.siteName}
            className={`${sizeClasses[size]} w-auto object-contain`}
            onError={(e) => {
              // Fallback to default logo if image fails to load
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <svg viewBox="0 0 400 400" class="${sizeClasses[size]} w-auto" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#4F46E5" />
                        <stop offset="100%" stop-color="#3B82F6" />
                      </linearGradient>
                      <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#EC4899" />
                        <stop offset="100%" stop-color="#DB2777" />
                      </linearGradient>
                      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#10B981" />
                        <stop offset="100%" stop-color="#059669" />
                      </linearGradient>
                    </defs>
                    <path d="M200 50 L350 350 L50 350 Z" fill="url(#blueGradient)" opacity="0.9"/>
                    <path d="M200 50 L275 250 L125 250 Z" fill="url(#pinkGradient)" />
                    <path d="M200 150 L350 350 L200 350 Z" fill="url(#greenGradient)" />
                    <path d="M200 200 L300 350 L100 350 Z" fill="white" />
                  </svg>
                `;
              }
            }}
          />
        ) : (
          <svg 
            viewBox="0 0 100 100" 
            className={`${sizeClasses[size]} w-auto`}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Modern Health Logo */}
            <defs>
              <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1"/>
              </radialGradient>
            </defs>
            
            {/* Outer circle - main brand */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="url(#primaryGradient)" 
              stroke="#ffffff"
              strokeWidth="2"
            />
            
            {/* Health cross symbol */}
            <rect 
              x="46" 
              y="25" 
              width="8" 
              height="50" 
              fill="white" 
              rx="4"
            />
            <rect 
              x="25" 
              y="46" 
              width="50" 
              height="8" 
              fill="white" 
              rx="4"
            />
            
            {/* Heart pulse line */}
            <path 
              d="M 15 35 Q 25 25, 35 35 T 55 35 Q 65 25, 75 35 T 95 35" 
              stroke="url(#accentGradient)" 
              strokeWidth="3" 
              fill="none" 
              opacity="0.8"
            />
            
            {/* Center highlight */}
            <circle 
              cx="50" 
              cy="50" 
              r="35" 
              fill="url(#centerGlow)" 
            />
            
            {/* Wellness dots */}
            <circle cx="30" cy="70" r="3" fill="url(#accentGradient)" opacity="0.7"/>
            <circle cx="70" cy="70" r="3" fill="url(#accentGradient)" opacity="0.7"/>
            <circle cx="50" cy="80" r="2" fill="url(#accentGradient)" opacity="0.5"/>
          </svg>
        )}
      </div>
      
      {/* Site Name and Tagline */}
      {size !== 'sm' && (
        <div className="flex flex-col">
          <div className={`${textSizes[size].main} font-bold tracking-tight`}>
            <span style={{ color: '#3b82f6' }}>{settings.siteName.split(' ')[0] || 'HEALTH'}</span>
            <span className="text-gray-800 ml-1">{settings.siteName.split(' ')[1] || 'INSIGHT'}</span>
          </div>
          <div className={`${textSizes[size].sub} font-semibold text-gray-600 tracking-wide`}>
            <span style={{ color: '#10b981' }}>{settings.siteName.split(' ')[2] || 'AI'}</span>
          </div>
          {size === 'lg' && (
            <div className={`${textSizes[size].tagline} italic text-gray-600 mt-1`}>
              {settings.footerText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;