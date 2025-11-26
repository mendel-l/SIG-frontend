import TankIcon from '@/assets/icons/TankIcon';

interface TankMarkerProps {
  active: boolean;
  size?: number;
}

export default function TankMarker({ active, size = 40 }: TankMarkerProps) {
  return (
    <div className="custom-marker">
      <TankIcon state={active} size={size} />
    </div>
  );
}

