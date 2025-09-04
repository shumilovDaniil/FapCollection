import React, { useContext } from 'react';
import { Card } from '../types';
import { RARITY_STYLES } from '../constants';
import { StrengthIcon, AgilityIcon, CharismaIcon, StaminaIcon, RageIcon } from './IconComponents';
import { ImageContext } from '../context/ImageContext';

interface CardComponentProps {
  card: Card;
  count?: number;
  onClick?: () => void;
  className?: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ card, count, onClick, className }) => {
  const styles = RARITY_STYLES[card.rarity];
  const customImages = useContext(ImageContext);
  const displayImageUrl = customImages.get(card.id) || card.imageUrl;

  return (
    <div
      className={`relative rounded-xl border-2 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl aspect-[2/3] w-full max-w-[250px] group ${styles.border} ${styles.shadow} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <img src={displayImageUrl} alt={card.name} className="w-full h-full object-cover" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-3">
        <h3 className={`font-heading text-lg leading-tight ${styles.text}`}>{card.name}</h3>
        <p className={`text-xs font-semibold ${styles.text} opacity-80`}>Тип: {card.rarity}</p>
        
        <div className="border-t border-white/20 my-1.5"></div>

        {/* Default stats view with icons */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-xs text-white/90 font-mono group-hover:hidden">
            <div className="flex items-center" title="Сила"><StrengthIcon className="w-3.5 h-3.5 mr-1 text-red-400 flex-shrink-0"/> {card.stats.strength}</div>
            <div className="flex items-center" title="Ловкость"><AgilityIcon className="w-3.5 h-3.5 mr-1 text-green-400 flex-shrink-0"/> {card.stats.agility}</div>
            <div className="flex items-center" title="Харизма"><CharismaIcon className="w-3.5 h-3.5 mr-1 text-yellow-400 flex-shrink-0"/> {card.stats.charisma}</div>
            <div className="flex items-center" title="Выносливость"><StaminaIcon className="w-3.5 h-3.5 mr-1 text-blue-400 flex-shrink-0"/> {card.stats.stamina}</div>
            <div className="flex items-center" title="Ярость"><RageIcon className="w-3.5 h-3.5 mr-1 text-orange-400 flex-shrink-0"/> {card.stats.rage}</div>
        </div>
        
        {/* Detailed stats view on hover */}
        <div className="hidden w-full text-sm space-y-0.5 font-mono text-gray-300 group-hover:block">
            <div className="flex justify-between items-center"><span className="opacity-75 text-xs">Сила</span> <span className="font-bold text-red-400">{card.stats.strength}</span></div>
            <div className="flex justify-between items-center"><span className="opacity-75 text-xs">Ловкость</span> <span className="font-bold text-green-400">{card.stats.agility}</span></div>
            <div className="flex justify-between items-center"><span className="opacity-75 text-xs">Харизма</span> <span className="font-bold text-yellow-400">{card.stats.charisma}</span></div>
            <div className="flex justify-between items-center"><span className="opacity-75 text-xs">Выносливость</span> <span className="font-bold text-blue-400">{card.stats.stamina}</span></div>
            <div className="flex justify-between items-center"><span className="opacity-75 text-xs">Ярость</span> <span className="font-bold text-orange-400">{card.stats.rage}</span></div>
        </div>

        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {card.tags.map(tag => (
            <span key={tag} className="bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {count && count > 1 && (
        <div className="absolute top-2 right-2 bg-[color:var(--brand-orange)] text-[color:var(--brand-bg)] rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg border-2 border-[color:var(--brand-panel)]">
          x{count}
        </div>
      )}
    </div>
  );
};

export default CardComponent;