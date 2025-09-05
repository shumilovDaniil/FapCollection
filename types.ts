export enum Rarity {
  Common = 'Обычная',
  Rare = 'Редкая',
  Epic = 'Эпическая',
  Legendary = 'Легендарная',
}

export interface CardStats {
  strength: number;
  healing: number;
}

export type CardRole = 'attack' | 'support';
export type SpecialEffect = 'skip_turn' | 'steal_card' | 'enhance_next_attack' | 'second_heart';

export interface Card {
  id: number;
  name: string;
  rarity: Rarity;
  imageUrl: string;
  effect: string;
  role: CardRole;
  stats: CardStats;
  specialEffect?: SpecialEffect;
  effectValue?: number;
}

export interface PlayerCard extends Card {
  instanceId: string; // Unique ID for each specific card instance a player owns
}

export interface PlayerCurrencies {
  fapCoins: number;
  lustGems: number;
}

export interface PlayerState {
  cards: PlayerCard[];
  currencies: PlayerCurrencies;
}

export enum Page {
  Collection = 'Коллекция',
  Battle = 'Бой',
  Chests = 'Сундуки',
  Crafting = 'Крафт',
  Shop = 'Магазин',
  Marketplace = 'Рынок',
  Developer = 'Разработка'
}

export interface Chest {
    id: string;
    name: string;
    description: string;
    cost: number;
    currency: keyof PlayerCurrencies;
    cardCount: [number, number]; // min, max cards
    rarityChances: { [key in Rarity]?: number };
    filter?: { role: CardRole };
}