import React from 'react';
import { CHESTS } from '../constants';
import { Chest } from '../types';
import { EddyIcon, LustGemIcon } from './IconComponents';

interface OpenChestsPageProps {
  onOpenChest: (chest: Chest) => void;
}

const ChestComponent: React.FC<{ chest: Chest; onOpen: () => void }> = ({ chest, onOpen }) => {
    return (
        <div className="bg-[color:var(--brand-panel)] border-2 border-[color:var(--brand-accent)]/50 p-6 flex flex-col items-center text-center transform hover:scale-105 hover:border-[color:var(--brand-accent)] transition-all duration-300">
            <h3 className="text-3xl font-heading text-[color:var(--brand-accent)] mb-4">{chest.name}</h3>
            <p className="text-gray-300 my-3 flex-grow">{chest.description}</p>
            <button
                onClick={onOpen}
                className="mt-4 w-full bg-[color:var(--brand-warning)] hover:brightness-110 text-white font-bold py-3 px-4 transition-all duration-200 flex items-center justify-center space-x-2 text-lg transform active:scale-95"
            >
                <span>Открыть за {chest.cost}</span>
                {chest.currency === 'eddies' ? <EddyIcon className="w-6 h-6"/> : <LustGemIcon className="w-6 h-6"/>}
            </button>
        </div>
    );
}


const OpenChestsPage: React.FC<OpenChestsPageProps> = ({ onOpenChest }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-heading mb-8 text-[color:var(--brand-accent)] text-center">Открыть Сундуки</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
        {CHESTS.map((chest) => (
          <ChestComponent key={chest.id} chest={chest} onOpen={() => onOpenChest(chest)} />
        ))}
      </div>
    </div>
  );
};

export default OpenChestsPage;