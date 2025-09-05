

import React, { useState, useMemo } from 'react';
import { PlayerCard, Card, Rarity, FetishTag } from '../types';
import CardComponent from './CardComponent';
import { RARITY_ORDER, ALL_TAGS } from '../constants';
import { SortAscendingIcon, SortDescendingIcon } from './IconComponents';

type SortableStat = 'strength' | 'agility' | 'charisma' | 'stamina' | 'rage';
type SortBy = 'id' | 'name' | 'rarity' | SortableStat;
type SortOrder = 'asc' | 'desc';

interface CollectionPageProps {
  cards: (PlayerCard | Card)[];
  isModal?: boolean;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ cards, isModal = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
    const [tagFilter, setTagFilter] = useState<FetishTag | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortBy>('id');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const groupedCards = useMemo(() => {
        const acc = cards.reduce((acc, card) => {
            if (!acc[card.id]) {
                acc[card.id] = { card: card, count: 0 };
            }
            acc[card.id].count++;
            return acc;
        }, {} as { [key: number]: { card: Card; count: number } });
        return Object.values(acc);
    }, [cards]);

    const filteredAndSortedCards = useMemo(() => {
        if (isModal) return [];

        let filtered = groupedCards;

        // Filtering
        if (searchQuery) {
            filtered = filtered.filter(({ card }) =>
                card.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (rarityFilter !== 'all') {
            filtered = filtered.filter(({ card }) => card.rarity === rarityFilter);
        }
        if (tagFilter !== 'all') {
            filtered = filtered.filter(({ card }) => card.tags.includes(tagFilter));
        }

        // Sorting
        const sorted = [...filtered].sort((a, b) => {
            const cardA = a.card;
            const cardB = b.card;
            let compare = 0;
            switch (sortBy) {
                case 'name':
                    compare = cardA.name.localeCompare(cardB.name);
                    break;
                case 'rarity':
                    compare = RARITY_ORDER.indexOf(cardA.rarity) - RARITY_ORDER.indexOf(cardB.rarity);
                    break;
                case 'strength':
                case 'agility':
                case 'charisma':
                case 'stamina':
                case 'rage':
                    compare = cardA.stats[sortBy] - cardB.stats[sortBy];
                    break;
                case 'id':
                default:
                    compare = cardA.id - cardB.id;
                    break;
            }
            return sortOrder === 'asc' ? compare : -compare;
        });

        return sorted;
    }, [groupedCards, searchQuery, rarityFilter, tagFilter, sortBy, sortOrder, isModal]);


  if (cards.length === 0 && !isModal) {
    return (
        <div className="text-center text-gray-400 py-20">
            <h2 className="text-4xl font-heading text-[color:var(--brand-orange)]">Коллекция пуста</h2>
            <p className="mt-2 text-lg">Откройте сундуки, чтобы получить новые карты!</p>
        </div>
    );
  }
  
  const selectClassName = "bg-[color:var(--brand-panel)] border border-[color:var(--brand-teal)]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-orange)] transition w-full sm:w-auto font-semibold";

  const filterControls = (
      <div className="mb-8 p-4 bg-[color:var(--brand-panel)]/50 rounded-xl border border-[color:var(--brand-teal)]/20 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center animate-fade-in shadow-lg">
          <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[color:var(--brand-panel)] border border-[color:var(--brand-teal)]/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-orange)] transition w-full sm:w-auto flex-grow font-semibold"
              aria-label="Поиск по названию"
          />
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <select value={rarityFilter} onChange={e => setRarityFilter(e.target.value as Rarity | 'all')} className={selectClassName} aria-label="Фильтр по редкости">
                <option value="all">Все редкости</option>
                {RARITY_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={tagFilter} onChange={e => setTagFilter(e.target.value as FetishTag | 'all')} className={selectClassName} aria-label="Фильтр по тегу">
                <option value="all">Все теги</option>
                {ALL_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)} className={selectClassName} aria-label="Сортировать по">
                <option value="id">Сортировать по ID</option>
                <option value="name">По имени</option>
                <option value="rarity">По редкости</option>
                <option value="strength">По силе</option>
                <option value="agility">По ловкости</option>
                <option value="charisma">По харизме</option>
                <option value="stamina">По выносливости</option>
                <option value="rage">По ярости</option>
            </select>
            <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-[color:var(--brand-panel)] border border-[color:var(--brand-teal)]/30 rounded-lg text-white hover:bg-[color:var(--brand-teal)] hover:text-[color:var(--brand-bg)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-orange)] transition flex-shrink-0"
                aria-label={`Порядок сортировки: ${sortOrder === 'asc' ? 'по возрастанию' : 'по убыванию'}`}
            >
                {sortOrder === 'asc' ? <SortAscendingIcon className="w-5 h-5" /> : <SortDescendingIcon className="w-5 h-5" />}
            </button>
          </div>
      </div>
  );

  return (
    <div className={isModal ? "" : "animate-fade-in"}>
      {!isModal && (
        <>
            <div className="text-center mb-6">
                <h2 className="text-5xl font-heading text-[color:var(--brand-orange)] inline-block">Моя Коллекция</h2>
                <div className="h-1 w-32 bg-[color:var(--brand-teal)] rounded-full mx-auto mt-2 shadow-[0_0_15px_rgba(79,209,197,0.5)]"></div>
            </div>
            {filterControls}
        </>
      )}
      
      {filteredAndSortedCards.length === 0 && !isModal ? (
         <div className="text-center text-gray-400 py-20">
             <h2 className="text-4xl font-heading text-[color:var(--brand-orange)]">Карты не найдены</h2>
             <p className="mt-2 text-lg">Попробуйте изменить фильтры или откройте новые сундуки!</p>
         </div>
      ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {(isModal ? groupedCards : filteredAndSortedCards).map(({ card, count }) => (
                <CardComponent key={card.id} card={card} count={count} />
              ))}
          </div>
      )}
    </div>
  );
};

export default CollectionPage;