import React, { useContext } from 'react';
import { Card, Rarity } from '../types'; // Import Rarity enum
import { RARITY_STYLES } from '../constants';
import { StrengthIcon, AgilityIcon, CharismaIcon, StaminaIcon, RageIcon } from './IconComponents';
import { ImageContext } from '../context/ImageContext';

interface CardComponentProps {
  card: Card;
  count?: number;
  onClick?: () => void;
  className?: string;
}

// New Rarity Gem component
const RarityGem: React.FC<{ color: string }> = ({ color }) => (
  <div className={`w-3 h-3 rounded-full ${color} shadow-lg ring-2 ring-white/50 animate-pulse`}></div>
);

const CardComponent: React.FC<CardComponentProps> = ({ card, count, onClick, className }) => {
  // Use RARITY_STYLES directly from constants.ts
  const styles = RARITY_STYLES[card.rarity];
  const customImages = useContext(ImageContext);
  const displayImageUrl = customImages.get(card.id) || card.imageUrl;

  return (
    <div
      className={`relative rounded-3xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-offset-2 ${styles.shadow} ${styles.ring} ring-offset-gray-950 aspect-[2/3] w-full max-w-[250px] group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Имитация рамки с градиентом */}
      <div className={`absolute inset-0 rounded-3xl p-[3px] bg-gradient-to-br from-white/20 to-transparent ${styles.border} group-hover:from-white/40 group-hover:to-white/10 transition-colors duration-300`}>
        <div className="w-full h-full rounded-[1.2rem] overflow-hidden">
          <img src={displayImageUrl} alt={card.name} className="w-full h-full object-cover" />
        </div>
      </div>
      
      {/* Уменьшенная прозрачность для лучшей видимости картинки */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-4">
        <h3 className={`font-heading text-2xl font-bold leading-tight drop-shadow-lg ${styles.text}`}>{card.name}</h3>
        <p className={`text-xs font-semibold ${styles.text} opacity-80 uppercase`}>
          Тип: {card.rarity}
        </p>
        
        <div className="border-t border-white/20 my-2"></div>

        {/* Default stats view with icons */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-sm text-white/90 font-mono group-hover:hidden">
            <div className="flex items-center" title="Сила"><StrengthIcon className="w-4 h-4 mr-1 text-red-400 flex-shrink-0"/> {card.stats.strength}</div>
            <div className="flex items-center" title="Ловкость"><AgilityIcon className="w-4 h-4 mr-1 text-green-400 flex-shrink-0"/> {card.stats.agility}</div>
            <div className="flex items-center" title="Харизма"><CharismaIcon className="w-4 h-4 mr-1 text-yellow-400 flex-shrink-0"/> {card.stats.charisma}</div>
            <div className="flex items-center" title="Выносливость"><StaminaIcon className="w-4 h-4 mr-1 text-blue-400 flex-shrink-0"/> {card.stats.stamina}</div>
            <div className="flex items-center" title="Ярость"><RageIcon className="w-4 h-4 mr-1 text-orange-400 flex-shrink-0"/> {card.stats.rage}</div>
        </div>
        
        {/* Detailed stats view on hover */}
        <div className="hidden w-full text-sm space-y-0.5 font-mono text-gray-300 group-hover:block">
            <div className="flex justify-between items-center"><span className="opacity-75 text-xs">Сила</span> <span className="font-bold text-red-400">{card.stats.strength}</span></div>
            <div className="flex justify-between items-center"><span className="opacity-75 text-xs">Ловкость</span> <span className="font-bold text-green-400">{card.stats.agility}</span></div>
            <div className="flex justify-between items-center"><span className="opacity-75 text-xs">Харизма</span> <span className="font-bold text-yellow-400">{card.stats.charisma}</span></div>
            <div className="flex justify-between items-center"><span className="opacity-75 text-xs">Выносливость</span> <span className="font-bold text-blue-400">{card.stats.stamina}</span></div>
            <div className="flex justify-between items-center"><span className="opacity-75 text-xs">Ярость</span> <span className="font-bold text-orange-400">{card.stats.rage}</span></div>
        </div>

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {card.tags.map(tag => (
            <span key={tag} className="bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full border border-white/20">
              {tag}
            </span>
          ))}
        </div>

        {/* Индикатор редкости (камень) */}
        <div className="absolute top-4 right-4">
          <RarityGem color={styles.gem} />
        </div>
      </div>
      
      {count && count > 1 && (
        <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg border-2 border-purple-300 shadow-lg">
          x{count}
        </div>
      )}
    </div>
  );
};

export default CardComponent;
