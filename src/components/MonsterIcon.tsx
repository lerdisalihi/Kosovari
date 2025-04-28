import React, { useState } from 'react';
import { IssueCategory, categoryMonsters } from '../store/issues';

interface MonsterIconProps {
  category: IssueCategory;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const MonsterIcon: React.FC<MonsterIconProps> = ({ 
  category, 
  size = 'medium',
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const monsterSrc = categoryMonsters[category];
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-20 h-20'
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div className={`relative ${className}`}>
      {imageError ? (
        // Fallback to emoji if image fails to load
        <div className={`${sizeClasses[size]} flex items-center justify-center bg-gray-100 rounded-full`}>
          {getCategoryEmoji(category)}
        </div>
      ) : (
        <img 
          src={monsterSrc} 
          alt={`${category} monster`}
          className={`${sizeClasses[size]} object-contain`}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

// Fallback to emoji if image is not available
const getCategoryEmoji = (category: IssueCategory): string => {
  const emojis: Record<IssueCategory, string> = {
    traffic: '🚗',
    environment: '🌱',
    economy: '💼',
    living: '🏘️',
    damage: '🔧',
    heritage: '🏛️'
  };
  return emojis[category];
};

export default MonsterIcon; 