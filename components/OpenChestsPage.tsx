

import React from 'react';
import { CHESTS } from '../constants';
import { Chest } from '../types';
import { FapCoinIcon, LustGemIcon } from './IconComponents';

interface OpenChestsPageProps {
  onOpenChest: (chest: Chest) => void;
}

const ChestComponent: React.FC<{ chest: Chest; onOpen: () => void }> = ({ chest, onOpen }) => {
    return (
        <div className="bg-[color:var(--brand-panel)] border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center transform hover:scale-105 hover:border-[color:var(--brand-teal)] transition-all duration-300 shadow-lg shadow-black/30">
            <div className="text-6xl mb-4 transition-transform group-hover:scale-110">{chest.id === 'common' ? '🎁' : chest.id === 'premium' ? '💎' : '😈'}</div>
            <h3 className="text-3xl font-heading text-[color:var(--brand-orange)]">{chest.name}</h3>
            <p className="text-gray-300 my-3 flex-grow">{chest.description}</p>
            <button
                onClick={onOpen}
                className="mt-4 w-full bg-[color:var(--brand-orange)] hover:brightness-110 text-gray-900 font-bold py-3 px-4 rounded-full transition-all duration-200 flex items-center justify-center space-x-2 text-lg transform active:scale-95 shadow-lg shadow-[color:var(--brand-orange)]/20"
            >
                <span>Открыть за {chest.cost}</span>
                {chest.currency === 'fapCoins' ? <FapCoinIcon className="w-6 h-6"/> : <LustGemIcon className="w-6 h-6"/>}
            </button>
        </div>
    );
}


const OpenChestsPage: React.FC<OpenChestsPageProps> = ({ onOpenChest }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-5xl font-heading mb-8 text-[color:var(--brand-orange)] text-center">Открыть Сундуки</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {CHESTS.map((chest) => (
          <ChestComponent key={chest.id} chest={chest} onOpen={() => onOpenChest(chest)} />
        ))}
      </div>
    </div>
  );
};

export default OpenChestsPage;