import { Card, Rarity, Chest, PlayerCard, PlayerCurrencies } from './types';
import { INITIAL_CARDS } from './data/cards';
import { FIXER_DISTRICTS } from './data/contracts';

export { INITIAL_CARDS }; // Re-export for other modules like db.ts
export { FIXER_DISTRICTS }; // Re-export for the new contracts mode

export const RARITY_ORDER: Rarity[] = [Rarity.Common, Rarity.Rare, Rarity.Epic, Rarity.Legendary];

// FIX: Added 'gem' property to provide a color for the RarityGem component.
export const RARITY_STYLES: { [key in Rarity]: { bg: string; border: string; text: string; shadow: string; ring: string; gem: string } } = {
  [Rarity.Common]: { bg: 'bg-gray-800', border: 'border-gray-500', text: 'text-gray-200', shadow: 'shadow-gray-900/50', ring: 'ring-gray-500', gem: 'bg-gray-400' },
  [Rarity.Rare]: { bg: 'bg-blue-900', border: 'border-sky-500', text: 'text-sky-200', shadow: 'shadow-sky-700/50', ring: 'ring-sky-500', gem: 'bg-sky-400' },
  [Rarity.Epic]: { bg: 'bg-purple-900', border: 'border-purple-500', text: 'text-purple-200', shadow: 'shadow-purple-700/50', ring: 'ring-purple-500', gem: 'bg-purple-400' },
  [Rarity.Legendary]: { bg: 'bg-orange-900', border: 'border-amber-500', text: 'text-amber-200', shadow: 'shadow-amber-700/50', ring: 'ring-amber-500', gem: 'bg-amber-400' },
};

export const INITIAL_PLAYER_CURRENCIES: PlayerCurrencies = {
  eddies: 1000,
  lustGems: 100,
};

export const INITIAL_PLAYER_CARDS: PlayerCard[] = [
    { ...INITIAL_CARDS.find(c => c.id === 226)!, instanceId: crypto.randomUUID() }, // Нейро-взлом (steal)
    { ...INITIAL_CARDS.find(c => c.id === 116)!, instanceId: crypto.randomUUID() }, // Вирус 'System Shock' (skip)
    { ...INITIAL_CARDS.find(c => c.id === 118)!, instanceId: crypto.randomUUID() }, // Black Lace (enhance)
    { ...INITIAL_CARDS.find(c => c.id === 6)!, instanceId: crypto.randomUUID() },   // Second Heart
    { ...INITIAL_CARDS.find(c => c.id === 301)!, instanceId: crypto.randomUUID() },
];

export const CHESTS: Chest[] = [
    {
        id: 'common',
        name: 'Обычный Сундук',
        description: 'Содержит в основном обычные карты с небольшим шансом на что-то получше.',
        cost: 500,
        currency: 'eddies',
        cardCount: [3, 5],
        rarityChances: {
            [Rarity.Common]: 0.75,
            [Rarity.Rare]: 0.20,
            [Rarity.Epic]: 0.04,
            [Rarity.Legendary]: 0.01,
        },
    },
    {
        id: 'premium',
        name: 'Премиум Сундук',
        description: 'Повышенные шансы на получение редких и эпических карт. Гарантированно содержит хотя бы одну редкую карту.',
        cost: 100,
        currency: 'lustGems',
        cardCount: [5, 7],
        rarityChances: {
            [Rarity.Common]: 0.40,
            [Rarity.Rare]: 0.45,
            [Rarity.Epic]: 0.12,
            [Rarity.Legendary]: 0.03,
        },
    },
    {
        id: 'legendary',
        name: 'Легендарный Пак',
        description: 'Очень дорогой, но гарантирует получение эпической или легендарной карты.',
        cost: 500,
        currency: 'lustGems',
        cardCount: [4, 6],
        rarityChances: {
            [Rarity.Common]: 0.10,
            [Rarity.Rare]: 0.50,
            [Rarity.Epic]: 0.30,
            [Rarity.Legendary]: 0.10,
        },
    },
    {
        id: 'attacker_cache',
        name: "Кэш Атакующего",
        description: "Содержит только атакующие карты. Идеально для создания агрессивной колоды.",
        cost: 150,
        currency: 'lustGems',
        cardCount: [4, 4],
        rarityChances: {
            [Rarity.Common]: 0.50,
            [Rarity.Rare]: 0.35,
            [Rarity.Epic]: 0.12,
            [Rarity.Legendary]: 0.03,
        },
        filter: { role: 'attack' }
    },
    {
        id: 'support_pack',
        name: "Пакет Поддержки",
        description: "Содержит только карты поддержки и исцеления. Укрепите свою оборону.",
        cost: 150,
        currency: 'lustGems',
        cardCount: [4, 4],
        rarityChances: {
            [Rarity.Common]: 0.50,
            [Rarity.Rare]: 0.35,
            [Rarity.Epic]: 0.12,
            [Rarity.Legendary]: 0.03,
        },
        filter: { role: 'support' }
    }
];

export const MARKETPLACE_LISTINGS: (PlayerCard & { price: number })[] = [
    { ...INITIAL_CARDS.find(c => c.id === 205)!, instanceId: crypto.randomUUID(), price: 1200 },
    { ...INITIAL_CARDS.find(c => c.id === 218)!, instanceId: crypto.randomUUID(), price: 2500 },
    { ...INITIAL_CARDS.find(c => c.id === 102)!, instanceId: crypto.randomUUID(), price: 8000 },
];