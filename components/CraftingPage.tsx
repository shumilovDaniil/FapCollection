import React from 'react';
import { PlayerCard, Rarity } from '../types';
import CardComponent from './CardComponent';
import { RARITY_ORDER } from '../constants';

interface CraftingPageProps {
  cards: PlayerCard[];
  onCraft: (cardId: number) => void;
}

const CraftingPage: React.FC<CraftingPageProps> = ({ cards, onCraft }) => {
  const groupedCards = cards.reduce((acc, card) => {
    if (card.rarity === Rarity.Masturbatory) return acc; // Cannot craft from max rarity
    if (!acc[card.id]) {
      acc[card.id] = { card: card, count: 0 };
    }
    acc[card.id].count++;
    return acc;
  }, {} as { [key: number]: { card: PlayerCard; count: number } });

  const craftableCards = Object.values(groupedCards).filter(group => group.count >= 5);
  const nextRarity = (rarity: Rarity) => {
      const index = RARITY_ORDER.indexOf(rarity);
      return index < RARITY_ORDER.length - 1 ? RARITY_ORDER[index+1] : null;
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-5xl font-heading mb-8 text-[color:var(--brand-orange)] text-center">Крафт Карт</h2>
      {craftableCards.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">У вас нет достаточного количества дубликатов для крафта. Нужно 5 одинаковых карт.</p>
      ) : (
        <div className="space-y-8 max-w-5xl mx-auto">
          {craftableCards.map(({ card, count }) => (
            <div key={card.id} className="bg-[color:var(--brand-panel)] p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[color:var(--brand-teal)]/20 shadow-lg">
              <div className="flex items-center gap-4">
                <CardComponent card={card} count={count} className="w-28 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold font-heading">{card.name}</h3>
                  <p className="text-gray-300">В наличии: {count}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-2xl font-bold text-gray-300 font-heading">
                <span>5 x {card.rarity}</span>
                <span className="text-[color:var(--brand-teal)] text-3xl">→</span>
                <span>1 x {nextRarity(card.rarity)}</span>
              </div>
              <button
                onClick={() => onCraft(card.id)}
                className="w-full md:w-auto bg-[color:var(--brand-orange)] hover:brightness-110 text-[color:var(--brand-bg)] font-bold py-3 px-8 rounded-lg transition-all duration-200 text-lg transform active:scale-95 shadow-lg shadow-[color:var(--brand-orange)]/20"
              >
                Создать
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CraftingPage;