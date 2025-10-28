interface TankIconProps {
  state?: boolean;
  size?: number;
  className?: string;
}

export default function TankIcon({ state = true, size = 40, className = '' }: TankIconProps) {
  const fillColor = state ? '#3b82f6' : '#ef4444';
  const darkFillColor = state ? '#2563eb' : '#dc2626';
  const darkestFillColor = state ? '#1e40af' : '#991b1b';
  const strokeColor = '#ffffff';
  const opacity = state ? '1' : '0.5';

  return (
    <svg 
      width={size} 
      height={size * 1.2} 
      viewBox="0 0 40 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      style={{ opacity }}
    >
      {/* Base del tanque */}
      <rect 
        x="8" 
        y="20" 
        width="24" 
        height="24" 
        rx="2" 
        fill={fillColor} 
        stroke={strokeColor} 
        strokeWidth="2"
      />
      
      {/* Tapa superior */}
      <ellipse 
        cx="20" 
        cy="22" 
        rx="10" 
        ry="3" 
        fill={darkFillColor} 
        stroke={strokeColor} 
        strokeWidth="2"
      />
      
      {/* Tapón superior */}
      <circle 
        cx="20" 
        cy="22" 
        r="3" 
        fill={darkestFillColor}
      />
      
      {/* Tubo de salida */}
      <rect 
        x="28" 
        y="28" 
        width="6" 
        height="4" 
        rx="1" 
        fill={fillColor} 
        stroke={strokeColor} 
        strokeWidth="1"
      />
      <rect 
        x="32" 
        y="30" 
        width="3" 
        height="8" 
        rx="1" 
        fill={fillColor}
      />
    </svg>
  );
}

