import React from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Crown,
  Droplet,
  Flame,
  GraduationCap,
  Heart,
  ShieldAlert,
  Star,
  Stethoscope,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// Rangos e insignias guardan el icono como texto; aquí se traduce a su componente.
const ICONS: Record<string, LucideIcon> = {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Crown,
  Droplet,
  Flame,
  GraduationCap,
  Heart,
  ShieldAlert,
  Sparkles: Star,
  Star,
  Stethoscope,
  Wallet,
  Zap,
};

export const NamedIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className = 'inline-block w-[1em] h-[1em]',
}) => {
  const Icon = ICONS[name] ?? Award;
  return <Icon className={className} />;
};

export default NamedIcon;
