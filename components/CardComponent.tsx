import React, { useContext } from 'react';
import { Card, Rarity } from '../types'; // Import Rarity enum
import { RARITY_STYLES } from '../constants';
import { StrengthIcon, HealingIcon, SpecialEffectIcon } from './IconComponents';
import { ImageContext } from '../context/ImageContext';

interface CardComponentProps {
  card: Card;
  count?: number;
  onClick?: () => void;
  className?: string;
  size?: 'normal' | 'small';
}

// New Rarity Gem component
const RarityGem: React.FC<{ color: string }> = ({ color }) => (
  <div className={`w-3 h-3 rounded-full ${color} shadow-lg ring-2 ring-white/50 animate-pulse`}></div>
);

const CardComponent: React.FC<CardComponentProps> = ({ card, count, onClick, className, size = 'normal' }) => {
  // Use RARITY_STYLES directly from constants.ts
  const styles = RARITY_STYLES[card.rarity];
  const customImages = useContext(ImageContext);
  const displayImageUrl = customImages.get(card.id) || card.imageUrl;
  const isSmall = size === 'small';

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
      
      {/* Затемнение под текстом для лучшей читаемости */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end rounded-b-[1.2rem] ${isSmall ? 'p-2 pt-10' : 'p-4 pt-20'}`}>
        <h3 className={`font-heading font-bold leading-tight drop-shadow-lg ${styles.text} ${isSmall ? 'text-base' : 'text-2xl'}`}>{card.name}</h3>
        <p className={`font-semibold ${styles.text} opacity-80 uppercase ${isSmall ? 'text-[9px]' : 'text-xs'}`}>
          Тип: {card.rarity}
        </p>
        
        <div className={`border-t border-white/20 ${isSmall ? 'my-1' : 'my-2'}`}></div>

        {/* Default stats view with icons */}
        <div className={`flex text-white/90 font-mono group-hover:hidden ${isSmall ? 'text-xs space-x-2' : 'text-sm space-x-4'}`}>
            {card.stats.strength > 0 && <div className="flex items-center" title="Сила"><StrengthIcon className={`text-red-400 flex-shrink-0 ${isSmall ? 'w-3 h-3 mr-0.5' : 'w-4 h-4 mr-1'}`}/> {card.stats.strength}</div>}
            {card.stats.healing > 0 && <div className="flex items-center" title="Исцеление"><HealingIcon className={`text-emerald-400 flex-shrink-0 ${isSmall ? 'w-3 h-3 mr-0.5' : 'w-4 h-4 mr-1'}`}/> {card.stats.healing}</div>}
        </div>
        
        {/* Detailed stats view on hover */}
        <div className={`hidden w-full space-y-0.5 font-mono text-gray-300 group-hover:block ${isSmall ? 'text-xs' : 'text-sm'}`}>
            {card.stats.strength > 0 && <div className="flex justify-between items-center"><span className={`opacity-75 ${isSmall ? 'text-[10px]' : 'text-xs'}`}>Сила</span> <span className="font-bold text-red-400">{card.stats.strength}</span></div>}
            {card.stats.healing > 0 && <div className="flex justify-between items-center"><span className={`opacity-75 ${isSmall ? 'text-[10px]' : 'text-xs'}`}>Исцеление</span> <span className="font-bold text-emerald-400">{card.stats.healing}</span></div>}
        </div>

      </div>
        {/* Индикатор редкости (камень) */}
        <div className={`absolute flex items-center space-x-2 ${isSmall ? 'top-2 right-2' : 'top-4 right-4'}`}>
           {/* FIX: The `title` prop is not valid on these SVG components. Wrapped them in a span with a title attribute to provide a tooltip. */}
           { card.specialEffect && 
            <span title="Специальный Эффект"><SpecialEffectIcon className={`text-yellow-300 opacity-80 ${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`}/></span>
           }
           { card.role === 'support' ? 
            <span title="Карта Поддержки"><HealingIcon className={`text-emerald-300 opacity-80 ${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`}/></span> : 
            <span title="Карта Атаки"><StrengthIcon className={`text-red-400 opacity-80 ${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`}/></span>
           }
          <RarityGem color={styles.gem} />
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