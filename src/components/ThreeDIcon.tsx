import { FC } from 'react';

export type ThreeDIconType = 
  | 'code' 
  | 'database' 
  | 'education' 
  | 'palette' 
  | 'trophy' 
  | 'rocket' 
  | 'mail' 
  | 'pin' 
  | 'sparkle'
  | 'cert'
  | 'layers';

interface ThreeDIconProps {
  type: ThreeDIconType;
  size?: number;
  className?: string;
}

export const ThreeDIcon: FC<ThreeDIconProps> = ({ type, size = 48, className = '' }) => {
  switch (type) {
    case 'code':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-[0_8px_16px_rgba(59,130,246,0.35)] ${className}`}>
          <defs>
            <linearGradient id="code_cube_top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="code_cube_left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="code_cube_right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <filter id="code_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* 3D Isometric Cube Base */}
          <path d="M32 6 L54 18 L32 30 L10 18 Z" fill="url(#code_cube_top)" />
          <path d="M10 18 L32 30 L32 54 L10 42 Z" fill="url(#code_cube_left)" />
          <path d="M32 30 L54 18 L54 42 L32 54 Z" fill="url(#code_cube_right)" />
          {/* Top facet highlight rim */}
          <path d="M32 7 L52 18 L32 29 L12 18 Z" stroke="#93c5fd" strokeWidth="1" strokeOpacity="0.6" fill="none" />
          {/* Glowing 3D Code Symbol */}
          <path d="M22 28 L17 33 L22 38" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#code_glow)" />
          <path d="M42 28 L47 33 L42 38" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#code_glow)" />
          <path d="M34 26 L30 40" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" filter="url(#code_glow)" />
        </svg>
      );

    case 'database':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-[0_8px_16px_rgba(16,185,129,0.35)] ${className}`}>
          <defs>
            <linearGradient id="db_top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="db_body1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
          </defs>
          {/* Bottom Disk */}
          <path d="M12 40 C12 36 21 34 32 34 C43 34 52 36 52 40 L52 48 C52 52 43 55 32 55 C21 55 12 52 12 48 Z" fill="url(#db_body1)" />
          <ellipse cx="32" cy="40" rx="20" ry="6" fill="#059669" opacity="0.6" />
          {/* Mid Disk */}
          <path d="M12 26 C12 22 21 20 32 20 C43 20 52 22 52 26 L52 34 C52 38 43 40 32 40 C21 40 12 38 12 34 Z" fill="url(#db_body1)" />
          <ellipse cx="32" cy="26" rx="20" ry="6" fill="#059669" opacity="0.6" />
          {/* Top Disk */}
          <path d="M12 12 C12 8 21 6 32 6 C43 6 52 8 52 12 L52 20 C52 24 43 26 32 26 C21 26 12 24 12 20 Z" fill="url(#db_body1)" />
          <ellipse cx="32" cy="12" rx="20" ry="6" fill="url(#db_top)" />
          <ellipse cx="32" cy="12" rx="17" ry="4" stroke="#a7f3d0" strokeWidth="1" opacity="0.8" fill="none" />
          {/* Neon Ring Dots */}
          <circle cx="20" cy="17" r="1.5" fill="#6ee7b7" />
          <circle cx="20" cy="31" r="1.5" fill="#6ee7b7" />
          <circle cx="20" cy="45" r="1.5" fill="#6ee7b7" />
        </svg>
      );

    case 'education':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-[0_8px_16px_rgba(99,102,241,0.35)] ${className}`}>
          <defs>
            <linearGradient id="mortar_top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="mortar_side" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4338ca" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
            <linearGradient id="tassel_gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          {/* 3D Skullcap base */}
          <path d="M22 28 C22 36 26 42 32 42 C38 42 42 36 42 28 Z" fill="url(#mortar_side)" />
          {/* 3D Diamond Mortarboard Rhombus */}
          <path d="M32 10 L58 22 L32 34 L6 22 Z" fill="url(#mortar_top)" />
          <path d="M32 12 L55 22 L32 32 L9 22 Z" stroke="#c7d2fe" strokeWidth="1" opacity="0.6" fill="none" />
          {/* Button in center */}
          <ellipse cx="32" cy="22" rx="3" ry="1.8" fill="url(#tassel_gold)" />
          {/* 3D Tassel string */}
          <path d="M32 23 Q46 25 48 36" stroke="url(#tassel_gold)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="48" cy="38" r="2.5" fill="url(#tassel_gold)" />
          {/* Floating Diploma Scroll */}
          <rect x="22" y="47" width="20" height="7" rx="3.5" fill="#f8fafc" transform="rotate(-6 22 47)" />
          <path d="M26 45 L26 53" stroke="#ef4444" strokeWidth="2" transform="rotate(-6 26 45)" />
        </svg>
      );

    case 'palette':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-[0_8px_16px_rgba(236,72,153,0.35)] ${className}`}>
          <defs>
            <linearGradient id="pal_base" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            <linearGradient id="pal_depth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#be185d" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>
          </defs>
          {/* 3D Palette shadow face */}
          <path d="M12 36 C8 24 16 12 30 10 C46 8 56 18 54 32 C52 44 42 46 36 44 C32 43 30 46 28 50 C26 54 18 54 14 46 Z" fill="url(#pal_depth)" transform="translate(0, 4)" />
          {/* Top Surface */}
          <path d="M12 32 C8 20 16 8 30 6 C46 4 56 14 54 28 C52 40 42 42 36 40 C32 39 30 42 28 46 C26 50 18 50 14 42 Z" fill="url(#pal_base)" />
          {/* 3D Color Orbs */}
          <circle cx="24" cy="16" r="4" fill="#38bdf8" />
          <circle cx="23" cy="15" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="38" cy="15" r="4" fill="#fbbf24" />
          <circle cx="37" cy="14" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="46" cy="26" r="4" fill="#34d399" />
          <circle cx="45" cy="25" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="36" cy="34" r="4" fill="#a855f7" />
          <circle cx="35" cy="33" r="1.5" fill="#ffffff" opacity="0.8" />
          {/* Thumb hole */}
          <ellipse cx="20" cy="38" rx="4" ry="5" fill="#831843" />
        </svg>
      );

    case 'trophy':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-[0_8px_16px_rgba(245,158,11,0.35)] ${className}`}>
          <defs>
            <linearGradient id="gold_cup" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="gold_base" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>
          {/* Base Stand */}
          <rect x="20" y="48" width="24" height="8" rx="3" fill="url(#gold_base)" />
          <rect x="22" y="47" width="20" height="2" fill="#fbbf24" opacity="0.6" />
          <path d="M28 42 L36 42 L34 48 L30 48 Z" fill="url(#gold_cup)" />
          {/* Cup Body */}
          <path d="M18 14 L46 14 C46 26 40 38 32 38 C24 38 18 26 18 14 Z" fill="url(#gold_cup)" />
          <ellipse cx="32" cy="14" rx="14" ry="4" fill="#fde047" />
          {/* Left Handle */}
          <path d="M18 18 C12 18 10 26 18 30" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Right Handle */}
          <path d="M46 18 C52 18 54 26 46 30" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Star on Cup */}
          <path d="M32 20 L33.5 24 L38 24.5 L34.5 27.5 L35.5 32 L32 29.5 L28.5 32 L29.5 27.5 L26 24.5 L30.5 24 Z" fill="#ffffff" opacity="0.9" />
        </svg>
      );

    case 'rocket':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-[0_8px_16px_rgba(239,68,68,0.35)] ${className}`}>
          <defs>
            <linearGradient id="rocket_hull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="60%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="rocket_wings" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="flame" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {/* Flames */}
          <path d="M22 42 L16 54 L26 48 L20 60 L32 46 Z" fill="url(#flame)" />
          {/* Fins */}
          <path d="M24 30 L16 40 L26 42 Z" fill="url(#rocket_wings)" />
          <path d="M38 20 L48 26 L42 36 Z" fill="url(#rocket_wings)" />
          {/* Main Fuselage */}
          <path d="M20 38 C22 28 32 16 48 8 C40 24 28 34 18 36 Z" fill="url(#rocket_hull)" transform="rotate(-15 32 32)" />
          {/* Porthole */}
          <circle cx="34" cy="24" r="5" fill="#0284c7" />
          <circle cx="34" cy="24" r="3.5" fill="#38bdf8" />
          <circle cx="33" cy="23" r="1.2" fill="#ffffff" />
        </svg>
      );

    case 'mail':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-[0_8px_16px_rgba(59,130,246,0.35)] ${className}`}>
          <defs>
            <linearGradient id="env_back" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="env_front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="env_flap" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path d="M10 20 L32 34 L54 20 L54 46 C54 49 51 52 48 52 L16 52 C13 52 10 49 10 46 Z" fill="url(#env_front)" />
          <path d="M10 20 L32 34 L54 20 L32 8 Z" fill="url(#env_flap)" />
          <path d="M10 20 L28 36 M54 20 L36 36" stroke="#1d4ed8" strokeWidth="2" strokeOpacity="0.5" />
          {/* 3D Notification Orb */}
          <circle cx="48" cy="16" r="6" fill="#ef4444" />
          <circle cx="47" cy="14" r="2" fill="#fca5a5" />
        </svg>
      );

    case 'pin':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-[0_8px_16px_rgba(244,63,94,0.35)] ${className}`}>
          <defs>
            <linearGradient id="pin_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="60%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>
          </defs>
          {/* Ground shadow */}
          <ellipse cx="32" cy="56" rx="14" ry="4" fill="rgba(0,0,0,0.3)" />
          {/* Pin 3D Body */}
          <path d="M32 54 C24 42 16 34 16 24 C16 13 23 8 32 8 C41 8 48 13 48 24 C48 34 40 42 32 54 Z" fill="url(#pin_grad)" />
          {/* Center Orb */}
          <circle cx="32" cy="22" r="7" fill="#ffffff" />
          <circle cx="32" cy="22" r="4.5" fill="#be123c" />
          <circle cx="31" cy="20" r="1.5" fill="#ffffff" opacity="0.8" />
        </svg>
      );

    case 'cert':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-[0_8px_16px_rgba(245,158,11,0.35)] ${className}`}>
          <defs>
            <linearGradient id="cert_sheet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="cert_seal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          {/* Paper Certificate */}
          <rect x="12" y="10" width="40" height="46" rx="4" fill="url(#cert_sheet)" transform="rotate(-3 32 33)" />
          <rect x="16" y="14" width="32" height="38" rx="2" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" fill="none" transform="rotate(-3 32 33)" />
          <path d="M20 22 L40 21 M20 27 L44 26 M20 32 L36 31" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          {/* Ribbon & Golden Seal */}
          <circle cx="38" cy="44" r="8" fill="url(#cert_seal)" />
          <circle cx="38" cy="44" r="5" stroke="#fef08a" strokeWidth="1" fill="none" />
          <path d="M35 48 L33 58 L38 55 L43 58 L41 48" fill="#d97706" />
        </svg>
      );

    case 'sparkle':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`drop-shadow-[0_8px_16px_rgba(168,85,247,0.35)] ${className}`}>
          <defs>
            <linearGradient id="gem_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
          </defs>
          <path d="M32 4 L37 25 L58 32 L37 39 L32 60 L27 39 L6 32 L27 25 Z" fill="url(#gem_grad)" />
          <path d="M32 12 L35 27 L50 32 L35 37 L32 52 L29 37 L14 32 L29 27 Z" fill="#ffffff" opacity="0.6" />
          <circle cx="32" cy="32" r="3" fill="#ffffff" />
        </svg>
      );
  }
};
